const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const wipeDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus_portal');
    console.log('Connected to MongoDB...');
    
    await mongoose.connection.db.dropDatabase();
    console.log('Database wiped successfully! 🗑️');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

wipeDB();
