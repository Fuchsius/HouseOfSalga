import React, { useState } from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Sidebar from '../../Components/Sidebar/Sidebar'; 
import './PersonalInformation.css';
import { User, ShoppingBag, Heart, Bell, LogOut } from 'lucide-react'; 

const PersonalInformation = () => {
  const [formData, setFormData] = useState({
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
    defaultBilling: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleViewCart = () => {
    alert('Save clicked');
  };

  const handleCheckout = () => {
    alert('Edit clicked');
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="content">
          {/* Sidebar + Welcome section */}
          <Sidebar /> 

          <div className="main-content">
            {/* Form title above the form section */}
            <div className="form-container">
              <h1 className="form-title1">Personal Information</h1>
              <p className="form-subtitle1">Add Address</p>

              <div className="form-section">
                <div className="form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">First Name*</label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Last Name*</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Country / Region*</label>
                      <input
                        type="text"
                        name="country"
                        placeholder="Country / Region"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="input"
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
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Street Address*</label>
                      <input
                        type="text"
                        name="streetAddress"
                        placeholder="House number and street name"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className="input"
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
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">City*</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Town / City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">State*</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Phone*</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Postal Code*</label>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="input"
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
                      />
                      <span className="checkbox-text">Set as default billing address</span>
                    </label>
                  </div>
                  <div className="button-group">
                    
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleViewCart}
                      className="save-button"
                    >
                     Save
                    </button>
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
