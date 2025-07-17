const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const ShopProduct = require("../models/shopProduct");

router.get("/:userId", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.product"
    );

    if (!cart) {
      cart = new Cart({
        userId: req.params.userId,
        items: [],
        subtotal: 0,
        tax: 250,
        deliveryFee: 150,
        total: 400,
      });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity, size, color } = req.body;

    if (!userId || !productId || quantity == null || !size || !color) {
      return res.status(400).json({
        message:
          "Missing required fields: userId, productId, quantity, size, color",
      });
    }

    const product = await ShopProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      product.size &&
      product.size.length > 0 &&
      !product.size.includes(size)
    ) {
      return res
        .status(400)
        .json({ message: `Size '${size}' not available for this product` });
    }

    if (
      product.color &&
      product.color.length > 0 &&
      !product.color.includes(color)
    ) {
      return res
        .status(400)
        .json({ message: `Color '${color}' not available for this product` });
    }

    if (typeof product.stock === "number" && product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        tax: 250,
        deliveryFee: 150,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (typeof product.stock === "number" && product.stock < newQuantity) {
        return res
          .status(400)
          .json({ message: "Insufficient stock for requested quantity" });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        priceAtTime: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update quantity
router.put("/update-quantity", async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    if (!userId || !itemId || quantity == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const product = await ShopProduct.findById(item.product);
    if (typeof product.stock === "number" && product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE remove item
router.delete("/remove/:userId/:itemId", async (req, res) => {
  const { userId, itemId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cart.items.pull(itemId);
    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST apply discount
router.post("/apply-discount", async (req, res) => {
  try {
    const { userId, discountCode } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let discountAmount = 0;
    if (discountCode === "SAVE10") discountAmount = 100;

    cart.discountCode = discountCode;
    cart.discountAmount = discountAmount;
    cart.total = cart.subtotal + cart.tax + cart.deliveryFee - discountAmount;

    await cart.save();

    res.json({
      message: discountAmount > 0 ? "Discount applied" : "Invalid discount",
      ...cart.toObject(),
    });
  } catch (error) {
    console.error("Apply discount error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
