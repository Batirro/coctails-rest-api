# Cocktails REST API

A comprehensive REST API for managing cocktails and ingredients built with NestJS, TypeScript, Prisma, and SQLite.

## Features

- Full CRUD operations for cocktails and ingredients
- Many-to-many relationship between cocktails and ingredients with amounts
- Image upload functionality (local storage)
- Advanced filtering and searching
- Sorting by multiple fields
- Pagination (offset/limit)
- Input validation with detailed error messages
- Swagger/OpenAPI documentation
- Clean code architecture following NestJS best practices
- TypeScript with strict type checking

## Quick Start

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd coctails-rest-api

# Install dependencies
npm install

# Setup environment variables
# The .env file should already exist with DATABASE_URL="file:./dev.db"

# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api/docs

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Upload** | | |
| POST | `/api/upload` | Upload an image file (.jpg only) |
| **Ingredients** | | |
| GET | `/api/ingredients` | Get all ingredients (with filters) |
| GET | `/api/ingredients/:id` | Get ingredient by ID |
| POST | `/api/ingredients` | Create new ingredient |
| PATCH | `/api/ingredients/:id` | Update ingredient |
| DELETE | `/api/ingredients/:id` | Delete ingredient |
| **Cocktails** | | |
| GET | `/api/cocktails` | Get all cocktails (with filters) |
| GET | `/api/cocktails/:id` | Get cocktail by ID |
| POST | `/api/cocktails` | Create new cocktail |
| PATCH | `/api/cocktails/:id` | Update cocktail |
| DELETE | `/api/cocktails/:id` | Delete cocktail |

## Detailed API Usage

### 1. Upload an Image

**Endpoint:** `POST /api/upload`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
- `file`: Image file (.jpg only, max 5MB)

**Example Response:**
```json
{
  "url": "/uploads/550e8400-e29b-41d4-a716-446655440000-1699564800000.jpg",
  "filename": "550e8400-e29b-41d4-a716-446655440000-1699564800000.jpg"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg"
```

---

### 2. Create an Ingredient

**Endpoint:** `POST /api/ingredients`

**Body:**
```json
{
  "name": "White Rum",
  "description": "A light-bodied rum commonly used in cocktails",
  "isAlcoholic": true,
  "imageUrl": "/uploads/white-rum.jpg"
}
```

**Validation Rules:**
- `name`: Min 3 characters, max 100 characters (required)
- `description`: Max 2000 characters (required)
- `isAlcoholic`: Boolean (required)
- `imageUrl`: Optional, max 500 characters

**Example Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "White Rum",
  "description": "A light-bodied rum commonly used in cocktails",
  "isAlcoholic": true,
  "imageUrl": "/uploads/white-rum.jpg",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

### 3. Get All Ingredients (with filters)

**Endpoint:** `GET /api/ingredients`

**Query Parameters:**
- `isAlcoholic`: Filter by alcoholic status (true/false)
- `search`: Search by name (case-insensitive)
- `sortBy`: Field to sort by (name, createdAt, updatedAt) - default: name
- `sortOrder`: Sort order (asc, desc) - default: asc
- `offset`: Number of items to skip - default: 0
- `limit`: Number of items to return (1-100) - default: 10

**Example Request:**
```
GET /api/ingredients?isAlcoholic=true&sortBy=name&sortOrder=asc&offset=0&limit=10
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "White Rum",
      "description": "A light-bodied rum commonly used in cocktails",
      "isAlcoholic": true,
      "imageUrl": "/uploads/white-rum.jpg",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "offset": 0,
    "limit": 10
  }
}
```

---

### 4. Create a Cocktail

**Endpoint:** `POST /api/cocktails`

**IMPORTANT:** At least one ingredient is required when creating a cocktail!

**Body:**
```json
{
  "name": "Mojito",
  "category": "CLASSIC",
  "instructions": "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water. Garnish with mint sprig.",
  "imageUrl": "/uploads/mojito.jpg",
  "ingredients": [
    {
      "ingredientId": "550e8400-e29b-41d4-a716-446655440000",
      "amount": "50ml"
    },
    {
      "ingredientId": "660e8400-e29b-41d4-a716-446655440001",
      "amount": "10 mint leaves"
    },
    {
      "ingredientId": "770e8400-e29b-41d4-a716-446655440002",
      "amount": "30ml"
    }
  ]
}
```

**Available Categories:**
- `CLASSIC` - Classic cocktails (Mojito, Margarita, Old Fashioned)
- `TROPICAL` - Tropical cocktails (Piña Colada, Mai Tai)
- `MOCKTAIL` - Non-alcoholic cocktails (Virgin Mojito, Shirley Temple)
- `SHOOTER` - Shot drinks (Tequila Shot, B-52)
- `LONG_DRINK` - Long drinks (Long Island, Cuba Libre)
- `SOUR` - Sour cocktails (Whiskey Sour, Amaretto Sour)
- `CREAMY` - Creamy cocktails (White Russian, Baileys-based)
- `HOT_DRINK` - Hot cocktails (Irish Coffee, Hot Toddy)

