<?php

// routes/api.php

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
// ✅ Tambahkan import untuk controller donasi
use App\Http\Controllers\Api\DonasiController;
use App\Http\Controllers\Api\Admin\DonasiKampanyeController;
// ✅ Tambahkan import untuk controller kampanye publik
use App\Http\Controllers\Api\DonasiKampanyePublicController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password reset routes
Route::post('/password/send-code', [PasswordController::class, 'sendResetCode']);
Route::post('/password/verify-code', [PasswordController::class, 'verifyResetCode']);
Route::post('/password/reset', [PasswordController::class, 'resetPasswordViaCode']);

// ✅ Route untuk renungan harian — bisa diakses guest
Route::get('/renungan-harian', [RenunganPublicController::class, 'renunganHarian']);

// ✅ Route untuk kegiatan — bisa diakses guest
Route::get('/kegiatans', [KegiatanPublicController::class, 'index']);
Route::get('/kegiatans/{id}', [KegiatanPublicController::class, 'show']);

// ✅ Route untuk album — bisa diakses guest
Route::get('/albums', [AlbumPublicController::class, 'index']);
Route::get('/albums/{id}', [AlbumPublicController::class, 'show']);
Route::get('/albums/{id}/fotos', [AlbumPublicController::class, 'fotosByAlbum']);

// ✅ Route untuk donasi — bisa diakses guest (untuk submit)
Route::post('/donasi', [DonasiController::class, 'store']); // Submit donasi user
Route::get('/donasi-success', [DonasiController::class, 'indexPublic']); // Ambil donasi yang sudah success

// ✅ Route PUBLIK untuk kampanye donasi aktif — bisa diakses guest/user
Route::get('/donasi-kampanyes-aktif', [DonasiKampanyePublicController::class, 'index']);
Route::get('/donasi-kampanyes/{id}', [DonasiKampanyePublicController::class, 'show']);

// 🔐 Route untuk user biasa (harus login)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile', [ProfileController::class, 'update']);

    // Kegiatan routes (untuk pendaftaran)
    Route::post('kegiatans/{kegiatan}/daftar', [PesertaKegiatanController::class, 'daftar']);
    Route::delete('kegiatans/{kegiatan}/batal', [PesertaKegiatanController::class, 'batalDaftar']);
    Route::get('kegiatans/{kegiatan}/cek-status', [PesertaKegiatanController::class, 'cekStatus']);

    // Forum routes
    Route::get('/forum', [ForumPublicController::class, 'index']);
    Route::get('/forum/{id}', [ForumPublicController::class, 'show']);
    Route::post('/forum', [ForumPublicController::class, 'store']);
    Route::post('/forum/{id}/komentar', [ForumPublicController::class, 'komentar']);
    
    // ✅ Tambahkan route untuk user mengedit/hapus komentar miliknya sendiri
    Route::put('/forum/komentar/{komentar}', [ForumPublicController::class, 'updateKomentar']);
    Route::delete('/forum/komentar/{komentar}', [ForumPublicController::class, 'destroyKomentar']);
});

// 🔐 Route untuk admin saja
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('kegiatans', KegiatanController::class);
    Route::post('kegiatans/{kegiatan}/selesaikan', [KegiatanController::class, 'selesaikan']);
    Route::get('kegiatans/{kegiatan}/peserta', [KegiatanController::class, 'peserta']);
    Route::apiResource('renungans', RenunganController::class);
    
    // ✅ Route untuk album admin
    Route::apiResource('albums', AlbumController::class);
    Route::post('/albums/{albumId}/fotos', [AlbumController::class, 'storeFoto']);
    Route::get('/albums/{albumId}/fotos', [AlbumController::class, 'fotos']);
    Route::delete('/album-fotos/{id}', [AlbumController::class, 'destroyFoto']);

    // ✅ Route untuk donasi admin
    Route::get('/donasi', [DonasiController::class, 'indexAdmin']); // Ambil semua donasi (bisa difilter)
    // ✅ Tambahkan route untuk menampilkan detail satu donasi
    Route::get('/donasi/{donasi}', [DonasiController::class, 'showAdmin']); // Ambil detail satu donasi
    Route::put('/donasi/{donasi}/konfirmasi', [DonasiController::class, 'updateStatus'])->name('admin.donasi.konfirmasi');
    Route::put('/donasi/{donasi}/tolak', [DonasiController::class, 'updateStatus'])->name('admin.donasi.tolak');

    // ✅ Route untuk kampanye donasi admin
    Route::apiResource('donasi-kampanye', DonasiKampanyeController::class);

    // ✅ Tambahkan route untuk dashboard admin
    Route::get('/users', [AuthController::class, 'getAllUsers']); // ✅ Tambahkan ini
    Route::get('/forum-topik', [ForumController::class, 'index']); // ✅ Tambahkan ini
    
    // ✅ Fix: Hapus "/admin/" ganda
    Route::delete('/forum-topik/{topik}', [ForumController::class, 'destroyTopik']);
    Route::delete('/forum-komentar/{komentar}', [ForumController::class, 'destroyKomentar']);
});
