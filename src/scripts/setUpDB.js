const db = require("../models");

async function setupDatabase() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await db.sequelize.close();
  }
}

setupDatabase();