**Validation Rules:**
- `name`: Min 3 characters, max 100 characters (required)
- `category`: Must be one of the valid categories (required)
- `instructions`: Max 5000 characters (required)
- `imageUrl`: Optional, max 500 characters
- `ingredients`: Array with at least 1 ingredient (required)

**Example Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Mojito",
  "category": "CLASSIC",
  "instructions": "Muddle mint leaves with sugar and lime juice...",
  "imageUrl": "/uploads/mojito.jpg",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "ingredients": [
    {
      "ingredientId": "550e8400-e29b-41d4-a716-446655440000",
      "amount": "50ml",
      "ingredient": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "White Rum",
        "description": "A light-bodied rum commonly used in cocktails",
        "isAlcoholic": true,
        "imageUrl": "/uploads/white-rum.jpg"
      }
    }
  ]
}
```

---

### 5. Get All Cocktails (with filters)

**Endpoint:** `GET /api/cocktails`

**Query Parameters:**
- `category`: Filter by category (CLASSIC, TROPICAL, etc.)
- `nonAlcoholic`: Filter for non-alcoholic cocktails (true/false)
- `ingredientId`: Filter cocktails containing a specific ingredient
- `sortBy`: Field to sort by (name, category, createdAt, updatedAt) - default: name
- `sortOrder`: Sort order (asc, desc) - default: asc
- `offset`: Number of items to skip - default: 0
- `limit`: Number of items to return (1-100) - default: 10

**Example Requests:**

```bash
# Get all tropical cocktails
GET /api/cocktails?category=TROPICAL

# Get non-alcoholic cocktails only
GET /api/cocktails?nonAlcoholic=true

# Get cocktails containing a specific ingredient
GET /api/cocktails?ingredientId=550e8400-e29b-41d4-a716-446655440000

# Get cocktails sorted by date created (newest first)
GET /api/cocktails?sortBy=createdAt&sortOrder=desc

# Combined filters with pagination
GET /api/cocktails?category=CLASSIC&sortBy=name&sortOrder=asc&offset=0&limit=20
```

---

### 6. Update a Cocktail

**Endpoint:** `PATCH /api/cocktails/:id`

**Note:** All fields are optional. If `ingredients` are provided, they will **replace** all existing ingredients.

**Body Example:**
```json
{
  "name": "Mojito Deluxe",
  "instructions": "Updated instructions...",
  "ingredients": [
    {
      "ingredientId": "550e8400-e29b-41d4-a716-446655440000",
      "amount": "60ml"
    }
  ]
}
```

---

### 7. Delete an Ingredient

**Endpoint:** `DELETE /api/ingredients/:id`

**IMPORTANT:** Cannot delete an ingredient that is used in any cocktail. You must remove it from all cocktails first.

**Success Response:**
```json
{
  "message": "Ingredient successfully deleted"
}
```

**Error Response (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "Cannot delete ingredient. It is used in 3 cocktail(s). Please remove it from all cocktails before deleting.",
  "error": "Conflict"
}
```

---

### 8. Delete a Cocktail

**Endpoint:** `DELETE /api/cocktails/:id`

**Note:** Deleting a cocktail will also delete its uploaded image file (if any).

**Success Response:**
```json
{
  "message": "Cocktail successfully deleted"
}
```

---

## Database Schema

### Models

**Cocktail**
- `id` (String, UUID, Primary Key)
- `name` (String)
- `category` (Enum: CocktailCategory)
- `instructions` (String)
- `imageUrl` (String, nullable)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Ingredient**
- `id` (String, UUID, Primary Key)
- `name` (String)
- `description` (String)
- `isAlcoholic` (Boolean)
- `imageUrl` (String, nullable)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**CocktailIngredient** (Junction Table)
- `cocktailId` (String, Foreign Key)
- `ingredientId` (String, Foreign Key)
- `amount` (String)
- Composite Primary Key: (cocktailId, ingredientId)

### Relationships

```
Cocktail 1──────* CocktailIngredient *──────1 Ingredient
```

- A cocktail can have many ingredients
- An ingredient can be in many cocktails
- Each relationship stores the `amount` of the ingredient needed

### Database Diagram

```
┌─────────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│   Cocktail      │         │ CocktailIngredient   │         │   Ingredient    │
├─────────────────┤         ├──────────────────────┤         ├─────────────────┤
│ id (PK)         │◄────────│ cocktailId (FK)      │────────►│ id (PK)         │
│ name            │         │ ingredientId (FK)    │         │ name            │
│ category        │         │ amount               │         │ description     │
│ instructions    │         └──────────────────────┘         │ isAlcoholic     │
│ imageUrl        │                                          │ imageUrl        │
│ createdAt       │         Cascade on delete (Cocktail)     │ createdAt       │
│ updatedAt       │         Restrict on delete (Ingredient)  │ updatedAt       │
└─────────────────┘                                          └─────────────────┘
```

