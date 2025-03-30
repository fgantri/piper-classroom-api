import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  host: process.env.PG_DB_HOST,
  user: process.env.PG_DB_USER,
  port: +(process.env.PG_DB_PORT ?? 5432),
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_NAME,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if the connection fails
  }
}

async function dropTablesIfExist() {
  const dropTablesQuery = `
    DROP TABLE IF EXISTS "sessions", "modules", "classes" CASCADE;
  `;

  try {
    console.log("Dropping existing tables...");
    await client.query(dropTablesQuery);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

async function createTablesIfNotExist() {
  const createClassTableQuery = `
    CREATE TABLE IF NOT EXISTS "classes" (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT
    );
  `;

  const createModuleTableQuery = `
    CREATE TABLE IF NOT EXISTS "modules" (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      class_id INTEGER REFERENCES "classes" (id) ON DELETE CASCADE
    );
  `;

  const createSessionTableQuery = `
    CREATE TABLE IF NOT EXISTS "sessions" (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      module_id INTEGER REFERENCES "modules" (id) ON DELETE CASCADE
    );
  `;

  try {
    // Create tables
    await client.query(createClassTableQuery);
    await client.query(createModuleTableQuery);
    await client.query(createSessionTableQuery);
    console.log("Tables created or already exist");
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1); // Exit the process if the table creation fails
  }
}

async function initDB() {
  await connectToDatabase();
  if (process.env.PG_DB_MODE === "debug") {
    await dropTablesIfExist();
    await createTablesIfNotExist();
  }
}

initDB();

export { client };
