import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  photoUrl?: string;
  categoryId?: number;
  startingTime: string;
}

const EditPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startingTime, setStartingTime] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const postData: Post = await response.json();
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setStartingTime(postData.startingTime);
        if (postData.categoryId) {
          setCategoryId(postData.categoryId);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchAllCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/category/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchPost();
    fetchAllCategories();
  }, [postId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/posts/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, content, categoryId, startingTime }),
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      window.location.href = `/post`;
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      window.location.href = `/post`;
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Edit Post</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="startingTime">Starting Time</label>
          <input
            type="datetime-local"
            className="form-control"
            id="startingTime"
            value={startingTime}
            onChange={(e) => setStartingTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            className="form-control"
            id="category"
            value={categoryId || ''}
            onChange={(e) => {
              const selectedCategoryId = parseInt(e.target.value);
              setCategoryId(selectedCategoryId);
            }}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-danger mt-3" onClick={handleDelete}>
        Delete Post
      </button>
        <button type="submit" className="btn btn-primary mt-3">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
