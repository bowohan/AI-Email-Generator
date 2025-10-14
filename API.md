# AI Email Generator API Documentation

## Overview
REST API for AI-powered email generation with user authentication and email management.

**Base URL:** `http://localhost:3001/api`

## Authentication
Currently using mock authentication. In production, implement JWT tokens.

## Endpoints

### Health Check
**GET** `/health`

Check API status.

**Response:**
```json
{
  "status": "OK",
  "message": "AI Email Generator API is running",
  "timestamp": "2025-10-14T19:11:37.728Z"
}
```

### Generate Email
**POST** `/ai/generate`

Generate an AI-powered email based on parameters.

**Request Body:**
```json
{
  "subject": "Meeting Request",
  "tone": "professional",
  "purpose": "Schedule a quarterly review",
  "recipient": "John Doe, Marketing Manager",
  "length": "medium",
  "userId": "user123"
}
```

**Parameters:**
- `subject` (string, required): Email subject line
- `tone` (string, required): Email tone - "professional", "casual", "friendly", "formal", "persuasive"
- `purpose` (string, required): Purpose of the email
- `recipient` (string, optional): Recipient name and title
- `length` (string, optional): Email length - "short", "medium", "long"
- `userId` (string, optional): User ID for saving email

**Response:**
```json
{
  "email": "Dear John Doe, Marketing Manager,\n\nI hope this email finds you well...",
  "savedEmail": {
    "id": "email123",
    "subject": "Meeting Request",
    "tone": "professional",
    "purpose": "Schedule a quarterly review",
    "recipient": "John Doe, Marketing Manager",
    "length": "medium",
    "content": "Dear John Doe...",
    "createdAt": "2025-10-14T19:11:37.728Z",
    "updatedAt": "2025-10-14T19:11:37.728Z",
    "userId": "user123"
  }
}
```

### Get User Emails
**GET** `/ai/emails`

Get paginated list of user's emails with search and filtering.

**Query Parameters:**
- `userId` (string, required): User ID
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `q` (string, optional): Search query

**Example Request:**
```
GET /ai/emails?userId=user123&page=1&limit=10&q=meeting
```

**Response:**
```json
{
  "emails": [
    {
      "id": "email123",
      "subject": "Meeting Request",
      "tone": "professional",
      "purpose": "Schedule a quarterly review",
      "recipient": "John Doe, Marketing Manager",
      "length": "medium",
      "content": "Dear John Doe...",
      "createdAt": "2025-10-14T19:11:37.728Z",
      "updatedAt": "2025-10-14T19:11:37.728Z",
      "userId": "user123"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Single Email
**GET** `/ai/emails/:id`

Get a specific email by ID.

**Path Parameters:**
- `id` (string, required): Email ID

**Query Parameters:**
- `userId` (string, required): User ID for ownership verification

**Response:**
```json
{
  "email": {
    "id": "email123",
    "subject": "Meeting Request",
    "tone": "professional",
    "purpose": "Schedule a quarterly review",
    "recipient": "John Doe, Marketing Manager",
    "length": "medium",
    "content": "Dear John Doe...",
    "createdAt": "2025-10-14T19:11:37.728Z",
    "updatedAt": "2025-10-14T19:11:37.728Z",
    "userId": "user123"
  }
}
```

### Update Email
**PUT** `/ai/emails/:id`

Update an existing email.

**Path Parameters:**
- `id` (string, required): Email ID

**Request Body:**
```json
{
  "userId": "user123",
  "subject": "Updated Meeting Request",
  "tone": "casual",
  "purpose": "Updated purpose",
  "recipient": "Jane Doe, Marketing Manager",
  "length": "long",
  "content": "Updated email content..."
}
```

**Response:**
```json
{
  "email": {
    "id": "email123",
    "subject": "Updated Meeting Request",
    "tone": "casual",
    "purpose": "Updated purpose",
    "recipient": "Jane Doe, Marketing Manager",
    "length": "long",
    "content": "Updated email content...",
    "createdAt": "2025-10-14T19:11:37.728Z",
    "updatedAt": "2025-10-14T19:12:37.728Z",
    "userId": "user123"
  }
}
```

### Delete Email
**DELETE** `/ai/emails/:id`

Delete an email.

**Path Parameters:**
- `id` (string, required): Email ID

**Query Parameters:**
- `userId` (string, required): User ID for ownership verification

**Response:**
```json
{
  "message": "Email deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Subject, tone, and purpose are required."
}
```

### 404 Not Found
```json
{
  "error": "Email not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to generate email"
}
```

## Rate Limiting
- No rate limiting currently implemented
- OpenAI API has its own rate limits

## CORS
- Configured for `http://localhost:5173` (frontend)
- Credentials enabled

## Database Schema

### User Model
```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  emails    Email[]
}
```

### Email Model
```prisma
model Email {
  id        String    @id @default(cuid())
  subject   String
  tone      String
  purpose   String
  recipient String?
  length    String
  content   String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  userId    String
  user      User      @relation(fields: [userId], references: [id])
}
```

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Unit tests for email generation
- Integration tests for API endpoints
- Error handling tests

## Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_email_generator"
JWT_SECRET="your-super-secret-jwt-key"
OPENAI_API_KEY="sk-..."
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
