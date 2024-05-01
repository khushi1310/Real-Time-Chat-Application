# Real-Time Chat Application

This is a real-time chat application with JWT authentication and Socket.io integration.

## Features

- User registration and authentication using JWT.
- Real-time messaging between users.
- Creating and managing chats.
- Sending and receiving messages.
- Realtime Status update
- Default message receive by sender if receiver is busy.

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

## necessary environment configuration

create .env file inside server folder and add these environment variable
    PORT = 5001
    MONGODB_CONNECTION = "mongodb+srv://khushi13102001:PYrIFMecgY0AWyia@chat-app.y7sqsqj.mongodb.net/chatApp"
    JWTKEY = "MERN"

## Contributors

- [Khushi Tiwari](https://github.com/khushi1310)
