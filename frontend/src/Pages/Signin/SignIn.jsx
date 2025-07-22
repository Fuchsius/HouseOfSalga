import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import axios from 'axios';

import eyeIcon from '../../Assets/eye.png';
import signupImage from '../../Assets/signupImage.png';
import './SignIn.css';

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: '27042630769-ho5qnivtl7dpvhi3sponoakicvfnhp70.apps.googleusercontent.com',
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: false
          });
          
          // Render the Google Sign-In button
          window.google.accounts.id.renderButton(
            document.getElementById('googleSignInDiv'),
            { theme: 'outline', size: 'large', width: '100%' }
          );
        }
      };
      
      document.body.appendChild(script);
      return script;
    };

    const script = loadGoogleScript();
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

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
      localStorage.setItem('username', res.data.user.username);
      localStorage.setItem('userId', res.data.user._id);

      setMessageType('success');
      setMessage('Signed in successfully! Redirecting...');
      setTimeout(() => {
        setMessage(null);
        navigate('/home');
      }, 1000);
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Login failed');
      setTimeout(() => setMessage(null), 1000);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            // Handle cases where the prompt couldn't be displayed
            setMessageType('error');
            setMessage('Please disable your pop-up blocker and try again.');
          } else if (notification.isSkippedMoment()) {
            // User hasn't clicked the Google Sign-In button
            window.google.accounts.id.renderButton(
              document.getElementById('googleSignInDiv'),
              { theme: 'outline', size: 'large', width: '100%' }
            );
          }
          setTimeout(() => setMessage(null), 3000);
        });
      } catch (error) {
        setMessageType('error');
        setMessage('An error occurred. Please try again.');
        setTimeout(() => setMessage(null), 3000);
      }
    } else {
      setMessageType('error');
      setMessage('Google Sign-In is not available. Please try again later.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: response.credential,
      });

      if (res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('userEmail', res.data.user.email);

        setMessageType('success');
        setMessage('Signed in with Google! Redirecting...');
        setTimeout(() => {
          setMessage(null);
          navigate('/home');
        }, 1500);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setMessageType('error');
      setMessage(
        err.response?.data?.message || 
        'Google sign-in failed. Please try again.'
      );
      setTimeout(() => setMessage(null), 3000);
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

            {/* Forgot Password link */}
            <div style={{ textAlign: 'right', marginBottom: '10px', marginTop: '-21px' }}>
              <span
                className="forgot-password-link"
                style={{
                  color: '#007BFF',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                }}
                onClick={() => navigate('/forgot-password')}
                onMouseEnter={(e) => (e.target.style.color = '#0056b3')}
                onMouseLeave={(e) => (e.target.style.color = '#007BFF')}
              >
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="submit-btn">Sign In</button>

            <p className="continue-text">or continue with</p>

            <div className="social-icons">
              <div id="googleSignInDiv"></div>
            </div>

            <p className="signup-text">
              <span className="no-account">Don't have an account? </span>
              <span className="signup-link" onClick={() => navigate('/signup')}>
                Sign Up
              </span>
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
