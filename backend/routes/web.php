<?php

use App\Http\Controllers\TenantController;
use App\Models\Tenant;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/tenants', function () {
    return response()->json(
        Tenant::with('domains')->get(['id'])  // eager load domains relation
    );
});

