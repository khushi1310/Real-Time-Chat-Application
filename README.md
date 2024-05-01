# Real-Time Chat Application

This is a real-time chat application with JWT authentication and Socket.io integration.

## Features

- User registration and authentication using JWT.
- Real-time messaging between users.
- Creating and managing chats.
- Sending and receiving messages.
- Creating, updating, and deleting posts.
- User profile management.
- Following and unfollowing other users.

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Socket.io
- JWT (JSON Web Tokens)
- bcrypt
- mongoose
- Other necessary dependencies

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/khushi1310/Real-Time-Chat-Application.git
   cd real-time-chat-application
   cd client
   npm install

   Open new terminal:
   cd real-time-chat-application
   cd server
   npm install

   Open another new terminal:
   cd real-time-chat-application
   cd socket
   npm install

2. Start the server, socket and client:
   npm start

## API Routes explained

### Authentication

#### Register User

- **Route**: `POST /api/auth/register`
- **Input**:
  - Body:
    - username: String (required)
    - password: String (required)
- **Output**:
  - Success (200):
    - user: Object (registered user details)
    - token: String (JWT token for authentication)
  - Error (400):
    - message: String ("User already exists")
- **Logic**:
  - Hash the provided password.
  - Check if the username already exists in the database.
  - If the username does not exist, save the new user details in the database, generate a JWT token, and return the user details along with the token.
  - If the username already exists, return an error message.

#### Login User

- **Route**: `POST /api/auth/login`
- **Input**:
  - Body:
    - username: String (required)
    - password: String (required)
- **Output**:

  - Success (200):
    - user: Object (authenticated user details)
    - token: String (JWT token for authentication)
  - Error (400):
    - message: String ("Wrong password")
  - Error (404):
    - message: String ("User not found")
  - Error (500):
    - message: String (error message)

- **Logic**:
  - Find the user with the provided username in the database.
  - If the user exists, compare the provided password with the hashed password stored in the database.
  - If the password is correct, generate a JWT token and return the user details along with the token.
  - If the password is incorrect, return an error message.
  - If the user does not exist, return an error message.

### Chat

#### Create Chat

- **Route**: `POST /api/chat`
- **Input**:
  - Body:
    - senderId: String (required)
    - receiverId: String (required)
- **Output**:

  - Success (200):
    - Object (created chat details)
  - Error (500):
    - message: String (error message)

- **Logic**:
  - Create a new chat between the sender and receiver IDs provided in the request body.
  - Save the new chat in the database.
  - Return the details of the created chat.

#### Get User Chats

- **Route**: `GET /api/chat/:userId`
- **Input**:
  - Params:
    - userId: String (required)
- **Output**:

  - Success (200):
    - Array of Objects (chats associated with the user)
  - Error (500):
    - message: String (error message)

- **Logic**:
  - Find all chats where the provided user ID is a member.
  - Return the chats associated with the user.

#### Find Chat

- **Route**: `GET /api/chat/:firstId/:secondId`
- **Input**:
  - Params:
    - firstId: String (required)
    - secondId: String (required)
- **Output**:

  - Success (200):
    - Object (found chat details)
  - Error (500):
    - message: String (error message)

- **Logic**:
  - Find a chat where both provided IDs are members.
  - Return the details of the found chat.

### Message

#### Add Message

- **Route**: `POST /api/message`
- **Input**:
  - Body:
    - chatId: String (required)
    - senderId: String (required)
    - text: String (required)
- **Output**:

  - Success (200):
    - Object (added message details)
  - Error (500):
    - message: String (error message)

- **Logic**:
  - Create a new message with the provided chat ID, sender ID, and text.
  - Save the new message in the database.
  - Return the details of the added message.

#### Get Messages

- **Route**: `GET /api/message/:chatId`
- **Input**:
  - Params:
    - chatId: String (required)
- **Output**:

  - Success (200):
    - Array of Objects (messages associated with the chat)
  - Error (500):
    - message: String (error message)

- **Logic**:
  - Find all messages associated with the provided chat ID.
  - Return the messages associated with the chat.

### Post

#### Create Post

- **Route**: `POST /api/post`
- **Input**:
  - Body:
    - All fields as per the PostModel schema
- **Output**:
  - Success (200):
    - Object (created post details)
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Create a new post with the provided details.
  - Save the new post in the database.
  - Return the details of the created post.

#### Get Post

- **Route**: `GET /api/post/:id`
- **Input**:
  - Params:
    - id: String (required)
- **Output**:
  - Success (200):
    - Object (retrieved post details)
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Find the post with the provided ID.
  - Return the details of the retrieved post.

#### Update Post

- **Route**: `PUT /api/post/:id`
- **Input**:
  - Params:
    - id: String (required)
  - Body:
    - userId: String (required)
    - All fields to be updated as per the PostModel schema
- **Output**:
  - Success (200):
    - String ("Post updated!")
  - Error (403):
    - message: String ("Authentication failed")
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Find the post with the provided ID.
  - Check if the provided user ID matches the post's user ID.
  - If authenticated, update the post with the provided fields.
  - Return a success message if the post is updated successfully.
  - If authentication fails, return an error message.

