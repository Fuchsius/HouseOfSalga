import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:5000/api";

export const useCart = (userId = "user123") => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch Cart");
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart/update-quantity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quantity");
      }

      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      console.log(`${API_URL}/cart/remove/${userId}/${itemId}`);
      const response = await fetch(
        `${API_URL}/cart/remove/${userId}/${itemId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to remove item");
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyDiscount = async (discountCode) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart/apply-discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, discountCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCart(data);
      return {
        success: true,
        message: data.message || "Discount applied successfully!",
      };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    updateQuantity,
    removeItem,
    applyDiscount,
    refetch: fetchCart,
  };
};
