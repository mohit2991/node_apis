const db = require("../db");

const addMessage = async (from_user_id, to_user_id, message) => {
  const sqlQuery = `INSERT INTO messages (from_user_id, to_user_id, message) VALUES (?, ?, ?)`;
  await db.query(sqlQuery, [from_user_id, to_user_id, message]);
};

const recivedMessages = async (from_user_id, to_user_id) => {
  const sqlQuery = `SELECT * FROM users where from_user_id='${from_user_id} and to_user_id='${to_user_id}'`;

  return await db.query(sqlQuery);
};

module.exports = { addMessage, recivedMessages };