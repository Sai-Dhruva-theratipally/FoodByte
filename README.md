# FoodByte

## Run (local)

### 1) MySQL

- Ensure MySQL is running on `localhost:3306`.
- Create database + user (run in a terminal; you will be prompted for the MySQL root password):
	- `mysql -uroot -p -e "CREATE DATABASE IF NOT EXISTS foodapp; CREATE USER IF NOT EXISTS 'foodbyte'@'localhost' IDENTIFIED BY 'foodbytepass'; GRANT ALL PRIVILEGES ON foodapp.* TO 'foodbyte'@'localhost'; FLUSH PRIVILEGES;"`

Backend defaults to:
- DB: `foodapp`
- User: `foodbyte`
- Password: `foodbytepass`

Override via environment variables (optional):
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

### 2) Backend (Spring Boot)

- `cd backend`
- `mvn clean spring-boot:run`

API base URL: `http://localhost:8080/api`

## Images (Cloudinary)

Restaurants and products support `imageUrl` (stored in MySQL) and the frontend renders them.

Optional: enable Cloudinary uploads (admin-only endpoint):
- Set `CLOUDINARY_URL` (format: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`)
- Optional: set `CLOUDINARY_FOLDER` (default: `foodbyte`)

Upload endpoint (requires ADMIN JWT):
- `POST /api/admin/media/upload` (multipart form-data `file`, optional `folder`)

### 3) Frontend (Vite)

- `cd frontend`
- `npm install`
- `npm run dev`

Frontend URL: `http://localhost:5173/`

Optional (override API base URL used by the frontend):
- PowerShell: `$env:VITE_API_BASE_URL="http://localhost:8080/api"; npm run dev`

Frontend routes:
- `/login`, `/register`
- `/restaurants` (and `/restaurants/:id` for menu)
- `/products`
- `/cart`, `/orders` (require login)

## Verify endpoints (smoke test)

With backend running, in PowerShell:
- `./scripts/smoke.ps1`