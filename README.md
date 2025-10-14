# AI Email Generator

A full-stack application for generating AI-powered emails with different tones and purposes. Built with React, Node.js, PostgreSQL, and OpenAI API.

## Problem Statement

**Problem**: Writing professional emails is time-consuming and requires careful consideration of tone, structure, and content.

**Users**: Professionals, business owners, sales teams, and anyone who needs to write effective emails regularly.

**Solution**: An AI-powered email generator that creates contextually appropriate emails based on user input, saving time and improving communication quality.

## Features

### Core Features
- **AI-Powered Email Generation**: Generate emails with 5 different tones (professional, casual, friendly, formal, persuasive)
- **Multiple Lengths**: Short, medium, and long email options
- **User Authentication**: JWT-based authentication system
- **Full CRUD Operations**: Create, read, update, and delete emails
- **Email History**: View and manage all generated emails
- **Search & Filter**: Find emails by subject, content, or purpose
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Generation**: Instant email generation with AI

### Technical Features
- **RESTful API**: Well-documented API with proper error handling
- **Database Integration**: PostgreSQL with Prisma ORM
- **User Ownership**: Users can only access their own emails
- **Pagination**: Efficient email listing with pagination
- **Validation**: Input validation on both frontend and backend
- **Error Handling**: Comprehensive error handling and user feedback
- **Testing**: Unit and integration tests
- **AI Evaluation**: Quality evaluation system for generated emails

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma
- **AI**: OpenAI API
- **Authentication**: JWT
- **Testing**: Jest + Supertest

## Requirements Compliance

### Frontend (SPA)
- **4 Real Screens**: List, Detail, Create/Edit, Auth/Profile
- **Form Validation**: Comprehensive validation with error messages
- **Loading/Error States**: User feedback during operations
- **Responsive Layout**: Mobile-first responsive design
- **Client-side Routing**: React Router with protected routes
- **State Management**: React Context for authentication

### Backend (REST)
- **Two Entities**: User and Email models with full CRUD
- **Authentication**: JWT-based authentication system
- **Validation**: Input validation and error handling
- **Ownership Checks**: User-specific data filtering
- **Pagination**: Email listing with pagination support
- **Search**: Basic search functionality

### Data Layer
- **Database**: PostgreSQL with Prisma ORM
- **Schema**: Well-defined database schema
- **Seed Script**: Sample data for testing
- **Environment**: Proper environment configuration

### AI Feature
- **LLM Integration**: OpenAI API integration with GPT-3.5-turbo
- **Prompt Design**: Well-structured prompts for different tones
- **Direct API Integration**: Real-time email generation via OpenAI
- **Evaluation**: Quality evaluation system
- **Safety**: Input sanitization and error handling

### Non-Functional Requirements
- **Accessibility**: Basic accessibility features
- **Performance**: Optimized for < 800ms response times
- **Security**: No secrets in repo, input sanitization, CORS
- **Testing**: Comprehensive test suite
- **Documentation**: Complete API documentation

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bowohan/AI-Email-Generator.git
   cd AI-Email-Generator
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your database and API keys
   npx prisma generate
   npx prisma db push
   npm run seed  # Add sample data
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ai_email_generator?schema=public"

# JWT Secret (Change this in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# OpenAI API Key (Get from https://platform.openai.com/api-keys)
# IMPORTANT: Do NOT use quotes around the key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

## Database Setup

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE ai_email_generator;
   ```

2. **Run Prisma migrations**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

3. **Seed the database**
   ```bash
   npm run seed
   ```

## API Documentation

See [API.md](./API.md) for complete API documentation.

### Key Endpoints

- `GET /api/health` - Health check
- `POST /api/ai/generate` - Generate email
- `GET /api/ai/emails` - List user emails (with pagination)
- `GET /api/ai/emails/:id` - Get single email
- `PUT /api/ai/emails/:id` - Update email
- `DELETE /api/ai/emails/:id` - Delete email

## Testing

### Run Tests
```bash
cd server
npm test
```

### Run AI Evaluation
```bash
npm run evaluate
```

### Test Coverage
- Unit tests for email generation
- Integration tests for API endpoints
- Error handling tests
- AI quality evaluation

## AI Feature Evaluation

The application includes a comprehensive AI evaluation system that assesses:

- **Tone Appropriateness**: How well the email matches the requested tone
- **Structure Quality**: Clear opening, logical flow, proper closing
- **Content Relevance**: How well the content addresses the purpose
- **Length Appropriateness**: Whether the email length matches the request

### Evaluation Metrics
- Overall Score: Weighted average of all criteria
- Grade: A-F based on overall score
- Feedback: Specific suggestions for improvement

## Project Structure

```
ai-email-generator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navigation.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── EmailGenerator.jsx
│   │   │   ├── EmailList.jsx
│   │   │   ├── EmailDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Profile.jsx
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.jsx
│   │   └── main.jsx       # App entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   │   └── ai.js         # AI and email routes
│   ├── prisma/           # Database schema
│   │   └── schema.prisma
│   ├── test/             # Test files
│   │   └── ai.test.js
│   ├── evaluation/       # AI evaluation
│   │   └── ai-evaluation.js
│   ├── seed.js           # Database seeding
│   └── index.js          # Server entry point
├── API.md                # API documentation
└── README.md
```

## Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run seed         # Seed database
npm run evaluate      # Run AI evaluation
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Security Features

- **Input Sanitization**: All inputs are sanitized
- **CORS Configuration**: Proper CORS setup
- **Environment Variables**: No secrets in repository
- **User Ownership**: Users can only access their own data
- **Error Handling**: Secure error messages

## Accessibility

- **Alt Text**: Images have proper alt text
- **Focus Management**: Keyboard navigation support
- **Color Contrast**: Accessible color schemes
- **Screen Reader**: Semantic HTML structure

## Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service

## Performance

- **Response Time**: < 800ms for CRUD operations
- **Caching**: Efficient data fetching
- **Pagination**: Large datasets handled efficiently
- **Error Handling**: Graceful degradation

## Troubleshooting

### OpenAI API Key Issues

If you're experiencing issues with the OpenAI API:

1. **Check Environment Variables**: Make sure no system-level `OPENAI_API_KEY` is set
   ```bash
   echo $OPENAI_API_KEY  # Should be empty or show your correct key
   unset OPENAI_API_KEY  # Remove system-level variable if needed
   ```

2. **Check .env File**: Ensure the key is on a single line without quotes
   ```env
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

3. **Verify API Key**: Test your key at https://platform.openai.com/api-keys

4. **Check Billing**: Ensure your OpenAI account has available credits

5. **Shell Configuration**: Check `~/.zshrc` or `~/.bashrc` for conflicting environment variables

### Common Issues

- **Port Already in Use**: Kill existing processes or change port in `.env`
- **Database Connection**: Ensure PostgreSQL is running and DATABASE_URL is correct
- **CORS Errors**: Check CLIENT_URL matches your frontend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Future Enhancements

- **Real Authentication**: Implement actual JWT authentication
- **Email Templates**: Pre-built email templates
- **Bulk Generation**: Generate multiple emails at once
- **Email Scheduling**: Schedule emails for later
- **Analytics**: Track email performance
- **Collaboration**: Share emails with team members