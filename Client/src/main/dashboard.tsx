import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Dashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const parsedToken = parseJwt(token);
      console.log('Parsed Token:', parsedToken);
      if (parsedToken && parsedToken.isAdmin) {
        setIsAdmin(true);
      }
      fetchUserStatus(parsedToken.userId); 
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsBlocked(false);
  };

  const fetchUserStatus = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/user-status/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setIsBlocked(data.isBlocked); 
    } catch (error) {
      console.error('Error fetching user status:', error);
      setIsBlocked(false); 
    }
  };

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {isLoggedIn ? (
        <div>
          <p>You are logged in.</p>
          <Link to="/postcreate" className="creating btn btn-primary"> Create Post</Link>
          <Link to="/post" className="creating btn btn-primary"> See Posts</Link>
          <button className="creating btn btn-primary" onClick={handleLogout}>Logout</button>
          {isAdmin && (
            <div>
              <p>You are an admin.</p>
              <Link to="/Admin" className="creating btn btn-primary"> Admin Panel</Link>
            </div>
          )}
          {isBlocked && (
            <div>
              <p>Your account is blocked.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <Link to="/Login" className="creating btn btn-primary"> Login</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
