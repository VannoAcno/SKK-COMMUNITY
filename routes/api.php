<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PasswordController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password reset routes
Route::post('/password/send-code', [PasswordController::class, 'sendResetCode']);
Route::post('/password/verify-code', [PasswordController::class, 'verifyResetCode']);
Route::post('/password/reset', [PasswordController::class, 'resetPasswordViaCode']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile', [ProfileController::class, 'update']);
});
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('kegiatan', KegiatanController::class);
});