---

## Development

### Project Structure

```
coctails-rest-api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── cocktails/             # Cocktails module
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── cocktails.controller.ts
│   │   ├── cocktails.service.ts
│   │   └── cocktails.module.ts
│   ├── ingredients/           # Ingredients module
│   │   ├── dto/
│   │   ├── ingredients.controller.ts
│   │   ├── ingredients.service.ts
│   │   └── ingredients.module.ts
│   ├── upload/                # Upload module
│   │   ├── upload.controller.ts
│   │   ├── upload.service.ts
│   │   └── upload.module.ts
│   ├── prisma/                # Prisma module
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── common/                # Shared resources
│   │   └── enums/
│   ├── config/                # Configuration files
│   │   └── multer.config.ts
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry point
├── uploads/                   # Uploaded files (gitignored)
└── test/                      # Test files
```

### Available Scripts

```bash
# Development
npm run start          # Start application
npm run start:dev      # Start with hot reload
npm run start:debug    # Start in debug mode

# Build
npm run build          # Build for production

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests

# Code Quality
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint

# Database
npx prisma studio      # Open Prisma Studio (GUI for database)
npx prisma migrate dev # Create and apply migrations
npx prisma generate    # Generate Prisma Client
```

### Prisma Studio

View and edit your database with a GUI:

```bash
npx prisma studio
```

This will open http://localhost:5555 with a visual interface for your database.

---

## Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## Validation & Error Handling

### Common Validation Errors

**400 Bad Request** - Invalid input data
```json
{
  "statusCode": 400,
  "message": [
    "Name must be at least 3 characters long",
    "At least one ingredient is required when creating a cocktail"
  ],
  "error": "Bad Request"
}
```

**404 Not Found** - Resource doesn't exist
```json
{
  "statusCode": 404,
  "message": "Cocktail with id abc123 not found",
  "error": "Not Found"
}
```

**409 Conflict** - Cannot delete ingredient in use
```json
{
  "statusCode": 409,
  "message": "Cannot delete ingredient. It is used in 5 cocktail(s).",
  "error": "Conflict"
}
```

---

## Example Workflow

Here's a complete example workflow for creating a cocktail:

### Step 1: Upload Images

```bash
# Upload ingredient image
curl -X POST http://localhost:3000/api/upload \
  -F "file=@rum.jpg"
# Response: { "url": "/uploads/rum-123.jpg", "filename": "rum-123.jpg" }

# Upload cocktail image
curl -X POST http://localhost:3000/api/upload \
  -F "file=@mojito.jpg"
# Response: { "url": "/uploads/mojito-456.jpg", "filename": "mojito-456.jpg" }
```

### Step 2: Create Ingredients

```bash
# Create White Rum
curl -X POST http://localhost:3000/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "White Rum",
    "description": "Light-bodied rum",
    "isAlcoholic": true,
    "imageUrl": "/uploads/rum-123.jpg"
  }'
# Response: { "id": "ingredient-id-1", ... }

# Create Mint
curl -X POST http://localhost:3000/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fresh Mint",
    "description": "Fresh mint leaves",
    "isAlcoholic": false
  }'
# Response: { "id": "ingredient-id-2", ... }

# Create Lime Juice
curl -X POST http://localhost:3000/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lime Juice",
    "description": "Freshly squeezed lime juice",
    "isAlcoholic": false
  }'
# Response: { "id": "ingredient-id-3", ... }
```

### Step 3: Create Cocktail

```bash
curl -X POST http://localhost:3000/api/cocktails \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mojito",
    "category": "CLASSIC",
    "instructions": "Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.",
    "imageUrl": "/uploads/mojito-456.jpg",
    "ingredients": [
      {
        "ingredientId": "ingredient-id-1",
        "amount": "50ml"
      },
      {
        "ingredientId": "ingredient-id-2",
        "amount": "10 leaves"
      },
      {
        "ingredientId": "ingredient-id-3",
        "amount": "30ml"
      }
    ]
  }'
```

### Step 4: Query Cocktails

```bash
# Get all classic cocktails
curl http://localhost:3000/api/cocktails?category=CLASSIC

# Get non-alcoholic cocktails
curl http://localhost:3000/api/cocktails?nonAlcoholic=true

# Get cocktails with rum
curl http://localhost:3000/api/cocktails?ingredientId=ingredient-id-1
```

---

## CORS

CORS is enabled by default. You can make requests from any origin.

---

## License

This project is licensed under the UNLICENSED license.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Support

For questions or issues, please open an issue in the repository.

---

**Happy Coding!**