#### Delete Post

- **Route**: `DELETE /api/post/:id`
- **Input**:
  - Params:
    - id: String (required)
  - Body:
    - userId: String (required)
- **Output**:
  - Success (200):
    - String ("Post deleted.")
  - Error (403):
    - message: String ("Action forbidden")
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Find the post with the provided ID.
  - Check if the provided user ID matches the post's user ID.
  - If authenticated, delete the post.
  - Return a success message if the post is deleted successfully.
  - If authentication fails, return an error message.

#### Like/Dislike Post

- **Route**: `POST /api/post/like/:id`
- **Input**:
  - Params:
    - id: String (required, post ID)
  - Body:
    - userId: String (required)
- **Output**:
  - Success (200):
    - String ("Post liked") or String ("Post disliked")
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Find the post with the provided ID.
  - Check if the user ID is included in the post's likes array.
  - If the user already liked the post, remove their like.
  - If the user hasn't liked the post, add their like.
  - Return a success message indicating whether the post was liked or disliked.

#### Get Timeline Posts

- **Route**: `GET /api/post/timeline/:id`
- **Input**:
  - Params:
    - id: String (required, user ID)
- **Output**:
  - Success (200):
    - Array of Objects (posts for the user's timeline)
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Retrieve all posts created by the user with the provided ID.
  - Retrieve posts from users that the provided user follows.
  - Merge and sort the posts by their creation date.
  - Return the posts for the user's timeline.

### User

#### Get User

- **Route**: `GET /api/user/:id`
- **Input**:
  - Params:
    - id: String (required)
- **Output**:
  - Success (200):
    - Object (retrieved user details)
  - Error (404):
    - message: String ("No such User")
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Find the user with the provided ID.
  - If the user exists, return their details.
  - If the user does not exist, return an error message.

#### Get All Users

- **Route**: `GET /api/user/all`
- **Input**: None
- **Output**:
  - Success (200):
    - Array of Objects (details of all users)
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Retrieve details of all users from the database.
  - Return an array containing the details of all users.

#### Update User

- **Route**: `PUT /api/user/:id`
- **Input**:
  - Params:
    - id: String (required)
  - Body:
    - \_id: String (required)
    - currentUserAdmin: Boolean (required)
    - password: String (optional)
    - All other fields to be updated as per the UserModel schema
- **Output**:
  - Success (200):
    - Object (updated user details)
    - token: String (JWT token for authentication)
  - Error (403):
    - message: String ("Access Denied! You can update only your own Account.")
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Check if the provided user ID matches the ID in the request path.
  - If authenticated, update the user details, including the password if provided.
  - Generate a new JWT token after updating user details.
  - Return the updated user details along with the new token.
  - If authentication fails, return an error message.

#### Delete User

- **Route**: `DELETE /api/user/:id`
- **Input**:
  - Params:
    - id: String (required)
  - Body:
    - currentUserId: String (required)
    - currentUserAdmin: Boolean (required)
- **Output**:
  - Success (200):
    - String ("User Deleted Successfully!")
  - Error (403):
    - message: String ("Access Denied!")
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Check if the provided user ID matches the ID in the request path or if the user is an admin.
  - If authenticated, delete the user.
  - Return a success message if the user is deleted successfully.
  - If authentication fails, return an error message.

#### Follow User

- **Route**: `POST /api/user/follow/:id`
- **Input**:
  - Params:
    - id: String (required, user ID to follow)
  - Body:
    - \_id: String (required)
- **Output**:
  - Success (200):
    - String ("User followed!")
  - Error (403):
    - message: String ("Action Forbidden")
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Check if the provided user ID is not the same as the user ID to follow.
  - If authenticated, check if the user is not already following the target user.
  - If not already following, update the follower and following lists for both users.
  - Return a success message if the user is followed successfully.
  - If authentication fails or the user is already following the target user, return an error message.

#### Unfollow User

- **Route**: `POST /api/user/unfollow/:id`
- **Input**:
  - Params:
    - id: String (required, user ID to unfollow)
  - Body:
    - \_id: String (required)
- **Output**:
  - Success (200):
    - String ("Unfollowed Successfully!")
  - Error (403):
    - message: String ("Action Forbidden") or String ("You are not following this User")
  - Error (500):
    - message: String (error message)
- **Logic**:
  - Check if the provided user ID is not the same as the user ID to unfollow.
  - If authenticated, check if the user is currently following the target user.
  - If already following, update the follower and following lists for both users.
  - Return a success message if the user is unfollowed successfully.
  - If authentication fails, the user is not following the target user, or any other error occurs, return an error message.

This concludes the detailed description of all API routes available in the Real-Time Chat Application.

## necessary environment configuration

create .env file inside server folder and add these environment variable
    PORT = 5001
    MONGODB_CONNECTION = "mongodb+srv://khushi13102001:PYrIFMecgY0AWyia@chat-app.y7sqsqj.mongodb.net/chatApp"
    JWTKEY = "MERN"

## Contributors

- [Khushi Tiwari](https://github.com/khushi1310)
