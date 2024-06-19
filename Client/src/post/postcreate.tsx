import React, { useState, useEffect } from 'react';

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid token');
    return null;
  }
};

interface Category {
  id: number;
  name: string;
}

const PostCreate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // Ensure this state tracks the selected category
  const [categories, setCategories] = useState<Category[]>([]);
  const [startingTime, setStartingTime] = useState<string>(''); // State for starting time

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const parsedToken = parseJwt(token);
      if (parsedToken) {
        setAuthorId(parsedToken.userId);
      }
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/category/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categoriesData = await response.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (photo) {
      formData.append('photo', photo);
    }
    if (authorId !== null) {
      formData.append('authorId', String(authorId));
    }
    if (selectedCategoryId !== null) {
      formData.append('categoryId', String(selectedCategoryId)); // Ensure only selectedCategoryId is appended
    }
    if (startingTime) {
      formData.append('startingTime', startingTime); // Append starting time to form data
    }

    try {
      const response = await fetch('http://localhost:3001/api/posts/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error('Failed to create post');
      }
      
      window.location.href = '/post';
      const newPost = await response.json();
      console.log('New post created:', newPost);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(parseInt(e.target.value, 10)); // Update selectedCategoryId when category selection changes
  };

  const handleStartingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartingTime(e.target.value); // Update startingTime state when date-time input changes
  };

  return (
    <div className="container mt-4">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title:</label>
          <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content:</label>
          <textarea className="form-control" id="content" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Photo:</label>
          <input type="file" className="form-control" id="photo" onChange={handleFileChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="startingTime" className="form-label">Starting Time:</label>
          <input type="datetime-local" className="form-control" id="startingTime" value={startingTime} onChange={handleStartingTimeChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category:</label>
          <select className="form-select" id="category" onChange={handleCategoryChange} value={selectedCategoryId || ''}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Post</button>
      </form>
    </div>
  );
};

export default PostCreate;
