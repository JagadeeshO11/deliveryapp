import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if(!email || !password){
      alert('Fill all fields');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      if(res.data.success){
        localStorage.setItem('token', res.data.token);
        navigate('/Dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch(err){
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ minWidth:'350px', maxWidth:'450px', width:'100%' }}>
        <h3 className="mb-3 text-center">Login</h3>
        <input 
          type="email" 
          className="form-control mb-2" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          className="form-control mb-2" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        <button 
          type="button" 
          className="btn btn-primary w-100" 
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="mt-2 text-center">
          No account? 
          <span 
            className="text-primary" 
            style={{ cursor:'pointer' }} 
            onClick={() => navigate('/signup')}
          >
            Signup
          </span>
        </p>
        <p className="text-center">
          <span 
            className="text-danger" 
            style={{ cursor:'pointer' }} 
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
