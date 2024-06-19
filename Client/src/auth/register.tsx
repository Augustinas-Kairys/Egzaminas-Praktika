import React, { useState } from 'react';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Reset error message on change
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation logic
    let formIsValid = true;

    if (!formData.username) {
      setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is required' }));
      formIsValid = false;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter a valid email' }));
      formIsValid = false;
    }

    if (!formData.password || formData.password.length < 8) {
      setErrors((prevErrors) => ({ ...prevErrors, password: 'Password must be at least 8 characters long' }));
      formIsValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
      formIsValid = false;
    }

    if (formIsValid) {
      // Form is valid, submit data
      try {
        const response = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Registration successful:', data);
          window.location.href = '/login';
          // Reset form or perform additional actions
        } else {
          const error = await response.json();
          console.error('Registration error:', error);
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: '#eee' }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: '25px' }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                    <form onSubmit={handleSubmit} className="mx-1 mx-md-4">
                      <div className="mb-4">
                        <label htmlFor="username" className="form-label">Your Name</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="form-control" />
                        {errors.username && <div className="text-danger">{errors.username}</div>}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="email" className="form-label">Your Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-control" />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control" />
                        {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" className="btn btn-primary btn-lg">Register</button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" className="img-fluid" alt="Sample image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
