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
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
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

## Posts API

### Create Post

**URL:** `/api/v1/post`  
**Method:** `POST`  
**Headers:**

- `Content-Type: multipart/form-data`
- `Authorization: Bearer <token>`  
  **Body:**
- `content`: `string` (required)
- `postImage`: `file` (optional)

**Success Response:**

```json
{
  "status": 200,
  "message": "Post created successfully",
  "data": {
    "_id": "60c72b1f4f1a5c005c8e4df0",
    "content": "This is a new post",
    "postImage": "https://cloudinary.com/image.jpg",
    "owner": "60c72a3f4f1a5c101c8e4def",
    "createdAt": "2021-06-14T10:52:15.000Z",
    "updatedAt": "2021-06-14T10:52:15.000Z"
  }
}
```

### Update Post

**URL:** `/api/v1/post/p/:postId`  
**Method:** `PATCH`  
**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <token>`  
  **Body:**
- `content`: `string` (required)

**Success Response:**

```json
{
  "status": 200,
  "message": "Post updated successfully",
  "data": {
    "_id": "60c72b1f4f1a5c001c8e4df0",
    "content": "Updated post content",
    "postImage": "https://cloudinary.com/image.jpg",
    "owner": "60c72a3f4f1a5c001c8e4def",
    "createdAt": "2021-06-14T10:52:15.000Z",
    "updatedAt": "2021-06-14T11:52:15.000Z"
  }
}
```

### Get All Posts

**URL:** `/api/v1/post`  
**Method:** `GET`  
**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <token>` (optional if posts are public)

**Success Response:**

```json
{
  "status": 200,
  "message": "Posts fetched successfully",
  "data": [
    {
      "_id": "60c72b1f4f1a5c001c8e4df0",
      "content": "Post content",
      "postImage": "https://cloudinary.com/image.jpg",
      "owner": {
        "_id": "60c72a3f4f1a5c001c8e4def",
        "username": "username",
        "email": "user@example.com"
      },
      "createdAt": "2021-06-14T10:52:15.000Z",
      "updatedAt": "2021-06-14T10:52:15.000Z",
      "comments": [
        {
          "_id": "60c72c1f4f1a5c001c8e4df1",
          "content": "Comment content",
          "owner": {
            "_id": "60c72b1f4f1a5c001c8e4df2",
            "username": "commenter",
            "email": "commenter@example.com"
          },
          "createdAt": "2021-06-14T11:00:00.000Z",
          "updatedAt": "2021-06-14T11:00:00.000Z"
        }
      ],
      "likes": [
        {
          "_id": "60c72c2f4f1a5c001c8e4df3",
          "likedBy": {
            "_id": "60c72b1f4f1a5c001c8e4df4",
            "username": "liker",
            "email": "liker@example.com"
          },
          "createdAt": "2021-06-14T11:01:00.000Z",
          "updatedAt": "2021-06-14T11:01:00.000Z"
        }
      ]
    }
  ]
}
```

### Delete Post

**URL:** `/api/v1/post/p/:postId`  
**Method:** `DELETE`  
**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Success Response:**

```json
{
  "status": 200,
  "message": "Post deleted successfully",
  "data": null
}
```

### Like Post

Likes a specific post.

**URL:** `/api/v1/likes/toggle/p/:postId`  
**Method:** `POST`  
**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Success Response:**

```json
{
  "status": 200,
  "message": "Post liked successfully",
  "data": {
    "postId": "post_id",
    "likedBy": "user_id"
  }
}
```

### Like Comment

Likes a specific comment on a post.

**URL:** `/api/v1/likes/toggle/c/:commentId`  
**Method:** `POST`  
**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Success Response:**

```json
{
  "status": 200,
  "message": "Comment liked successfully",
  "data": {
    "commentId": "comment_id",
    "likedBy": "user_id"
  }
}
```

### Comment on Post

Adds a comment to a specific post.

**URL:** `/api/v1/comment/:postId`  
**Method:** `POST`  
**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Body:**

```json
{
  "content": "Your comment content here"
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
