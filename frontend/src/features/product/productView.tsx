import { useEffect, useState } from "react";
import React from "react";
import { useTypedDispatch, useTypedSelector } from "../../store/hooks";
import { productActions } from "./productSlice";
import "./productView.css";
import { fetchProducts } from "./productSlice";

const ProductView = () => {
  const dispatch = useTypedDispatch();
  const product = useTypedSelector((state) => state.product);
  const productArray = product.products;
  const isInShopPage = product.isInShopPage;
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <div style={{ display: isInShopPage ? "flex" : "none" }}>
      <div id="product-section">
        {productArray.map((product) => {
          return (
            <div className="product-item">
              <h2>
                {product.name}-{product.price}$
                {product.outOfStock && <p>OUT OF STOCK</p>}
              </h2>
              <div>
                <button
                  disabled={product.outOfStock}
                  className="product-operator-button"
                  onClick={() => {
                    dispatch(productActions.removed(product.name));
                  }}
                >
                  -
                </button>
                <button
                  disabled={product.outOfStock}
                  className="product-operator-button"
                  onClick={() => dispatch(productActions.added(product.name))}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="inventory-button"
        onClick={() => dispatch(productActions.switchPage())}
      >
        Go To Inventory
      </button>
    </div>
  );
};
export default ProductView;
