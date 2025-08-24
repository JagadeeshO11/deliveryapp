import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert } from 'react-bootstrap';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: enter email, 2: verify OTP, 3: fill details
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [details, setDetails] = useState({
    name: '',
    phone: '+91',
    vehicle: '',
    city: '',
    password: ''
  });
  const [msg, setMsg] = useState('');

  // Step 1: send OTP
  const sendOtp = async () => {
    if (!email) { alert('Enter email'); return; }
    try {
      const res = await axios.post('http://localhost:5000/api/send-otp', { email });
      if (res.data.success) {
        setStep(2);
      }
      setMsg(res.data.msg);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || 'Failed to send OTP');
    }
  };

  // Step 2: verify OTP
  const verifyOtp = async () => {
    if (!otp) { alert('Enter OTP'); return; }
    try {
      const res = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
      if (res.data.success) {
        setStep(3);
      }
      setMsg(res.data.msg);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || 'OTP verification failed');
    }
  };

  // Step 3: fill profile and signup
  const submitDetails = async () => {
    const { name, phone, vehicle, city, password } = details;
    if ( !email || !name || !phone || !vehicle || !city || !password) {
      alert('Fill all fields');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/signup', { 
        email,   // use global email state (verified one)
        name, 
        phone, 
        vehicle, 
        city, 
        password 
      });
      if (res.data.success) {
        alert('Signup successful. Please login.');
        navigate('/login');
      } else {
        setMsg(res.data.msg);
      }
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ minWidth:'350px', maxWidth:'450px', width:'100%' }}>
        <h3 className="mb-3 text-center">Signup</h3>
        {msg && <Alert variant="info">{msg}</Alert>}

        {step === 1 && (
          <>
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Enter Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={sendOtp}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={verifyOtp}>Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            {/* Email will only be shown, not editable */}
            <input
              type="email"
              className="form-control mb-2"
              value={email}
              disabled
            />

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Name"
              value={details.name}
              onChange={e => setDetails({...details, name: e.target.value})}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Phone (+91...)"
              value={details.phone}
              onChange={e => setDetails({...details, phone: e.target.value})}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Vehicle"
              value={details.vehicle}
              onChange={e => setDetails({...details, vehicle: e.target.value})}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="City"
              value={details.city}
              onChange={e => setDetails({...details, city: e.target.value})}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={details.password}
              onChange={e => setDetails({...details, password: e.target.value})}
            />
            <button className="btn btn-success w-100" onClick={submitDetails}>Submit Details</button>
          </>
        )}

        <p className="mt-2 text-center">
          Already have an account?{" "}
          <span
            className="text-primary"
            style={{ cursor:'pointer' }}
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
