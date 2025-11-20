import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const StudentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tickets`);
      // In a real app, we might fetch all to see public votes, but for now let's stick to the user's view or all public?
      // The requirement implies "voting", which usually means seeing everyone's tickets. 
      // But the original code filtered by `userId`. 
      // If I can vote, I should probably see other people's tickets too? 
      // "users can vote or down vote a grievence" -> implies public visibility.
      // Let's assume for this feature, the dashboard shows ALL tickets to allow voting.
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleVote = async (id, action) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/vote`, { 
        action
      });
      fetchTickets(); // Refresh to get new order
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and Sort
  const filteredTickets = tickets
    .filter(t => filterCategory === 'All' || t.category === filterCategory)
    .sort((a, b) => b.votes - a.votes);

  const categories = ['All', 'Infrastructure', 'Academic', 'Hostel', 'Cafeteria', 'Other'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Campus Grievances</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm font-medium text-slate-600">Filter by:</label>
          <select
            id="category-filter"
            className="input-field py-1.5 pl-3 pr-8 w-40 text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No tickets found in this category.</p>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const userVote = ticket.voters?.find(v => v.userId === user.id)?.action;
            
            return (
            <Card key={ticket.id} className="flex gap-4" hover>
              {/* Vote Controls */}
              <div className="flex flex-col items-center justify-start pt-1 gap-1">
                <button 
                  onClick={() => handleVote(ticket.id, 'upvote')}
                  className={`p-1 rounded transition-colors ${userVote === 'upvote' ? 'bg-violet-100 text-violet-600' : 'hover:bg-violet-50 text-slate-400 hover:text-violet-600'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                </button>
                <span className={`font-bold text-lg ${ticket.votes > 0 ? 'text-violet-600' : ticket.votes < 0 ? 'text-red-500' : 'text-slate-600'}`}>
                  {ticket.votes}
                </span>
                <button 
                  onClick={() => handleVote(ticket.id, 'downvote')}
                  className={`p-1 rounded transition-colors ${userVote === 'downvote' ? 'bg-red-100 text-red-600' : 'hover:bg-red-50 text-slate-400 hover:text-red-600'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">{ticket.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>Posted by User #{ticket.userId}</span>
                      <span>•</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge status={ticket.status} />
                </div>
                <p className="text-slate-600 mb-3">{ticket.description}</p>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                    {ticket.category}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {ticket.priority} Priority
                  </span>
                </div>
              </div>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
