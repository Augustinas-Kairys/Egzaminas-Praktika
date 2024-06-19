import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  authorId: string;
  photoUrl?: string;
  authorUsername: string;
  isApproved: boolean;
  startingTime: string;
  categories: Category[];
  likesCount: number;
}

interface Category {
  id: number;
  name: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategoryId, setFilteredCategoryId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [postId: number]: boolean }>({});

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        const parsedToken = parseJwt(token);
        if (parsedToken && parsedToken.isAdmin) {
          setIsAdmin(true);
        }
        setUserId(parsedToken.userId);
        fetchLikedPosts(parsedToken.userId); // Fetch liked posts for the current user
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsBlocked(false);
      }
    };

    checkUserStatus();
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchAllCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/posts/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const postsData: Post[] = await response.json();
      const approvedPosts = postsData.filter(post => post.isApproved);
      setPosts(approvedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/category/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLikedPosts = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/likes/posts/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch liked posts');
      }
      const likedPostsData: number[] = await response.json();
      const likedPostsMap: { [postId: number]: boolean } = {};
      likedPostsData.forEach(postId => {
        likedPostsMap[postId] = true;
      });
      setLikedPosts(likedPostsMap);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
    }
  };

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleEditClick = (postId: number) => {
    window.location.href = `/edit-post/${postId}`;
  };

  const handleUnapproveClick = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/posts/${postId}/unapprove`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to unapprove post');
      }
      const updatedPosts = posts.map(post => post.id === postId ? { ...post, isApproved: false } : post);
      setPosts(updatedPosts);
      fetchPosts();
    } catch (error) {
      console.error('Error unapproving post:', error);
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    if (categoryId === "") {
      setFilteredCategoryId(null);
    } else {
      setFilteredCategoryId(parseInt(categoryId, 10));
    }
  };

  const handleDateFilter = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleLikeClick = async (postId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not authenticated');
        return;
      }

      // Check if the post is already liked
      if (likedPosts[postId]) {
        // If already liked, perform unlike action
        handleUnlikeClick(postId);
        return;
      }

      const response = await fetch(`http://localhost:3001/api/likes/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to like post:', data.error);
        return;
      }

      // Update liked posts state
      setLikedPosts({ ...likedPosts, [postId]: true });

      // Update posts state to reflect increased likes count
      const updatedPosts = posts.map(post => post.id === postId ? { ...post, likesCount: post.likesCount + 1 } : post);
      setPosts(updatedPosts);

      console.log('Post liked successfully:', data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnlikeClick = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/likes/posts/${postId}/unlike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ postId, userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to unlike post');
      }
      const updatedPosts = posts.map(post =>
        post.id === postId ? { ...post, likesCount: post.likesCount - 1 } : post
      );
      setPosts(updatedPosts);

      // Update liked posts state
      const { [postId]: removedPostId, ...updatedLikedPosts } = likedPosts;
      setLikedPosts(updatedLikedPosts);
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  const filteredPosts = filteredCategoryId
    ? posts.filter(post => post.categories.some(category => category.id === filteredCategoryId))
    : posts;

  const filteredByDatePosts = startDate && endDate
    ? filteredPosts.filter(post => {
        const postDate = new Date(post.startingTime);
        return postDate >= new Date(startDate) && postDate <= new Date(endDate);
      })
    : filteredPosts;

  if (isBlocked) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="container mt-4">
      <h2>All Posts</h2>
      {isLoggedIn ? (
        <div>
          <div className="mb-4">
            <h4>Filter by Category</h4>
            <select className="form-select" onChange={(e) => handleCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
  
          <div className="mb-4">
            <h4>Filter by Date Range</h4>
            <div className="row">
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => handleDateFilter(e.target.value, endDate)}
                />
              </div>
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => handleDateFilter(startDate, e.target.value)}
                />
              </div>
            </div>
          </div>
  
          {isAdmin && (
            <div className="alert alert-info" role="alert">
              You are logged in as an admin.
            </div>
          )}
          {isBlocked && (
            <div className="alert alert-danger" role="alert">
              Your account is blocked. You cannot view posts.
            </div>
          )}
  
          <div className="row">
            {filteredByDatePosts.map((post) => (
              <div key={post.id} className="col-md-4 mb-4">
                <div className="card">
                  {post.photoUrl && (
                    <img
                      src={`http://localhost:3001/uploads/${post.photoUrl}`}
                      alt="Post Image"
                      className="card-img-top"
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.content}</p>
                    <p>Author Name: {post.authorUsername}</p>
                    <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
                    <p>Starting Time: {new Date(post.startingTime).toLocaleString()}</p>
                    <p>Categories: {post.categories.map(category => category.name).join(', ')}</p>
                    <p>Likes: {post.likesCount}</p>
                    {(userId === post.authorId || isAdmin) && (
                      <div>
                        <button
                          className="btn btn-primary mr-2"
                          onClick={() => handleEditClick(post.id)}
                        >
                          Edit
                        </button>
                        {isAdmin && post.isApproved && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleUnapproveClick(post.id)}
                          >
                            Unapprove
                          </button>
                        )}
                      </div>
                    )}
                    {isLoggedIn && likedPosts[post.id] ? (
                      <button
                        className="btn btn-outline-primary mt-2"
                        onClick={() => handleUnlikeClick(post.id)}
                      >
                        Unlike
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleLikeClick(post.id)}
                      >
                        Like
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="alert alert-warning" role="alert">
          You are not logged in. Please <Link to="/login">login</Link> to view posts.
        </div>
      )}
    </div>
  );
};  

export default Posts;
