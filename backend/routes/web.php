<?php

use App\Models\Tenant;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/tenants', function () {
    return response()->json(
        Tenant::select('id')->get()
    );
});