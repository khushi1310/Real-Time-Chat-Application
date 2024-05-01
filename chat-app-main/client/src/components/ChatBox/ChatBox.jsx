import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji'
import { io } from "socket.io-client";


const ChatBox = ({ chat, currentUser, setSendMessage,  receivedMessage}) => {
  console.log(receivedMessage)
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  const handleChange = (newMessage)=> {
    setNewMessage(newMessage)
  }

  // fetching data for header
  useEffect(() => {
    // socket.current = io("ws://localhost:8800");
    // socket.current.on("get-users", (users) => {
    //   setOnlineUsers(users);
    // });
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        console.log(data)
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // fetch messages
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);


  // Always scroll to last Message
  useEffect(()=> {
    // socket.current = io("ws://localhost:8800");
    // socket.current.on("get-users", (users) => {
    //   setOnlineUsers(users);
    // });
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])



// Function to send the message
const sendMessage = async (message, receiverId) => {
  try {
    const { data } = await addMessage(message);
    setMessages([...messages, data]);
    setNewMessage("");
  } catch (error) {
    console.log("error", error);
  }
};

// Function to send the default message if recipient is not online
const sendDefaultMessage = async (message, receiverId) => {
  setTimeout(async () => {
    const draftMessage = {
      senderId: receiverId,
      text: "The user is currently unavailable. Please try again later.",
      chatId: message.chatId,
    };
    setMessages([...messages, draftMessage]);
  }, 10000); // 10 seconds timeout
};

// Send Message
const handleSend = async (e) => {
  e.preventDefault();
  const message = {
    senderId: currentUser,
    text: newMessage,
    chatId: chat._id,
  };
  const receiverId = chat.members.find((id) => id !== currentUser);
  const recipientActive = onlineUsers.some((user) => user.userId === receiverId);

  // Send message to socket server
  setSendMessage({ ...message, receiverId });

  // Send message to database
  await sendMessage(message, receiverId);

  // If recipient is not in the active users list, send a draft message after a timeout
  if (!recipientActive) {
    await sendDefaultMessage(message, receiverId);
  }
};


// Receive Message from parent component
useEffect(()=> {
  console.log("Message Arrived: ", receivedMessage)
  if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
    setMessages([...messages, receivedMessage]);
  }

},[receivedMessage])



  const scroll = useRef();
  const imageRef = useRef();
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower">
                <div>
                  <img
                    src={
                      userData?.profilePicture
                        ? process.env.REACT_APP_PUBLIC_FOLDER +
                          userData.profilePicture
                        : process.env.REACT_APP_PUBLIC_FOLDER +
                          "defaultProfile.png"
                    }
                    alt="Profile"
                    className="followerImage"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name" style={{ fontSize: "0.9rem" }}>
                    <span>
                      {userData?.firstname} {userData?.lastname}
                    </span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div>
            {/* chat-body */}
            <div className="chat-body" >
              {messages.map((message) => (
                <>
                  <div ref={scroll}
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>{" "}
                    <span>{format(message.createdAt)}</span>
                  </div>
                </>
              ))}
            </div>
            {/* chat-sender */}
            <div className="chat-sender">
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
              />
              <div className="send-button button" onClick = {handleSend}>Send</div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>{" "}
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
