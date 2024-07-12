# User Authentication System

This is a Node.js-based user authentication system that includes functionality for user registration, login, password reset, and email-based password reset with JWT tokens.

## Features

- User registration with email, username, and password
- User login with username and password
- Forgot password functionality with email-based password reset
- JWT token-based password reset
- Automatic server restarts during development using `nodemon`

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Jsbist21/user-auth-task.git
   cd user-auth-task
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root of your project and add the following environment variables:

   ```env
   MONGODB_URI=your_mongodbURI
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. Start the server:

   - In development mode (with `nodemon`):

     ```bash
     npm run dev
     ```

   - In production mode:

     ```bash
     npm start
     ```

## API Endpoints

### User Registration

- **URL:** `/register`
- **Method:** `POST`
- **Body:**

  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password"
  }
  ```

- **Success Response:**

  ```json
  {
    "message": "User registered successfully"
  }
  ```

### User Login

- **URL:** `/login`
- **Method:** `POST`
- **Body:**

  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```

- **Success Response:**

  ```json
  {
    "message": "Login successful"
  }
  ```

### Forgot Password

- **URL:** `/forgot-password`
- **Method:** `POST`
- **Body:**

  ```json
  {
    "email": "user@example.com"
  }
  ```

- **Success Response:**

  ```json
  {
    "message": "Password reset link sent to your email"
  }
  ```

### Reset Password

- **URL:** `/reset-password/:id/:token`
- **Method:** `POST`
- **Body:**

  ```json
  {
    "newPassword": "new_password"
  }
  ```

- **Success Response:**

  ```json
  {
    "message": "Password reset successful"
  }
  ```

## Nodemon Setup

`nodemon` is used to automatically restart the server when code changes are detected during development.

- **Installation:**

  ```bash
  npm install nodemon --save-dev
  ```

- **Usage:**

  In the `package.json` file, add the following script:

  ```json
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
  ```

  To start the server in development mode, use:

  ```bash
  npm run dev
  ```
