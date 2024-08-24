const { addMessage, recivedMessages } = require("../models/ChatModel");
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
  const { email } = req.user;

  const existingEmail = await getUserByEmail(email);
  if (existingEmail.length === 0) {
    return res.status(401).json({
      message: "Invaild Request!",
      status: false,
    });
  }

  const from_user_id = existingEmail[0].id;

  const messages = await recivedMessages(from_user_id);

  return res.status(200).json({
    userId: from_user_id,
    chatData: messages,
    message: "Chat Data!",
    status: true,
  });
};

module.exports = { sendMessage, getMessages };
