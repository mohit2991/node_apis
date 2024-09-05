const {
  addMessage,
  customerRecivedMessages,
  supportRecivedMessages,
} = require("../models/ChatModel");
const { getUserByEmail } = require("../models/UserModel");

const sendMessage = async (req, res) => {
  const { to_user_id, message } = req.body;
  const { email } = req.user;

  const existingEmail = await getUserByEmail(email);
  if (existingEmail.length === 0) {
    return res.status(401).json({
      message: "Invaild Request!",
      status: false,
    });
  }

  const from_user_id = existingEmail[0].id;

  try {
    // Save the message in the database
    await addMessage(from_user_id, to_user_id, message);

    return res.status(200).json({
      message: "Message sent successfully!",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

const getMessages = async (req, res) => {
  const { to_user_id } = req.body;
  const { email } = req.user;

  const existingEmail = await getUserByEmail(email);
  if (existingEmail.length === 0) {
    return res.status(401).json({
      message: "Invaild Request!",
      status: false,
    });
  }

  const from_user_id = existingEmail[0].id;

  let messages = [];

  if (!to_user_id) {
    messages = await customerRecivedMessages(from_user_id, from_user_id);
  } else {
    messages = await supportRecivedMessages(from_user_id, to_user_id);
  }

  return res.status(200).json({
    userId: from_user_id,
    chatData: messages,
    message: "Chat Data!",
    status: true,
  });
};

const sendMessageIo = async (payload) => {
  const { email, to_user_id, message } = payload;

  const existingEmail = await getUserByEmail(email);
  if (existingEmail.length === 0) {
    // return res.status(401).json({
    //   message: "Invaild Request!",
    //   status: false,
    // });
  }

  const from_user_id = existingEmail[0].id;

  try {
    // Save the message in the database
    await addMessage(from_user_id, to_user_id, message);

    // return res.status(200).json({
    //   message: "Message sent successfully!",
    //   status: true,
    // });
  } catch (error) {
    // return res.status(500).json({
    //   message: error.message,
    //   status: false,
    // });
  }
};

const getMessagesIo = async (payload, socket) => {
  const { email, to_user_id } = payload;

  const existingEmail = await getUserByEmail(email);
  if (existingEmail.length === 0) {
    socket.emit("error", "Invaild Request!");
  }

  const from_user_id = existingEmail[0].id;

  let messages = [];

  if (!to_user_id) {
    messages = await customerRecivedMessages(from_user_id, from_user_id);
  } else {
    messages = await supportRecivedMessages(from_user_id, to_user_id);
  }

  // console.log(">>>>>>>>> mohit messages", messages);

  return messages;
};

module.exports = { sendMessage, getMessages, sendMessageIo, getMessagesIo };
