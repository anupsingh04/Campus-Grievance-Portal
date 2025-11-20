import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tickets`);
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/status`, { status: newStatus });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4">
        {tickets.map(ticket => (
          <Card key={ticket.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{ticket.title}</h3>
                  <Badge status={ticket.status} />
                </div>
                <p className="text-gray-600">{ticket.description}</p>
                <div className="text-sm text-gray-400 mt-1">
                  Category: {ticket.category} | Priority: {ticket.priority}
                </div>
              </div>
              <div className="flex gap-2">
                {ticket.status !== 'Resolved' && (
                  <Button size="sm" onClick={() => updateStatus(ticket.id, 'Resolved')} className="text-sm px-3 py-1">
                    Mark Resolved
                  </Button>
                )}
                {ticket.status !== 'Closed' && (
                  <Button size="sm" variant="secondary" onClick={() => updateStatus(ticket.id, 'Closed')} className="text-sm px-3 py-1">
                    Close
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
