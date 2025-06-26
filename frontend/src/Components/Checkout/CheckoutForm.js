import { useState } from 'react';
import styles from './CheckoutForm.module.css';
import CardIcons from './CardIcons';

export default function CheckoutForm() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', country: '', company: '', address: '',
    apt: '', city: '', state: '', postal: '', phone: '',
    saveInfo: false,
    shippingAddress: 'same',
    payment: 'card',
    cardNumber: '', cardName: '', cardExpiry: '', cardCvc: ''
  });
  const [message, setMessage] = useState('');
  const [showDelivery, setShowDelivery] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleContinue = e => {
    e.preventDefault();
    setShowDelivery(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('Order placed successfully!');
  };

  return (
    <form className={styles['form-root']} onSubmit={showDelivery ? handleSubmit : handleContinue}>
      {/* Billing Details */}
      <div>
        <div className={styles['checkout-title']}>Billing Details</div>
        <div className={styles['form-grid']}>
          <div className={styles['form-row']}>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="country">Country / Region</label>
            <input id="country" name="country" placeholder="Country / Region" value={form.country} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="company">Company Name <span style={{color:'#bbb'}}>(optional)</span></label>
            <input id="company" name="company" placeholder="Company (optional)" value={form.company} onChange={handleChange} />
          </div>
          <div className={styles['form-row']} style={{gridColumn:'1/3'}}>
            <label htmlFor="address">Street Address</label>
            <input id="address" name="address" placeholder="House number and street name" value={form.address} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="apt">Apt, suite, unit</label>
            <input id="apt" name="apt" placeholder="apartment, suite, unit, etc. (optional)" value={form.apt} onChange={handleChange} />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="city">City</label>
            <input id="city" name="city" placeholder="Town / City" value={form.city} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="state">State</label>
            <select id="state" name="state" value={form.state} onChange={handleChange} required>
              <option value="">State</option>
              <option value="State1">State1</option>
              <option value="State2">State2</option>
            </select>
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="postal">Postal Code</label>
            <input id="postal" name="postal" placeholder="Postal Code" value={form.postal} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          </div>
        </div>
        {!showDelivery && (
          <button type="submit" className={styles['continue-btn']}>Continue to delivery</button>
        )}
        <div className={styles['save-info']}>
          <input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={handleChange} />
          Save my information for a faster checkout
        </div>
      </div>

      {/* Only show the rest after Continue to delivery */}
      {showDelivery && <>
        {/* Shipping Address Card */}
        <div className={styles['checkout-title']}>Shipping Address</div>
        <div className={styles['section-subtext']}>
          Select the address that matches your card or payment method.
        </div>
        <div className={styles['card-section']}>
          <div className={styles['shipping-address-options']}>
            <label>
              <input type="radio" name="shippingAddress" value="same" checked={form.shippingAddress === 'same'} onChange={handleChange} />
              Same as Billing address
            </label><hr style={{ color: 'black', borderTop: '2px solid #222', margin: '16px 0' }} />
            <label>
              <input type="radio" name="shippingAddress" value="different" checked={form.shippingAddress === 'different'} onChange={handleChange} />
              Use a different shipping address
            </label>
          </div>
        </div>
        <hr style={{ color: 'white', borderTop: '2px solid #222', margin: '16px 0' }} />
        {/* Shipping Method Card */}
        <div className={styles['checkout-title']}>Shipping Method</div>
        <div className={styles['card-section']}>
          <div className={styles['shipping-method-box']}>
            <div className={styles['shipping-method-row']}>
              <span className={styles['shipping-method-label']}>Arrives by Monday, February 7</span>
            </div><hr style={{ color: '#888', borderTop: '2px solid #222', margin: '16px 0' }} />
            <div className={styles['shipping-method-note']}>Additional fees may apply</div>
            <span className={styles['shipping-method-fee']}>$5.00</span>
          </div>
        </div>
        <hr style={{ color: 'black', borderTop: '2px solid #222', margin: '16px 0' }} />
        {/* Payment Method Card */}
        <div className={styles['checkout-title']}>Payment Method</div>
        <div className={styles['secure-note']}>
          All transactions are secure and encrypted.
        </div>
        <div className={styles['card-section']}>
          <div className={styles['payment-methods']}>
            <label className={styles['payment-label']}>
              <input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={handleChange} />
              Credit Card
              <CardIcons />
            </label>
            {form.payment === 'card' && (
              <div>
                <div className={styles['card-fields-row']}>
                  <div className={styles['card-field']}>
                    <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="Card number" required />
                  </div>
                  <div className={styles['card-field']}>
                    <input name="cardName" value={form.cardName} onChange={handleChange} placeholder="Name of card" required />
                  </div>
                </div>
                <div className={styles['card-fields-row']}>
                  <div className={styles['card-field']}>
                    <input name="cardExpiry" value={form.cardExpiry} onChange={handleChange} placeholder="Expiration date (MM/YY)" required />
                  </div>
                  <div className={styles['card-field']}>
                    <input name="cardCvc" value={form.cardCvc} onChange={handleChange} placeholder="Security Code" required />
                  </div>
                </div>
              </div>
            )} <hr style={{ color: 'black', borderTop: '2px solid #222', margin: '16px 0' }} />
            <label className={styles['payment-label']}>
              <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={handleChange} />
              Cash on delivery
            <div className={styles['shipping-method-note']}>Pay on cash Upon the delivery</div>
            </label> <hr style={{ color: 'black', borderTop: '2px solid #222', margin: '16px 0' }} />
            <label className={styles['payment-label']}>
              <input type="radio" name="payment" value="paypal" checked={form.payment === 'paypal'} onChange={handleChange} />
              Paypal
            </label>
          </div>
          <button className={styles['pay-btn']} type="submit">Pay Now</button>
          {message && <div className={styles['success-msg']}>{message}</div>}
        </div>
      </>}
    </form>
  );
} 