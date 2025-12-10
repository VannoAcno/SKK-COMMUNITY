<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PasswordController extends Controller
{
    public function sendResetCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Email tidak valid atau tidak terdaftar.'], 422);
        }

        $email = $request->email;
        $attemptsToday = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->where('created_at', '>=', now()->startOfDay())
            ->count();

        if ($attemptsToday >= 3) {
            return response()->json(['message' => 'Batas maksimal 3 permintaan/hari.'], 429);
        }

        $code = rand(100000, 999999);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => $code, 'created_at' => now()]
        );

        \Mail::raw("Kode verifikasi Anda: {$code}\n\nKode ini berlaku selama 5 menit.", function ($message) use ($email) {
            $message->to($email)->subject('Kode Verifikasi - SKK Community');
        });

        return response()->json(['message' => 'Kode verifikasi telah dikirim ke email Anda.']);
    }

    public function verifyResetCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code' => 'required|numeric|digits:6',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Data tidak valid.'], 422);
        }

        $valid = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->exists();

        if (!$valid) {
            return response()->json(['message' => 'Kode tidak valid atau kadaluarsa.'], 400);
        }

        return response()->json(['message' => 'Kode valid. Silakan masukkan password baru.']);
    }

    public function resetPasswordViaCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code' => 'required|numeric|digits:6',
            'password' => 'required|string|min:8|confirmed',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Data tidak valid.'], 422);
        }

        $token = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->first();

        if (!$token) {
            return response()->json(['message' => 'Kode tidak valid atau kadaluarsa.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Password baru tidak boleh sama.'], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password berhasil diubah.']);
    }
}