<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tenant;
use Illuminate\Support\Facades\Validator;

class TenantController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255|unique:tenants,id',
            'domain' => 'required|string|regex:/^[a-z0-9-]+$/|unique:domains,domain',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $tenant = Tenant::create([
                'id' => $request->company_name,
            ]);

            $tenant->domains()->create([
                'domain' => $request->domain . '.localhost',
            ]);

            return response()->json([
                'message' => 'Tenant registered successfully',
                'tenant' => $tenant
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Tenant registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
