import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../src/axios';

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance()
      .post('/login', { email: credentials.email, password: credentials.password })
      .then((res) => {
        const json = res.data;
        if (json) {
            const token = res.data.token
            localStorage.setItem("token", token)
            navigate('/home');
        } else {
          alert('Invalid credentials');
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        alert('An error occurred while logging in.');
      });
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            value={credentials.email}
            onChange={onChange}
            id="email"
            name="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            value={credentials.password}
            onChange={onChange}
            name="password"
            id="password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
