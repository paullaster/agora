# Agora API

Agora is a Node.js/TypeScript backend for managing agroecology-related data, including products, users, outlets, blogs, FAQs, and data ingestion.

## Features

- RESTful API for products, users, outlets, blogs, and FAQs
- File upload and ingestion (JSON/CSV)
- JWT authentication and protected routes
- Bulk creation endpoints
- MongoDB integration
- Modular architecture (controllers, use cases, repositories, entities)
- Comprehensive test suite (Jest, Supertest)

## Project Structure

```
Agora/
  src/
    application/      # Use cases
    core/             # Entities, providers, repositories (interfaces)
    infrastructure/   # Database, logger, repositories (implementations)
    interfaces/       # Controllers, middleware, routes
    types/            # TypeScript types
  storage/          # Uploaded files, logs
  test/             # Test suites
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your MongoDB URI and other settings.
3. **Run the server:**
   ```bash
   npm run dev
   ```
4. **Run tests:**
   ```bash
   npm test
   ```

## API Endpoints

- `POST /auth/login` — User login
- `POST /auth/logout` — User logout
- `GET /products` — List products
- `GET /products/:id` — Get product details
- `POST /products` — Create product
- `POST /ingest` — Ingest data (upload JSON/CSV)
- ...aI am going to add more for users, outlets, blogs, faqs

## Ingestion Example

To ingest data, send a `multipart/form-data` POST request to `/ingest` with:

- `file`: The JSON or CSV file
- `dataType`: One of `products`, `users`, `outlets`, `blogs`, `faqs`

## Testing

- Tests are in `test/interfaces/controllers/`
- Run with `npm test`

## License

MIT
