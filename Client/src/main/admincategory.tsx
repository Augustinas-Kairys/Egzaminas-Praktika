import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminCategory: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const parsedToken = parseJwt(token);
      if (parsedToken && parsedToken.isAdmin) {
        setIsAdmin(true);
        fetchAllCategories();
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchAllCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/category/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      await fetch('http://localhost:3001/api/category/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      fetchAllCategories(); // Refresh categories after creation
      setNewCategoryName('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleUpdateCategory = async (categoryId: number, newName: string) => {
    try {
      await fetch(`http://localhost:3001/api/category/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newName }),
      });
      fetchAllCategories(); // Refresh categories after update
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await fetch(`http://localhost:3001/api/category/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchAllCategories(); // Refresh categories after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
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
            <h1 className="h2">Category Management</h1>
          </div>
          <div className="row">
            <div className="col">
              <h2>Categories</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category: any) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm mr-2"
                          onClick={() => {
                            const newName = prompt('Enter new category name:', category.name);
                            if (newName !== null) {
                              handleUpdateCategory(category.id, newName);
                            }
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <form onSubmit={handleCreateCategory}>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm">Create Category</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCategory;
