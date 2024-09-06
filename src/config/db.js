module.exports = {
  development: {
    username: "root",
    password: "",
    database: "nycu_pal",
    host: "127.0.0.1", // Use IP address instead of 'localhost'
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
    },
    logging: console.log, // This will log all SQL queries
  },
};
