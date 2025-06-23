# Agora API (AgroEcology Content API)

Agora is a Node.js/TypeScript backend for managing agroecology-related data, including products, users, outlets, blogs, FAQs, and data ingestion.

## Features

- RESTful API for products, users, outlets, blogs, and FAQs
- File upload and ingestion (JSON/CSV)
- JWT authentication and protected routes
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
   - Copy `.env.example` to `.env.development` and set your MongoDB URI and other settings.
3. **Run the server:**
   ```bash
   npm run dev
   ```
4. **Run tests:**
   ```bash
   npm test
   ```

## API Endpoints

### Auth

- `POST /auth/login` — User login
- `POST /auth/logout` — User logout

### Products

- `GET /products` — List products
- `GET /products/:id` — Get product details
- `POST /products` — Create product

### Users

- `GET /users` — List users
- `GET /users/:id` — Get user details
- `POST /users` — Create user

### Outlets

- `GET /outlets` — List outlets
- `GET /outlets/:id` — Get outlet details
- `POST /outlets` — Create outlet

### Blogs

- `GET /blogs` — List blogs
- `GET /blogs/:id` — Get blog details
- `POST /blogs` — Create blog (JWT required)

### FAQs

- `GET /faqs` — List FAQs

### Ingestion

- `POST /ingest` — Ingest data (upload JSON/CSV, requires `file` and `dataType` fields)
  - `file`: The JSON or CSV file (required)
  - `dataType`: One of `products`, `users`, `outlets`, `blogs`, `faqs` (required)
  - For `dataType=faqs`, you can also pass an optional `faqsMode` parameter to control how FAQs are saved:
    - `faqsMode=overwrite` (default): Overwrites the existing FAQ file
    - `faqsMode=append`: Appends to the existing FAQ file
  - `faqsMode` can be passed as either a body property or a query parameter (i.e., `req.body.faqsMode` or `req.query.faqsMode`)
  - All parameters (`dataType`, `faqsMode`) can be sent as form fields or query parameters.

#### Example Request

```http
POST /ingest
Content-Type: multipart/form-data

file: <yourfile.json or .csv>
dataType: faqs
faqsMode: append
```

#### Example: Ingesting Products

To ingest products, send a `multipart/form-data` POST request to `/ingest` with:

- `file`: The products JSON or CSV file
- `dataType`: `products`

Example using `curl`:

```bash
curl -X POST http://localhost:4200/ingest \
  -F "file=@products.json" \
  -F "dataType=products"
```

Example products.json:

```json
[
  {
    "name": "Organic Apple",
    "category": "Fruit",
    "certification": "Organic",
    "nutritionalBenefits": ["Vitamin C"],
    "image": "apple.jpg",
    "price": "2.50",
    "rating": 5,
    "description": { "en": "Fresh organic apple", "fr": "Pomme bio fraîche" }
  },
  {
    "name": "Carrot",
    "category": "Vegetable",
    "certification": "Organic",
    "nutritionalBenefits": ["Beta-carotene"],
    "image": "carrot.jpg",
    "price": "1.20",
    "rating": 4,
    "description": {
      "en": "Crunchy organic carrot",
      "fr": "Carotte bio croquante"
    }
  }
]
```

#### JSON Shape Examples for Ingestion

Below are the required JSON shapes for each supported `dataType` when uploading to `/ingest`.

##### Users (`dataType=users`)

```json
[
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "avatar": "jane.jpg",
    "password": "StrongPassword123!",
    "lastLogin": "2025-06-23T12:00:00.000Z",
    "role": "user"
  }
]
```

##### Products (`dataType=products`)

```json
[
  {
    "name": "Organic Apple",
    "category": "Fruit",
    "certification": "Organic",
    "nutritionalBenefits": ["Vitamin C"],
    "image": "apple.jpg",
    "price": "2.50",
    "rating": 5,
    "description": {
      "en": "Fresh organic apple",
      "fr": "Pomme bio fraîche"
    }
  }
]
```

##### Outlets (`dataType=outlets`)

```json
[
  {
    "name": "Green Market",
    "address": "123 Main St, Cityville",
    "phone": "+1234567890",
    "hours": "8am-6pm",
    "rating": 4.5,
    "specialties": ["organic", "local"],
    "coordinates": [12.34, 56.78]
  }
]
```

##### Blogs (`dataType=blogs`)

```json
[
  {
    "title": "Agroecology in Practice",
    "excerpt": "A short summary of the blog post.",
    "content": "Agroecology is transforming farms...",
    "image": "blog.jpg",
    "author": "Jane Doe",
    "publishDate": "2025-06-23T10:00:00.000Z",
    "readTime": "5 min",
    "tags": ["agroecology", "sustainability"],
    "category": "farming"
  }
]
```

##### FAQs (`dataType=faqs`)

```json
[
  {
    "question": {
      "en": "What is agroecology?",
      "fr": "Qu'est-ce que l'agroécologie ?"
    },
    "answer": {
      "en": "Agroecology is a holistic approach to farming...",
      "fr": "L'agroécologie est une approche holistique..."
    },
    "category": "basics",
    "order": 1,
    "isActive": true,
    "createdAt": "2025-06-23T00:00:00.000Z",
    "updatedAt": "2025-06-23T00:00:00.000Z"
  }
]
```

---

### Protected/Dashboard

- `GET /dashboard/profile` — Get authenticated user profile (JWT required)
- `GET /dashboard` — Get dashboard metrics (JWT + admin role required)

## Testing

- Tests are in `test/interfaces/controllers/`
- Run with `npm test`

## License

MIT
