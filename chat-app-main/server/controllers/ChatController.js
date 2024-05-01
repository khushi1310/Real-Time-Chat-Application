import ChatModel from "../models/chatModel.js";
import mongoose from "mongoose";

export const createChatHelper = (senderId, receiverId) => {
  return new ChatModel({
    members: [senderId, receiverId],
  });
}

export const createChat = async (req, res) => {
  const newChat = createChatHelper(req.body.senderId, req.body.receiverId)
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    console.log("chat: ", "hellop");
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    console.log("chat: ", userId);
    const chat = await ChatModel.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};