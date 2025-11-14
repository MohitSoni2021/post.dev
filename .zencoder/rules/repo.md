---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
Developer News Provider is a full-stack web application that keeps users informed about the latest tech trends and job opportunities. The platform integrates news, career insights, and AI-powered analytics for professional growth.

## Repository Structure
- **backend/**: Node.js/Express API server with authentication, posts, and user management
- **frontend/**: React application built with Vite, featuring a modern UI with Tailwind CSS
- **Root files**: Overall project configuration and documentation

### Main Repository Components
- **Backend API**: Handles user authentication, post management, and data persistence using MongoDB and Firebase
- **Frontend Client**: Provides the user interface for browsing news, jobs, and managing profiles
- **Database Layer**: Supports both MongoDB (via Mongoose) and PostgreSQL (via Sequelize)

## Projects

### Backend (Node.js API)
**Configuration File**: backend/package.json

#### Language & Runtime
**Language**: JavaScript (ES Modules)
**Version**: Node.js 18+ (based on dependency compatibility)
**Build System**: npm
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- express: ^4.21.2 (Web framework)
- mongoose: ^8.9.2 (MongoDB ODM)
- sequelize: ^6.37.5 (PostgreSQL ORM)
- bcrypt/bcryptjs: Authentication utilities
- jsonwebtoken: ^9.0.2 (JWT handling)
- firebase/firebase-admin: ^11.2.0/^13.0.2 (Firebase services)
- cors: ^2.8.5 (Cross-origin requests)
- dotenv: ^16.4.7 (Environment variables)
- validator: ^13.12.0 (Data validation)
**Development Dependencies**:
- jest: ^29.7.0 (Testing framework)
- nodemon: ^3.1.9 (Development server)
- supertest: ^7.0.0 (API testing)

#### Build & Installation
```bash
cd backend
npm install
```

#### Testing
**Framework**: Jest
**Test Location**: No test files currently implemented
**Naming Convention**: *.test.js
**Configuration**: jest configuration in package.json
**Run Command**:
```bash
cd backend
npm test
```

### Frontend (React Application)
**Configuration File**: frontend/package.json

#### Language & Runtime
**Language**: JavaScript (ES Modules)
**Version**: Node.js 18+ (based on Vite requirements)
**Build System**: Vite
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- react: ^18.3.1 (UI framework)
- react-dom: ^18.3.1 (React DOM rendering)
- react-router-dom: ^7.1.4 (Routing)
- axios: ^1.7.9 (HTTP client)
- zustand: ^5.0.3 (State management)
- framer-motion: ^12.4.7 (Animations)
- tailwindcss: ^4.0.1 (CSS framework)
- lucide-react: ^0.474.0 (Icons)
- react-hot-toast: ^2.5.2 (Notifications)
- encrypt-storage: ^2.14.6 (Secure local storage)
**Development Dependencies**:
- vite: ^6.0.5 (Build tool)
- @vitejs/plugin-react: ^4.3.4 (React plugin)
- eslint: ^9.17.0 (Linting)
- @types/react: ^18.3.18 (TypeScript types)

#### Build & Installation
```bash
cd frontend
npm install
npm run dev  # Development server
npm run build  # Production build
```

#### Testing
**Framework**: No testing framework configured
**Test Location**: No test files implemented
**Naming Convention**: Not established
**Configuration**: None
**Run Command**: Not available