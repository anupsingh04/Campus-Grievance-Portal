const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const College = require('./models/College');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus_portal');
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await College.deleteMany({});
    console.log('Cleared old data.');

    // 1. Create Colleges
    const collegeA = await College.create({
      name: 'Tech Institute of Technology',
      slug: 'tech',
      domain: 'tech.edu',
      address: 'Silicon Valley, CA'
    });

    const collegeB = await College.create({
      name: 'Arts & Science University',
      slug: 'arts',
      domain: 'arts.edu',
      address: 'New York, NY'
    });

    console.log('Created Colleges: Tech Institute & Arts University');

    // 2. Create Users (Password: 'password' for all)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    // Super Admin (No College)
    await User.create({
      name: 'Super Admin',
      email: 'super@admin.com',
      password: hashedPassword,
      role: 'superadmin'
    });

    // College A Users
    const adminA = await User.create({
      name: 'Tech Admin',
      email: 'admin@tech.edu',
      password: hashedPassword,
      role: 'admin',
      collegeId: collegeA._id
    });

    const studentA1 = await User.create({
      name: 'Alice Tech',
      email: 'alice@tech.edu',
      password: hashedPassword,
      role: 'student',
      collegeId: collegeA._id
    });

    const studentA2 = await User.create({
      name: 'Bob Coder',
      email: 'bob@tech.edu',
      password: hashedPassword,
      role: 'student',
      collegeId: collegeA._id
    });

    // College B Users
    const adminB = await User.create({
      name: 'Arts Admin',
      email: 'admin@arts.edu',
      password: hashedPassword,
      role: 'admin',
      collegeId: collegeB._id
    });

    const studentB1 = await User.create({
      name: 'Charlie Artist',
      email: 'charlie@arts.edu',
      password: hashedPassword,
      role: 'student',
      collegeId: collegeB._id
    });

    console.log('Created Users for both colleges.');

    // 3. Create Tickets
    // Tickets for College A
    await Ticket.create([
      {
        title: 'Lab 3 Server Down',
        description: 'The main server in CS Lab 3 is not responding.',
        category: 'Infrastructure',
        priority: 'High',
        status: 'Open',
        votes: 10,
        userId: studentA1._id,
        collegeId: collegeA._id
      },
      {
        title: 'Hackathon Funding',
        description: 'Requesting budget approval for the annual hackathon.',
        category: 'Academic',
        priority: 'Medium',
        status: 'Pending',
        votes: 25,
        userId: studentA2._id,
        collegeId: collegeA._id
      }
    ]);

    // Tickets for College B
    await Ticket.create([
      {
        title: 'Painting Studio Lighting',
        description: 'The lights in the north studio are flickering.',
        category: 'Infrastructure',
        priority: 'Medium',
        status: 'Open',
        votes: 5,
        userId: studentB1._id,
        collegeId: collegeB._id
      },
      {
        title: 'Exhibition Space Request',
        description: 'Need the main hall for the senior showcase.',
        category: 'Other',
        priority: 'High',
        status: 'Open',
        votes: 8,
        userId: studentB1._id,
        collegeId: collegeB._id
      }
    ]);

    console.log('Created Tickets for both colleges.');
    console.log('Seeding Complete! 🌱');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
