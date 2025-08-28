import { getReceiverSocketId, io } from "../index.js";
import { Convo } from "../models/convo.models.js";
import { Message } from "../models/message.model.js";

const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const { message } = req.body;

    let convoExists = await Convo.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!convoExists) {
      convoExists = await Convo.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (convoExists) {
      convoExists.messages.push(newMessage._id);
    }
    await convoExists.save();
    await newMessage.save();
    await Promise.all([convoExists.save(), newMessage.save()]);
    // socket io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.id;
    const convo = await Convo.findOne({
      participants: {$all:[senderId,receiverId]}
    }).populate("messages");
    if(!convo){
      return res.status(404).json({ message: "Conversation not found" });
    }

    return res.status(200).json({ message: "Messages fetched successfully",convo });

  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
export { sendMessage, getMessages };
