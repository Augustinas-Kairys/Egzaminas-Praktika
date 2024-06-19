import React, { useEffect, useState } from 'react';

// Define User and Post interfaces
interface User {
  id: string;
  username: string;
  email: string;
  admin: boolean;
  blocked: boolean;
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  authorId: string;
  authorUsername: string;
  photoUrl?: string; // Optional if you have photoUrl
}

// Helper function to parse JWT
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const parsedToken = parseJwt(token);
      if (parsedToken) {
        fetchUserProfile(parsedToken.userId);
        fetchUserPosts(parsedToken.userId);
      }
    }
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Error fetching user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/api/users/${userId}/posts`);
      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      } else {
        console.error('Error fetching user posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">User not found</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title">Profile</h1>
          <p className="card-text"><strong>Username:</strong> {user.username}</p>
          <p className="card-text"><strong>Email:</strong> {user.email}</p>
          <p className="card-text"><strong>Admin:</strong> {user.admin ? 'Yes' : 'No'}</p>
          <p className="card-text"><strong>Blocked:</strong> {user.blocked ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4 mb-4" key={post.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-text">{post.content}</p>
                </div>
                <div className="card-footer text-muted">
                  <small>Posted on: {new Date(post.createdAt).toLocaleDateString()}</small>
                </div>
                {post.photoUrl && <img src={`http://localhost:3001/uploads/${post.photoUrl}`} alt="Post image" className="card-img-bottom" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;