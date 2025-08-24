import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow text-center" style={{minWidth:'300px', maxWidth:'400px'}}>
        <h1 className="display-4 text-danger">404</h1>
        <h3>Page Not Found</h3>
        <p>The page you are looking for does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
