const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/db.js").development;
let sequelize;
try {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    logging: console.log, // This will log all SQL queries
  });
} catch (err) {
  console.error("Unable to connect to the database:", err);
  process.exit(1);
}
const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
