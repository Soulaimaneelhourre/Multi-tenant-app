<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\TenantController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

// Central routes (no tenancy initialization)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register-company', [TenantController::class, 'store']);

// Tenant-specific routes
Route::middleware([
    'api',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    // Authentication routes (tenant-specific)
    Route::post('/login', [AuthController::class, 'login']);
    
    // Authenticated routes (tenant-specific)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/notes', [NoteController::class, 'index']);
        Route::post('/notes', [NoteController::class, 'store']);
        Route::put('/notes/{note}', [NoteController::class, 'update']);
        Route::delete('/notes/{note}', [NoteController::class, 'destroy']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});