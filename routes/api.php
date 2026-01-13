<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\Admin\KegiatanController;
use App\Http\Controllers\Api\KegiatanPublicController;
use App\Http\Controllers\Api\PesertaKegiatanController;
use App\Http\Controllers\Api\Admin\RenunganController;
use App\Http\Controllers\Api\RenunganPublicController; // ✅ Sudah benar

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password reset routes
Route::post('/password/send-code', [PasswordController::class, 'sendResetCode']);
Route::post('/password/verify-code', [PasswordController::class, 'verifyResetCode']);
Route::post('/password/reset', [PasswordController::class, 'resetPasswordViaCode']);

// ✅ Route untuk renungan harian — bisa diakses guest
Route::get('/renungan-harian', [RenunganPublicController::class, 'renunganHarian']);

// 🔐 Route untuk user biasa (harus login)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile', [ProfileController::class, 'update']);

    // ✅ Ganti ke jamak agar tidak conflict dengan admin
    Route::get('/kegiatans', [KegiatanPublicController::class, 'index']);
    Route::get('/kegiatans/{id}', [KegiatanPublicController::class, 'show']);

    // ✅ Route untuk pendaftaran peserta
    Route::post('kegiatans/{kegiatan}/daftar', [PesertaKegiatanController::class, 'daftar']);
    Route::delete('kegiatans/{kegiatan}/batal', [PesertaKegiatanController::class, 'batalDaftar']);
    Route::get('kegiatans/{kegiatan}/cek-status', [PesertaKegiatanController::class, 'cekStatus']);
});

// 🔐 Route untuk admin saja
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('kegiatans', KegiatanController::class);
    Route::post('kegiatans/{kegiatan}/selesaikan', [KegiatanController::class, 'selesaikan']);
    Route::get('kegiatans/{kegiatan}/peserta', [KegiatanController::class, 'peserta']);
    Route::apiResource('renungans', RenunganController::class);
});