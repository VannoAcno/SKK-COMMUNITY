<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donasi;
use App\Models\DonasiKampanye;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class DonasiController extends Controller
{
    /**
     * Store a newly created donation in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'nominal' => 'required|integer|min:1000',
            'pesan' => 'nullable|string|max:500',
            'bukti_transfer' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'kampanye_id' => 'nullable|exists:donasi_kampanyes,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only(['nama', 'email', 'nominal', 'pesan', 'kampanye_id']);

        if ($request->hasFile('bukti_transfer')) {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');
            $file = $request->file('bukti_transfer');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            $response = Http::attach(
                'file', file_get_contents($file->getRealPath()), $fileName
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
                'folder' => 'bukti-donasi',
            ]);

            if ($response->successful()) {
                $uploadResult = $response->json();
                $data['bukti_transfer_path'] = $uploadResult['secure_url'];
            } else {
                Log::error('Cloudinary upload failed for bukti_transfer', $response->json());
                return response()->json(['message' => 'Gagal upload bukti transfer'], 500);
            }
        }

        if ($request->user()) {
            $data['user_id'] = $request->user()->id;
        }

        $data['status'] = 'pending';

        try {
            $donasi = Donasi::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Donasi berhasil dikirim dan sedang menunggu verifikasi.',
                'data' => $donasi->only(['id', 'nama', 'email', 'nominal', 'pesan', 'status', 'created_at']),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Gagal menyimpan donasi: ' . $e->getMessage());

            if (isset($data['bukti_transfer_path'])) {
                $publicId = basename(parse_url($data['bukti_transfer_path'], PHP_URL_PATH));
                $this->deleteImageFromCloudinary($publicId);
            }

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan donasi.',
            ], 500);
        }
    }

    public function indexPublic()
    {
        $donasis = Donasi::with(['user:id,full_name', 'kampanye:id,judul'])
            ->where('status', 'success')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar donasi berhasil diambil.',
            'data' => $donasis,
        ]);
    }

    public function indexAdmin(Request $request)
    {
        $query = Donasi::with(['user:id,full_name', 'kampanye:id,judul']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $donasis = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar donasi berhasil diambil.',
            'data' => $donasis,
        ]);
    }

    public function showAdmin(Donasi $donasi)
    {
        $donasi->load(['user:id,full_name', 'kampanye:id,judul']);
        return response()->json([
            'success' => true,
            'message' => 'Detail donasi berhasil diambil.',
            'data' => $donasi,
        ]);
    }

    /**
     * Update status donasi dengan penanganan error robust.
     */
    public function updateStatus(Request $request, Donasi $donasi)
    {
        $action = $request->route()->getName();
        $status = match ($action) {
            'admin.donasi.konfirmasi' => 'success',
            'admin.donasi.tolak' => 'rejected',
            default => null,
        };

        if (!$status) {
            return response()->json([
                'success' => false,
                'message' => 'Action not allowed.',
            ], 400);
        }

        try {
            $result = DB::transaction(function () use ($donasi, $status) {
                $oldStatus = $donasi->status;
                $nominalDonasi = (int) $donasi->nominal;

                // Update status donasi
                $donasi->update(['status' => $status]);

                // Hanya proses kampanye jika ada
                if (!empty($donasi->kampanye_id)) {
                    $kampanye = DonasiKampanye::find($donasi->kampanye_id);

                    if ($kampanye) {
                        // Ambil total_donasi dan pastikan integer
                        $currentTotal = is_numeric($kampanye->total_donasi) ? (int) $kampanye->total_donasi : 0;
                        $newTotal = $currentTotal;

                        if ($status === 'success' && $oldStatus !== 'success') {
                            $newTotal += $nominalDonasi;
                        } elseif ($oldStatus === 'success' && $status !== 'success') {
                            $newTotal -= $nominalDonasi;
                        }

                        $newTotal = max(0, $newTotal);

                        // Update hanya jika berubah
                        if ($newTotal !== $currentTotal) {
                            $kampanye->update(['total_donasi' => $newTotal]);
                        }
                    }
                }

                return [
                    'success' => true,
                    'message' => "Donasi berhasil diubah menjadi {$status}.",
                    'data' => $donasi->only(['id', 'status', 'updated_at']),
                ];
            }, 5);

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Error dalam transaksi updateStatus donasi: ' . $e->getMessage(), [
                'donasi_id' => $donasi->id ?? 'unknown',
                'kampanye_id' => $donasi->kampanye_id ?? 'none',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate status donasi.',
            ], 500);
        }
    }

    private function deleteImageFromCloudinary($publicId)
    {
        try {
            $cloudName = env('CLOUDINARY_CLOUD_NAME');
            $apiKey = env('CLOUDINARY_API_KEY');
            $apiSecret = env('CLOUDINARY_API_SECRET');
            $timestamp = time();

            $signature = sha1("public_id={$publicId}&timestamp={$timestamp}{$apiSecret}");

            $response = Http::asForm()->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
                'public_id' => $publicId,
                'signature' => $signature,
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Failed to delete image from Cloudinary: ' . $e->getMessage());
            return false;
        }
    }
}