<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'tenants', 'tenants/*'], // add all API paths you call

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // if you use cookies/auth
];
