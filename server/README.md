# Learning Platform - Microservices Backend

## Architecture Overview

This backend follows a microservices architecture pattern, consisting of multiple independent services that communicate through an API Gateway.

## Services

### API Gateway (Port 5000)
- Routes incoming requests to appropriate microservices
- Handles CORS, authentication, and request/response transformation
- Entry point for all client requests

### Auth Service (Port 3001)
- User authentication and authorization
- JWT token management
- User registration and login

### Sessions Service (Port 3002)
- Live session management
- Session recordings
- Attendance tracking
- Virtual classroom functionality

### Events Service (Port 3003)
- Event creation and management
- Event registration
- Team management
- Project submissions
- Results and rankings

### Blog Service (Port 3004)
- Blog post CRUD operations
- Comments and interactions
- Documentation management
- Content categorization

### Community Service (Port 3005)
- Community creation and management
- Discussion threads
- Announcements
- Member management
- Group chat functionality

## Project Structure

```
server/
├── services/          # Individual microservices
├── shared/            # Shared utilities and middleware
├── gateway/           # API Gateway service
└── docker-compose.yml # Docker orchestration (for future use)
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Running Services Locally

Each service can be run independently:

```bash
# Navigate to a service directory
cd services/auth-service

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the service
npm start
```

### Environment Variables

Each service has its own `.env.example` file. Copy it to `.env` and configure the required variables.

## Development

### Service Ports
- Gateway: 5000
- Auth Service: 3001
- Sessions Service: 3002
- Events Service: 3003
- Blog Service: 3004
- Community Service: 3005

### Health Checks

All services expose a `/health` endpoint for monitoring:
- `GET /health` - Returns service status

## Future Enhancements

- Docker containerization
- Service discovery
- Message queue integration
- Database connections
- Redis caching
- API documentation (Swagger/OpenAPI)

