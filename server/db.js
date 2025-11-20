// Simple in-memory store
const users = [
  { id: 1, name: 'Student User', email: 'student@campus.edu', role: 'student', password: 'password' },
  { id: 2, name: 'Admin User', email: 'admin@campus.edu', role: 'admin', password: 'admin' }
];

const tickets = [
  {
    id: 1,
    title: 'WiFi not working in Library',
    description: 'The signal is very weak on the 2nd floor.',
    category: 'Infrastructure',
    priority: 'High',
    status: 'Open',
    votes: 5,
    voters: [],
    userId: 1,
    createdAt: new Date().toISOString(),
    responses: []
  },
  {
    id: 2,
    title: 'Water cooler on 3rd floor empty',
    description: 'The water cooler near the CS department has been empty since morning.',
    category: 'Infrastructure',
    priority: 'Medium',
    status: 'Open',
    votes: 2,
    voters: [],
    userId: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    responses: []
  },
  {
    id: 3,
    title: 'Request for more library hours during exams',
    description: 'Can we extend the library closing time to 12 AM during the exam week?',
    category: 'Academic',
    priority: 'High',
    status: 'Pending',
    votes: 15,
    voters: [],
    userId: 1,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    responses: []
  },
  {
    id: 4,
    title: 'Quality of food in Mess A',
    description: 'The rice served today was undercooked.',
    category: 'Cafeteria',
    priority: 'Medium',
    status: 'Open',
    votes: 8,
    voters: [],
    userId: 3,
    createdAt: new Date(Date.now() - 200000000).toISOString(),
    responses: []
  },
  {
    id: 5,
    title: 'Stray dogs near Hostel B',
    description: 'There is a pack of aggressive dogs chasing students at night.',
    category: 'Hostel',
    priority: 'Critical',
    status: 'Open',
    votes: 12,
    voters: [],
    userId: 2,
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    responses: []
  }
];

module.exports = { users, tickets };
