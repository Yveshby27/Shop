import React from "react";
import ProductView from "./features/product/productView";
import CartView from "./features/cart/cartView";
import InventoryView from "./features/inventory/inventoryView";

function App() {
  return (
    <div className="App">
      <ProductView></ProductView>
      <CartView></CartView>
      <InventoryView></InventoryView>
    </div>
  );
}

export default App;
