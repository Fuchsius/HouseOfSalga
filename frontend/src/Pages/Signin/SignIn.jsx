import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- import useNavigate
import Footer from '../../Components/Footer/Footer'
import Header from '../../Components/Header/Header'
import axios from 'axios';

import eyeIcon from '../../Assets/eye.png';
import gmailIcon from '../../Assets/gmail.png';
import googleIcon from '../../Assets/google.png';
import signupImage from '../../Assets/signupImage.png';
import './SignIn.css';


function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
 
    
    
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const validate = () => {
    const tempErrors = {};

    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Invalid email format';
      }
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        tempErrors.password =
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', formData);
      localStorage.setItem('token', res.data.token);

      setMessageType('success');
      setMessage('Signed in successfully! Redirecting...');
      setTimeout(() => {
        setMessage(null);
        navigate('/home'); // ✅ redirect to /home instead of /
      }, 1000);
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Login failed');
      setTimeout(() => setMessage(null), 1000);
    }
  };

  return (
    <div>
      <Header />

      <div className="signup-wrapper">
        <div className="signup-left">
          <form onSubmit={handleSubmit} className="signup-form">
            <h1 className="form-title">Sign In</h1>
            <p className="form-subtitle"><strong>Where Style Meets Confidence.</strong></p>

            {message && (
              <div className={`alert-${messageType}`} style={{ marginBottom: '15px' }}>
                {message}
              </div>
            )}

            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              autoComplete="email"
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            <label className="form-label">Your Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                autoComplete="new-password"
              />
              <img
                src={eyeIcon}
                alt="toggle visibility"
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && <p className="error-msg">{errors.password}</p>}

            <button type="submit" className="submit-btn">Sign In</button>

            <p className="continue-text">or continue with</p>

            <div className="social-icons">
              <img src={gmailIcon} alt="Gmail" />
              <img src={googleIcon} alt="Google" />
            </div>

            <p className="signup-text">
              <span className="no-account">Already have an account? </span>
              <span className="signup-link" onClick={() => navigate('/signup')}>Sign Up</span>
            </p>
          </form>
        </div>

        <div className="signup-right">
          <div className="half-bg"></div>
          <img src={signupImage} alt="Illustration" className="doni-img" />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SignIn;