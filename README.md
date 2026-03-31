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

### 3) Frontend (Vite)

- `cd frontend`
- `npm install`
- `npm run dev`

Frontend URL: `http://localhost:5173/`