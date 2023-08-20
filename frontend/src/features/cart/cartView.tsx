import React from "react";
import { useTypedDispatch, useTypedSelector } from "../../store/hooks";
import "./cartView.css";
import { productActions, buyProduct } from "../product/productSlice";

const CartView = () => {
  const dispatch = useTypedDispatch();
  const product = useTypedSelector((state) => state.product);
  const productArray = product.products;
  const isInShopPage = product.isInShopPage;
  let orderTotal = 0;

  for (let i = 0; i < productArray.length; i++) {
    orderTotal = orderTotal + productArray[i].totalPrice;
  }

  const handleOrder = () => {
    if (orderTotal <= 0) {
      alert("Empty Cart!");
      return;
    }

    dispatch(productActions.resetCart());

    const updatedProducts = productArray
      .filter((product) => product.numOfItems > 0)
      .map((product) => ({
        productId: product.id,
        newQuantityInStock: product.quantityInStock - product.numOfItems,
      }));

    dispatch(buyProduct(updatedProducts));

    alert("Order received");
  };

  return (
    <div id="cart-section" style={{ display: isInShopPage ? "flex" : "none" }}>
      <h1>Cart</h1>
      {productArray.map((product) => {
        return (
          product.numOfItems > 0 && (
            <div className="cart-item">
              {product.name}:{product.numOfItems}-{product.totalPrice}$
            </div>
          )
        );
      })}
      <div className="cart-total">Order Total:{orderTotal}$</div>
      <button className="cart-order-button" onClick={handleOrder}>
        Order
      </button>
    </div>
  );
};

export default CartView;
