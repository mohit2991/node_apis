const db = require("../db");

const login = async (params) => {
  const { email } = params;
  const sqlQuery = "SELECT * FROM users WHERE email = ?";

  try {
    const [results] = await db.query(sqlQuery, [email]);
    return { status: true, results };
  } catch (error) {
    return { status: false, error };
  }
};

module.exports = { login };
