import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const AdminPanel: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const parsedToken = parseJwt(token);
      if (parsedToken && parsedToken.isAdmin) {
        setIsAdmin(true);
        fetchAllUsers();
        fetchNotApprovedPosts();
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const fetchNotApprovedPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/posts/post/non-approved');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching not approved posts:', error);
    }
  };

  const handleApprovePost = async (postId: number) => {
    try {
      await fetch(`http://localhost:3001/api/posts/posts/${postId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchNotApprovedPosts(); 
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await fetch(`http://localhost:3001/api/users/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchAllUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await fetch(`http://localhost:3001/api/users/users/${userId}/unblock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      fetchAllUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Admin Panel</h1>
            <Link to="/admin2" className="creating btn btn-primary"> Categories</Link>
          </div>
          <div className="row">
            <div className="col">
              <h2>Accounts</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Blocked</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.blocked ? 'Yes' : 'No'}</td>
                      <td>
                        {user.blocked ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUnblockUser(user.id)}
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleBlockUser(user.id)}
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2>Pending Posts</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Author</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post: any) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.title}</td>
                      <td>{post.content}</td>
                      <td>{post.authorUsername}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleApprovePost(post.id)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
