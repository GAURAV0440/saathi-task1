const mysql = require("../db/mysql");

const createVisaTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS visa_requirements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      country VARCHAR(100),
      passport VARCHAR(100),
      travel_dates VARCHAR(100),
      purpose VARCHAR(100),
      requirements TEXT
    )
  `;

  mysql.query(sql, (err) => {
    if (err) {
      console.error("❌ MySQL table creation failed:", err);
    } else {
      console.log("✅ MySQL visa_requirements table ready");
    }
  });
};

module.exports = createVisaTable;
