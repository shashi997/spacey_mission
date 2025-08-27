import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please check Firestore rules and collection name.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 font-bold border-b-2 pb-2 mb-2 text-gray-600">
          <div>Name</div>
          <div>Email</div>
          <div>Created At</div>
        </div>

        {/* User List */}
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="grid grid-cols-3 gap-4 border-b p-2 items-center hover:bg-gray-50">
              <div>{user.name || 'N/A'}</div>
              <div>{user.email || 'No email'}</div>
              <div>{user.createdAt ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}</div>
            </div>
          ))
        ) : <p className="text-center p-4">No users found.</p>}
      </div>
    </div>
  );
};

export default Users;