<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_date' => 'required|date',
            'school' => 'required|string|max:255',
            'grade' => 'required|string|max:10',
            'major' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Hash password sebelum menyimpan
        $validatedData = $request->validated();
        $validatedData['password'] = Hash::make($validatedData['password']);

        $user = User::create($validatedData);

        return response()->json([
            'message' => 'Pendaftaran berhasil! Silakan login.',
            'user' => $user->only([
                'id', 'full_name', 'gender', 'birth_date', 'school',
                'grade', 'major', 'email', 'phone', 'address', 'avatar', 'is_admin'
            ])
        ], 201);
    }

    /**
     * Login user and create token.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ Kembalikan SEMUA data termasuk is_admin
        return response()->json([
            'message' => 'Login berhasil.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->only([
                'id', 'full_name', 'gender', 'birth_date', 'school',
                'grade', 'major', 'email', 'phone', 'address', 'avatar', 'is_admin'
            ])
        ]);
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil logout.']);
    }

    // ✅ Tambahkan method ini untuk dashboard admin
    public function getAllUsers()
    {
        $users = User::select('id', 'full_name', 'email', 'birth_date', 'school', 'grade', 'major', 'phone', 'address', 'created_at', 'is_admin', 'avatar') // <-- Tambahkan 'avatar'
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($users);
    }
}