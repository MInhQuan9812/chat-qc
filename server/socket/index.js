const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const getUserDetailFromToken = require("../helpers/getUserDetailFromToken");
const UserModel = require("../models/UserModel");
const { ConservationModel } = require("../models/ConservationModel");
const { MessageModel } = require("../models/MessageModel");
const getConversation = require("../helpers/getConversation");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUser = new Set();

io.on("connection", async (socket) => {
  // console.log("New WebSocket connection:", socket.id);
  // console.log(socket);
  const token = socket.handshake.auth.token;
  const user = await getUserDetailFromToken(token);
  // console.log(user);
  socket.join(user?._id.toString());
  onlineUser.add(user?._id.toString());

  io.emit("onlineUser", Array.from(onlineUser));
  // console.log(socket)

  socket.on("message-page", async (userId) => {
    console.log("userId", userId);
    const userDetails = await UserModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };
    socket.emit("message-user", payload);

    const getConversationMessage = await ConservationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updated: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  socket.on("new-message", async (data) => {
    let conversation = await ConservationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    if (!conversation) {
      const createConversation = await ConservationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data?.msgByUserId,
    });

    const saveMessage = await message.save();
    const updateConversation = await ConservationModel.updateOne(
      {
        _id: conversation?._id,
      },
      {
        $push: { messages: saveMessage?._id },
      }
    );

    const getConversationMessage = await ConservationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updated: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );

    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });

  socket.on("sidebar", async (currentUserId) => {
    console.log("current user", currentUserId);
    const conversation = await getConversation(currentUserId);
    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await ConservationModel.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });
    const conversationMessageId = conversation?.messages || [];
    const updateMessages = await MessageModel.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
      { $set: { seen: true } }
    );

    const conversationSender = await getConversation(user?._id?.toString())
    const conversationReceiver = await getConversation(msgByUserId)

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);

   
  });
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString())
    console.log("User disconnected:", socket.id);
  });
});

module.exports = { app, server };
