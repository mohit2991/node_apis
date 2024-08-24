const db = require("../db");

const addMessage = async (from_user_id, to_user_id, message) => {
  const sqlQuery = `INSERT INTO messages (from_user_id, to_user_id, message) VALUES (?, ?, ?)`;
  await db.query(sqlQuery, [from_user_id, to_user_id, message]);
};

const recivedMessages = async (from_user_id) => {
  const sqlQuery = `SELECT * FROM messages where from_user_id=? or to_user_id=?`;

  return await db.query(sqlQuery, [from_user_id, from_user_id]);
};

module.exports = { addMessage, recivedMessages };
