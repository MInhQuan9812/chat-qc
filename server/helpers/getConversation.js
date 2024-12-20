const { ConservationModel } = require("../models/ConservationModel");

const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const currentUserConversation = await ConservationModel.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: "messages",
        select: "-password", // Loại trừ trường password
      })
      .populate({
        path: "sender",
        select: "-password", // Loại trừ trường password của sender
      })
      .populate({
        path: "receiver",
        select: "-password", // Loại trừ trường password của receiver
      });
    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv?.messages?.reduce((preve, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== currentUserId) {
          return preve + (curr?.seen ? 0 : 1);
        } else {
          return preve;
        }
      }, 0);

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1],
      };
    });

    return conversation;
  } else {
    return [];
  }
};

module.exports = getConversation;
