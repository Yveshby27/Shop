import { useState } from "react";
import React from "react";
import { useTypedDispatch, useTypedSelector } from "../../store/hooks";
import { Product } from "../product/productSlice";
import {
  productActions,
  editProduct,
  addProduct,
  deleteProduct,
  fetchProducts,
} from "../product/productSlice";
import "./inventoryView.css";

const InventoryView = () => {
  const dispatch = useTypedDispatch();
  const product = useTypedSelector((state) => state.product);
  const productArray = product.products;
  const isInShopPage = product.isInShopPage;
  const [isEditing, setisEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newUpdateName, setNewUpdateName] = useState("");
  const [newUpdatePrice, setNewUpdatePrice] = useState(0);
  const [newUpdateQuantityInStock, setNewUpdateQuantityInStock] = useState(0);
  const [addedName, setAddedName] = useState("");
  const [addedPrice, setAddedPrice] = useState(0);
  const [addedQuantityInStock, setAddedQuantityInStock] = useState(0);
  const handleEdit = (product: Product) => {
    setisEditing(true);
    setEditingProduct(product);
    setNewUpdateName(product.name);
    setNewUpdatePrice(product.price);
    setNewUpdateQuantityInStock(product.quantityInStock);
  };
  const handleUpdateNameChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNewUpdateName(e.target.value);
  };
  const handleUpdatePriceChange = (e: { target: { value: string } }) => {
    setNewUpdatePrice(parseFloat(e.target.value));
  };
  const handleUpdateQuantityInStockChange = (e: {
    target: { value: string };
  }) => {
    setNewUpdateQuantityInStock(parseInt(e.target.value));
  };

  const handleAddNameChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAddedName(e.target.value);
  };
  const handleAddPriceChange = (e: { target: { value: string } }) => {
    setAddedPrice(parseFloat(e.target.value));
  };
  const handleAddQuantityInStock = (e: { target: { value: string } }) => {
    setAddedQuantityInStock(parseInt(e.target.value));
  };
  const handleSubmitUpdate = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const productId = editingProduct.id;

        dispatch(
          editProduct({
            productId,
            newUpdateName,
            newUpdatePrice,
            newUpdateQuantityInStock,
          })
        );
        setisEditing(false);
        setEditingProduct(null);
        setNewUpdateName("");
        setNewUpdatePrice(0);
        setNewUpdateQuantityInStock(0);
        dispatch(fetchProducts());
        // or window.location.reload()
      } else {
        console.log("No product selected for editing.");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleSubmitAdd = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      dispatch(addProduct({ addedName, addedPrice, addedQuantityInStock }));

      setAddedName("");
      setAddedPrice(0);
      setAddedQuantityInStock(0);
      setIsAdding(false);
      dispatch(fetchProducts());
      //or window.location.reload()
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleDelete = (product: Product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        dispatch(deleteProduct(product.id));
        window.location.reload();
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };
  return (
    <div
      id="inventory-section"
      style={{ display: isInShopPage ? "none" : "block" }}
    >
      <h1>Inventory</h1>
      <button
        className="shop-button"
        onClick={() => dispatch(productActions.switchPage())}
      >
        Go To Shop
      </button>
      <button className="add-button" onClick={() => setIsAdding(true)}>
        Add Product
      </button>
      <form
        onSubmit={handleSubmitAdd}
        id="add-form"
        style={{ display: isAdding ? "flex" : "none" }}
      >
        <div>
          <label htmlFor="product-name">Product Name:</label>
          <input
            type="text"
            onChange={handleAddNameChange}
            value={addedName}
            required
          ></input>
        </div>
        <div>
          <label>Product Price:</label>
          <input
            type="number"
            min={0}
            step={0.1}
            onChange={handleAddPriceChange}
            value={addedPrice}
            required
          ></input>
        </div>
        <div>
          <label>Quantity In Stock:</label>
          <input
            type="number"
            id="quantity-in-stock"
            onChange={handleAddQuantityInStock}
            value={addedQuantityInStock}
            min={0}
            max={50}
            required
          ></input>
        </div>
        <div>
          <button
            className="reset-button"
            type="reset"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
      <div className="product-list">
        {productArray.map((product) => {
          return (
            <div key={product.id} className="list-item">
              <p>Product Name:{product.name}</p>
              <p>Product Price:{product.price}$</p>
              <p>Quantity In Stock:{product.quantityInStock}</p>
              <button
                className="edit-button"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(product)}
              >
                Delete
              </button>
              <form
                className="edit-form"
                onSubmit={handleSubmitUpdate}
                style={{
                  display:
                    isEditing && editingProduct === product ? "flex" : "none",
                }}
              >
                <div>
                  <label htmlFor="product-name">Product Name:</label>
                  <input
                    type="text"
                    value={newUpdateName}
                    onChange={handleUpdateNameChange}
                    required
                  ></input>
                </div>
                <div>
                  <label htmlFor="product-price">Product Price:</label>
                  <input
                    type="number"
                    id="product-price"
                    value={newUpdatePrice}
                    step={0.1}
                    onChange={handleUpdatePriceChange}
                    min={0}
                    required
                  ></input>
                </div>
                <div>
                  <label htmlFor="quantity-in-stock">Quantity In Stock:</label>
                  <input
                    type="number"
                    id="quantity-in-stock"
                    value={newUpdateQuantityInStock}
                    onChange={handleUpdateQuantityInStockChange}
                    min={0}
                    max={50}
                    required
                  ></input>
                </div>
                <div className="button-container">
                  <button
                    className="reset-button"
                    type="reset"
                    onClick={() => setisEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryView;
