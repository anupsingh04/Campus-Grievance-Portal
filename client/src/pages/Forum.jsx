import React from 'react';
import Card from '../components/ui/Card';

const Forum = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Public Forum</h1>
      <Card>
        <p className="text-gray-500 text-center py-8">
          Community Q&A features coming soon!
          <br />
          This section will allow students to ask public questions and get answers from peers or staff.
        </p>
      </Card>
    </div>
  );
};

export default Forum;
