<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\Admin\KegiatanController;
use App\Http\Controllers\Api\KegiatanPublicController;
use App\Http\Controllers\Api\PesertaKegiatanController;
use App\Http\Controllers\Api\Admin\RenunganController;
use App\Http\Controllers\Api\RenunganPublicController;
use App\Http\Controllers\Api\Admin\ForumController;
use App\Http\Controllers\Api\ForumPublicController;
use App\Http\Controllers\Api\AlbumPublicController;
use App\Http\Controllers\Api\Admin\AlbumController;
use App\Http\Controllers\Api\DonasiController;
use App\Http\Controllers\Api\Admin\DonasiKampanyeController;
use App\Http\Controllers\Api\DonasiKampanyePublicController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/password/send-code', [PasswordController::class, 'sendResetCode']);
Route::post('/password/verify-code', [PasswordController::class, 'verifyResetCode']);
Route::post('/password/reset', [PasswordController::class, 'resetPasswordViaCode']);

Route::get('/renungan-harian', [RenunganPublicController::class, 'renunganHarian']);
Route::get('/kegiatans', [KegiatanPublicController::class, 'index']);
Route::get('/kegiatans/{id}', [KegiatanPublicController::class, 'show']);
Route::get('/albums', [AlbumPublicController::class, 'index']);
Route::get('/albums/{id}', [AlbumPublicController::class, 'show']);
Route::get('/albums/{id}/fotos', [AlbumPublicController::class, 'fotosByAlbum']);
Route::post('/donasi', [DonasiController::class, 'store']);
Route::get('/donasi-success', [DonasiController::class, 'indexPublic']);
Route::get('/donasi-kampanyes-aktif', [DonasiKampanyePublicController::class, 'index']);
Route::get('/donasi-kampanyes/{id}', [DonasiKampanyePublicController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile', [ProfileController::class, 'update']);
    Route::post('kegiatans/{kegiatan}/daftar', [PesertaKegiatanController::class, 'daftar']);
    Route::delete('kegiatans/{kegiatan}/batal', [PesertaKegiatanController::class, 'batalDaftar']);
    Route::get('kegiatans/{kegiatan}/cek-status', [PesertaKegiatanController::class, 'cekStatus']);
    Route::get('/forum', [ForumPublicController::class, 'index']);
    Route::get('/forum/{id}', [ForumPublicController::class, 'show']);
    Route::post('/forum', [ForumPublicController::class, 'store']);
    Route::post('/forum/{id}/komentar', [ForumPublicController::class, 'komentar']);
    Route::put('/forum/komentar/{komentar}', [ForumPublicController::class, 'updateKomentar']);
    Route::delete('/forum/komentar/{komentar}', [ForumPublicController::class, 'destroyKomentar']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('kegiatans', KegiatanController::class);
    Route::post('kegiatans/{kegiatan}/selesaikan', [KegiatanController::class, 'selesaikan']);
    Route::get('kegiatans/{kegiatan}/peserta', [KegiatanController::class, 'peserta']);
    Route::apiResource('renungans', RenunganController::class);
    Route::apiResource('albums', AlbumController::class);
    Route::post('/albums/{albumId}/fotos', [AlbumController::class, 'storeFoto']);
    Route::get('/albums/{albumId}/fotos', [AlbumController::class, 'fotos']);
    Route::delete('/album-fotos/{id}', [AlbumController::class, 'destroyFoto']);
    Route::get('/donasi', [DonasiController::class, 'indexAdmin']);
    Route::get('/donasi/{donasi}', [DonasiController::class, 'showAdmin']);
    Route::put('/donasi/{donasi}/konfirmasi', [DonasiController::class, 'updateStatus'])->name('admin.donasi.konfirmasi');
    Route::put('/donasi/{donasi}/tolak', [DonasiController::class, 'updateStatus'])->name('admin.donasi.tolak');
    
    // ✅ Route baru untuk donasi per bulan
    Route::get('/donasi-per-bulan', [DonasiController::class, 'donasiPerBulan']);
    
    Route::apiResource('donasi-kampanye', DonasiKampanyeController::class);
    Route::get('/users', [AuthController::class, 'getAllUsers']);
    Route::get('/forum-topik', [ForumController::class, 'index']);
    Route::delete('/forum-topik/{topik}', [ForumController::class, 'destroyTopik']);
    Route::delete('/forum-komentar/{komentar}', [ForumController::class, 'destroyKomentar']);
});