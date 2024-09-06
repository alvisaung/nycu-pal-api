const mysql = require("mysql2/promise");

// Improved SQL statements
const sqlStatements = [
  `CREATE TABLE IF NOT EXISTS events_type (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    type_name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
  )`,

  `CREATE TABLE IF NOT EXISTS research (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    statement LONGTEXT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    is_img BOOLEAN NOT NULL,
    PRIMARY KEY(id)
  )`,

  `CREATE TABLE IF NOT EXISTS ResearchTopics (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    research_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    is_img BOOLEAN NOT NULL,
    FOREIGN KEY (research_id) REFERENCES research(id)
  )`,

  `CREATE TABLE IF NOT EXISTS ResearchBranches (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    is_img BOOLEAN NOT NULL,
    topic_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES ResearchTopics(id)
  )`,

  `CREATE TABLE IF NOT EXISTS member (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    research_dir VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    img_url VARCHAR(255),
    experiences LONGTEXT,
    phone VARCHAR(255),
    INDEX member_id_index (id)
  )`,

  `CREATE TABLE IF NOT EXISTS publication_type (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS publications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    img_url VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    conference_name VARCHAR(255),
    publish_yr INT,
    paper_type BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (paper_type) REFERENCES publication_type(id)
  )`,

  `CREATE TABLE IF NOT EXISTS events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    img_url JSON NOT NULL,
    title VARCHAR(255) NOT NULL,
    \`desc\` LONGTEXT,
    created_at DATE NOT NULL,
    event_type_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (event_type_id) REFERENCES events_type(id)
  )`,

  `CREATE TABLE IF NOT EXISTS about_lab (
    id BIGINT NOT NULL,
    about LONGTEXT NOT NULL,
    media_gp_url JSON NOT NULL,
    mobile VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
  )`,
];

async function setupDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "your_root_password",
      database: "nycu_pal",
    });

    for (const sql of sqlStatements) {
      await connection.execute(sql);
      console.log("Table created successfully");
    }

    console.log("All tables created successfully");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
