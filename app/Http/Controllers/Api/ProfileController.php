<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_date' => 'required|date',
            'school' => 'required|string|max:255',
            'grade' => 'required|string|max:10',
            'major' => 'nullable|string|max:100',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Upload avatar baru (jika ada file)
        if ($request->hasFile('avatar')) {
            $cloudName = env('VITE_CLOUDINARY_CLOUD_NAME');
            $uploadPreset = env('VITE_CLOUDINARY_UPLOAD_PRESET');

            $file = $request->file('avatar');
            $fileName = $file->getClientOriginalName();

            // ✅ Perbaiki: hapus spasi di URL
            $response = Http::attach(
                'file', file_get_contents($file->getRealPath()), $fileName
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
            ]);

            $data = $response->json();

            if (!$response->successful()) {
                return response()->json(['message' => 'Gagal upload avatar'], 500);
            }

            // Hapus avatar lama
            if ($user->avatar) {
                $this->deleteOldAvatarFromCloudinary($user->avatar);
            }

            $user->avatar = $data['secure_url'];
        }

        // Update data lain
        $user->fill($request->only([
            'full_name', 'gender', 'birth_date', 'school',
            'grade', 'major', 'phone', 'address'
        ]))->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $user->only([
                'id', 'full_name', 'gender', 'birth_date', 'school',
                'grade', 'major', 'email', 'phone', 'address', 'avatar'
            ])
        ]);
    }

    /**
     * Hapus avatar lama dari Cloudinary (ekstrak public_id dari URL)
     */
    private function deleteOldAvatarFromCloudinary($avatarUrl)
    {
        try {
            $path = parse_url($avatarUrl, PHP_URL_PATH);
            if (!$path) return false;

            $parts = explode('/', $path);
            $uploadIndex = array_search('upload', $parts);

            if ($uploadIndex !== false && isset($parts[$uploadIndex + 2])) {
                $publicId = implode('/', array_slice($parts, $uploadIndex + 2));
                $publicId = preg_replace('/\.[^.]*$/', '', $publicId);

                $cloudName = env('VITE_CLOUDINARY_CLOUD_NAME');
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

                Log::info('Deleted old avatar', ['public_id' => $publicId, 'success' => $response->successful()]);
                return $response->successful();
            }
        } catch (\Exception $e) {
            Log::error('Failed to delete avatar: ' . $e->getMessage());
        }
        return false;
    }
}