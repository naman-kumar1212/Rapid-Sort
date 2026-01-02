/**
 * Database Connection (MongoDB via Mongoose)
 *
 * Exposes an async function that connects using the MONGODB_URI environment
 * variable (loaded via dotenv in server.js). On failure we log the error and
 * exit the process with a non-zero code to signal startup failure.
 */
const mongoose = require('mongoose');

/**
 * Connects to MongoDB using async/await syntax. This allows for more readable
 * and synchronous-looking code while still handling asynchronous operations.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    /**
     * If connection fails, exit the process with a non-zero code to signal
     * startup failure. This ensures the application does not continue running
     * without a database connection.
     */
    process.exit(1);
  }
};

/**
 * Export the connectDB function using CommonJS syntax, making it available for
 * import in other modules.
 */
module.exports = connectDB;