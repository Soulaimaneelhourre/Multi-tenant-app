<?php

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Database\Models\Tenant;

Route::middleware('api')->group(function () {
    Route::get('/tenants', function () {
        return response()->json(
            Tenant::select('id')->get()
        );
    });
});
