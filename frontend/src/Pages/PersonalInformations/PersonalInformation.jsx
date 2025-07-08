import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Sidebar from '../../Components/Sidebar/Sidebar'; 
import './PersonalInformation.css';
import { useParams } from 'react-router-dom';

const PersonalInformation = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    country: '',
    company: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    phone: '',
    postalCode: '',
    deliveryInstructions: '',
    defaultShipping: false,
    defaultBilling: false,
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(true); // true = editable

  const { id: routeUserId } = useParams();

  useEffect(() => {
    const userId = routeUserId || localStorage.getItem('userId');
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      alert('Invalid or missing userId. Please log in again.');
      return;
    }
    fetch(`http://localhost:5000/api/personal-info/userid/${userId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setFormData({
            username: data.username || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            country: data.country || '',
            company: data.company || '',
            streetAddress: data.streetAddress || '',
            apartment: data.apartment || '',
            city: data.city || '',
            state: data.state || '',
            phone: data.phone || '',
            postalCode: data.postalCode || '',
            deliveryInstructions: data.deliveryInstructions || '',
            defaultShipping: data.defaultShipping || false,
            defaultBilling: data.defaultBilling || false,
          });
          setIsEditing(false);
        } else {
          alert('No personal info found for this user. Please fill out the form.');
        }
      })
      .catch(err => {
        alert('Failed to fetch personal info.');
        console.error(err);
      });
  }, [routeUserId]);

  const handleInputChange = (e) => {
    if (!isEditing) return; // block input if not editing
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      // Only allow digits
      const digits = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: digits,
      }));
      setErrors(prev => ({ ...prev, phone: '' }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (formData.phone.length !== 10) newErrors.phone = 'Phone number must be exactly 10 digits';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal Code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      alert('Please fill in all required fields.');
      return;
    }
    const userId = routeUserId || localStorage.getItem('userId');
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      alert('Invalid or missing userId. Please log in again.');
      return;
    }
    try {
      const dataToSend = { ...formData, userId };
      const response = await fetch('http://localhost:5000/api/personal-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        const error = await response.json();
        alert('Failed to save form: ' + (error.error || response.statusText));
        return;
      }
      const resData = await response.json();
      alert(resData.message || 'Form saved successfully!');
      setIsEditing(false);
      // Refetch to update UI
      fetch(`http://localhost:5000/api/personal-info/userid/${userId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setFormData({
              username: data.username || '',
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              country: data.country || '',
              company: data.company || '',
              streetAddress: data.streetAddress || '',
              apartment: data.apartment || '',
              city: data.city || '',
              state: data.state || '',
              phone: data.phone || '',
              postalCode: data.postalCode || '',
              deliveryInstructions: data.deliveryInstructions || '',
              defaultShipping: data.defaultShipping || false,
              defaultBilling: data.defaultBilling || false,
            });
          }
        });
    } catch (error) {
      alert('Failed to save form (network error).');
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClear = () => {
    // Clear form and errors regardless of editing state
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      country: '',
      company: '',
      streetAddress: '',
      apartment: '',
      city: '',
      state: '',
      phone: '',
      postalCode: '',
      deliveryInstructions: '',
      defaultShipping: false,
      defaultBilling: false,
    });
    setErrors({});
    setIsEditing(true); // Make editable after clearing
  };

  // Inputs disabled/readOnly when not editing
  const inputProps = isEditing ? {} : { readOnly: true, disabled: true };

  return (
    <>
      <Header />
      <div className="container">
        <div className="content">
          <Sidebar />

          <div className="main-content">
            <div className="form-container">
              <h1 className="form-title1">Personal Information</h1>
              <p className="form-subtitle1">Add Address</p>

              <div className="form-section">
                <div className="form">
                  {/* Form Rows (same as before) */}
                  <div className="form-row">
                    {/* Remove the username field from the form JSX */}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">
                        First Name* {errors.firstName && <span className="error">{errors.firstName}</span>}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`input ${errors.firstName ? 'input-error' : ''}`}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">
                        Last Name* {errors.lastName && <span className="error">{errors.lastName}</span>}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`input ${errors.lastName ? 'input-error' : ''}`}
                        {...inputProps}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">
                        Country / Region* {errors.country && <span className="error">{errors.country}</span>}
                      </label>
                      <input
                        type="text"
                        name="country"
                        placeholder="Country / Region"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`input ${errors.country ? 'input-error' : ''}`}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Company (optional)"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="input"
                        {...inputProps}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">
                        Street Address* {errors.streetAddress && <span className="error">{errors.streetAddress}</span>}
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        placeholder="House number and street name"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className={`input ${errors.streetAddress ? 'input-error' : ''}`}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Apt, suite, unit</label>
                      <input
                        type="text"
                        name="apartment"
                        placeholder="apartment, suite, unit, etc. (optional)"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className="input"
                        {...inputProps}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">
                        City* {errors.city && <span className="error">{errors.city}</span>}
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Town / City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`input ${errors.city ? 'input-error' : ''}`}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">
                        State* {errors.state && <span className="error">{errors.state}</span>}
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`input ${errors.state ? 'input-error' : ''}`}
                        {...inputProps}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">
                        Phone* {errors.phone && <span className="error">{errors.phone}</span>}
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        {...inputProps}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">
                        Postal Code* {errors.postalCode && <span className="error">{errors.postalCode}</span>}
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`input ${errors.postalCode ? 'input-error' : ''}`}
                        {...inputProps}
                      />
                    </div>
                  </div>

                  <div className="form-group-full">
                    <label className="label">Delivery Instructions</label>
                    <textarea
                      name="deliveryInstructions"
                      placeholder="Delivery Instructions"
                      value={formData.deliveryInstructions}
                      onChange={handleInputChange}
                      className="textarea"
                      rows="4"
                      {...inputProps}
                    />
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="defaultShipping"
                        checked={formData.defaultShipping}
                        onChange={handleInputChange}
                        className="checkbox"
                        disabled={!isEditing}
                      />
                      <span className="checkbox-text">Set as default shipping address</span>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="defaultBilling"
                        checked={formData.defaultBilling}
                        onChange={handleInputChange}
                        className="checkbox"
                        disabled={!isEditing}
                      />
                      <span className="checkbox-text">Set as default billing address</span>
                    </label>
                  </div>

                  <div className="button-group">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleClear}
                          className="edit-button"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          className="save-button"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleEdit}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={handleClear}
                          className="edit-button"
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PersonalInformation;
