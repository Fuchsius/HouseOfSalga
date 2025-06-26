import { useEffect, useState } from 'react';
import styles from './OrderSummary.module.css';

export default function OrderSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Use static mock data instead of fetch
    setSummary({
      subtotal: 15000,
      tax: 250,
      shipping: 150,
      total: 14000
    });
  }, []);

  if (!summary) return <div className={styles['summary-card']}>Loading...</div>;

  return (
    <div className={styles['summary-card']}>
      <div className={styles['summary-currency']}>Currency</div>
      <div className={styles['summary-title']}>Order Summary</div>
      <div className={styles['summary-row']}>
        <span className={styles['summary-label']}>Subtotal</span>
        <span className={styles['summary-value']}>Rs.{summary.subtotal.toLocaleString()}</span>
      </div>
      <div className={styles['summary-row']}>
        <span className={styles['summary-label']}>Including Tax</span>
        <span className={styles['summary-value']}>{summary.tax}</span>
      </div>
      <div className={styles['summary-row']}>
        <span className={styles['summary-label']}>Shipping</span>
        <span className={styles['summary-value']}>{summary.shipping}</span>
      </div>
      <hr className={styles['summary-divider']} />
      <div className={styles['summary-total']}>
        <span>Total</span>
        <span>Rs.{summary.total.toLocaleString()}</span>
      </div>
    </div>
  );
} 