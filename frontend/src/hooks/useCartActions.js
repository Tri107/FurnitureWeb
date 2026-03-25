import {
  addToCart,
  updateCartItem,
  updateCartItemColor,
  removeCartItem,
  clearCart,
} from "../lib/cartApi";

import toast from "react-hot-toast";

export const useCartActions = (refetch) => {
  const handleAddToCart = async (
    productId,
    price = 0,
    material = null,
    color = null,
  ) => {
    try {
      await addToCart(productId, 1, price, material, color);
      toast.success("Added to cart");
      refetch();
    } catch (err) {
      console.log(err);
      toast.error("Add to cart failed");
    }
  };

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      await updateCartItem(cartItemId, quantity);
      refetch();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleUpdateColor = async (cartItemId, color) => {
    try {
      await updateCartItemColor(cartItemId, color);
      refetch();
      toast.success("Color updated in cart");
    } catch (err) {
      console.log(err);
      toast.error("Update color failed");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId);
      toast.success("Removed");
      refetch();
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
      refetch();
    } catch (err) {
      toast.error("Clear failed");
    }
  };

  return {
    handleAddToCart,
    handleUpdateQuantity,
    handleUpdateColor,
    handleRemove,
    handleClearCart,
  };
};
