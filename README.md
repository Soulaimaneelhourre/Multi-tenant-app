# Tenant Notes App - Multi-Tenant SaaS Application

## 📝 Overview
This is a multi-tenant Notes application built with Laravel (backend) and React.js (frontend) that supports tenant-based data isolation using subdomains. Each company (tenant) can register and have their own isolated data space where their users can create and manage notes.
## SCREENSHOTS
![image](https://github.com/user-attachments/assets/82f9b6c6-194b-4454-80fb-5c82d873dda2)
![image](https://github.com/user-attachments/assets/a71f3854-bd0c-440f-91c2-edf7404aab12)
![image](https://github.com/user-attachments/assets/b0044bd5-2426-4d9b-94ea-e3945739579f)
![image](https://github.com/user-attachments/assets/737bc7a2-f570-415c-add9-17b998835146)
![image](https://github.com/user-attachments/assets/2b66d445-6085-49ef-986a-80d995c4668c)
![image](https://github.com/user-attachments/assets/d84b9218-c9a7-4fe4-9dcb-0729b6d8d140)
![image](https://github.com/user-attachments/assets/56a71555-d2ac-48d1-ab09-196818e9a980)
![image](https://github.com/user-attachments/assets/ab378907-cc15-4cd3-95d3-f05a10f6f340)

[66352ed1-89b0-494f-ab92-0e15b5967c06.webm](https://github.com/user-attachments/assets/73d3c0d0-917e-41bd-bd2a-6dc7c8562641)

## 🛠️ Tech Stack
- **Backend**: Laravel 10
- **Frontend**: React.js (Vite)
- **Authentication**: Laravel Sanctum
- **Multi-Tenancy**: stancl/tenancy package
- **Styling**: Tailwind CSS
- **State management**: Redux , redux Persist
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



# In the frontend directory
npm run dev
```

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
