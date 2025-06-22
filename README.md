# Tenant Notes App - Multi-Tenant SaaS Application

## 📝 Overview
This is a multi-tenant Notes application built with Laravel (backend) and React.js (frontend) that supports tenant-based data isolation using subdomains. Each company (tenant) can register and have their own isolated data space where their users can create and manage notes.

## 🛠️ Tech Stack
- **Backend**: Laravel 10
- **Frontend**: React.js (Vite)
- **Authentication**: Laravel Sanctum
- **Multi-Tenancy**: stancl/tenancy package
- **Styling**: Tailwind CSS
- **Form Handling**: Formik
- **HTTP Client**: Axios

## 🚀 Setup Instructions

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 16+
- MySQL 5.7+
- Redis (for cache)

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/tenant-notes-app.git
cd tenant-notes-app
```

### 2. Backend Setup
```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tenant_notes
DB_USERNAME=root
DB_PASSWORD=

# Run migrations
php artisan migrate

# Install tenancy package
php artisan tenancy:install
php artisan migrate --path=database/migrations/tenant

# Generate Sanctum keys
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan sanctum:install
```

### 3. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 4. Configure Hosts
Add these lines to your `/etc/hosts` file (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1       tenant-notes.test
127.0.0.1       company1.tenant-notes.test
127.0.0.1       company2.tenant-notes.test
```

### 5. Configure .env
Backend `.env`:
```
APP_URL=http://tenant-notes.test
SANCTUM_STATEFUL_DOMAINS=tenant-notes.test,*.tenant-notes.test
SESSION_DOMAIN=.tenant-notes.test
```

Frontend `.env`:
```
VITE_API_URL=http://tenant-notes.test
```

### 6. Run the Application
```bash
# In the backend directory
php artisan serve --host=tenant-notes.test --port=8000

# In the frontend directory
npm run dev
```

## 🔍 Testing the Application
1. Access the main domain: http://tenant-notes.test:8000
2. Register a new company (this will create a tenant)
3. Log in with the created user
4. Access via subdomain: http://company1.tenant-notes.test:8000

## 🧪 Seeding Test Data
```bash
php artisan db:seed --class=TenantSeeder
```

## 🐛 Debugging Common Issues

### 1. Tenant Not Recognized
- Ensure the subdomain is correctly mapped in your hosts file
- Check the `tenants` table in your database to verify the tenant exists
- Clear cache: `php artisan cache:clear`

### 2. Authentication Issues
- Verify Sanctum configuration in `.env`
- Ensure cookies are being sent with requests (check CORS settings)
- Clear session: `php artisan session:clear`

### 3. Database Connection Errors
- Verify the central and tenant database connections
- Check the `tenancy.php` config file for correct database settings
- Run `php artisan tenants:migrate` to migrate tenant databases

### 4. Frontend Not Connecting to Backend
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS middleware in Laravel
- Ensure the backend is running and accessible

## 📂 Project Structure
```
backend/
  ├── app/                 # Laravel application code
  ├── config/              # Configuration files
  ├── database/            # Database migrations and seeders
  ├── routes/              # API routes
  └── ...
frontend/
  ├── public/              # Static assets
  ├── src/                 # React application
  │   ├── components/      # Reusable components
  │   ├── pages/           # Page components
  │   ├── services/        # API services
  │   └── ...
  └── ...
```

## 🔧 Additional Commands
```bash
# Create a new tenant manually
php artisan tenants:create

# Migrate a specific tenant
php artisan tenants:migrate --tenant=tenant_id

# Run tests
php artisan test
```

## 📜 License
This project is open-source software licensed under the MIT license.
