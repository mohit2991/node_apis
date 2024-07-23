const db = require("../db");

const getUserByEmail = async (email) => {
  const users = db.query(`SELECT * FROM users WHERE email=?`, [email]);
  return users;
};

const createUser = async (name, email, phone, password) => {
  const sqlQuery = `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`;
  await db.query(sqlQuery, [name, email, phone, password]);
};

// const db = require("../db");

// const login = async (params) => {
//   const { email } = params;
//   const sqlQuery = "SELECT * FROM users WHERE email = ?";

//   try {
//     const [results] = await db.query(sqlQuery, [email]);
//     return { status: true, results };
//   } catch (error) {
//     return { status: false, error };
//   }
// };

module.exports = { getUserByEmail, createUser };
