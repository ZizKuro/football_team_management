const mongoose = require('mongoose');

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Footballdb';

console.log('🔍 MongoDB URI:', MONGODB_URI ? 'Set' : 'Not set');

// Connect to MongoDB with improved options
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log(`✅ Connected to Football Database: ${MONGODB_URI}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB Connection Error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔒 MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = { connectDB, mongoose };
