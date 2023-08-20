import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    try {
      const response: AxiosResponse<DatabaseProduct[]> = await axios.get(
        "/api/products"
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const buyProduct = createAsyncThunk(
  "product/buyProduct",
  async (
    updatedProducts: { productId: string; newQuantityInStock: number }[]
  ) => {
    try {
      const updateRequests = updatedProducts.map(
        ({ productId, newQuantityInStock }) =>
          axios.put(`/api/product/${productId}/updateQuantity`, {
            newQuantityInStock,
          })
      );

      const updatedResponses = await Promise.all(updateRequests);
      const updatedData = updatedResponses.map(
        (response: AxiosResponse) => response.data
      );
      return updatedData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  "product/editProduct",
  async ({
    productId,
    newUpdateName,
    newUpdatePrice,
    newUpdateQuantityInStock,
  }: {
    productId: string;
    newUpdateName: string;
    newUpdatePrice: number;
    newUpdateQuantityInStock: number;
  }) => {
    try {
      const response: AxiosResponse<DatabaseProduct> = await axios.put(
        `/api/product/${productId}/updateProduct`,
        {
          newName: newUpdateName,
          newPrice: newUpdatePrice,
          newQuantityInStock: newUpdateQuantityInStock,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async ({
    addedName,
    addedPrice,
    addedQuantityInStock,
  }: {
    addedName: string;
    addedPrice: number;
    addedQuantityInStock: number;
  }) => {
    try {
      const response: AxiosResponse<DatabaseProduct> = await axios.post(
        "/api/product/addProduct",
        {
          addedName,
          addedPrice,
          addedQuantityInStock,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId: string) => {
    try {
      const response: AxiosResponse<DatabaseProduct> = await axios.post(
        `/api/product/${productId}/deleteProduct`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export interface Product {
  readonly id: string;
  name: string;
  price: number;
  numOfItems: number;
  totalPrice: number;
  quantityInStock: number;
  outOfStock: boolean;
}

interface DatabaseProduct {
  readonly id: string;
  name: string;
  price: number;
  quantityInStock: number;
}

interface InitialState {
  products: Product[];
  isInShopPage: boolean;
}

const initialState: InitialState = {
  products: [],
  isInShopPage: true,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    added: (state, action: PayloadAction<string>) => {
      const productArray = state.products;

      for (let i = 0; i < productArray.length; i++) {
        if (action.payload === productArray[i].name) {
          if (productArray[i].numOfItems < productArray[i].quantityInStock) {
            productArray[i].numOfItems++;
            productArray[i].totalPrice =
              productArray[i].totalPrice + productArray[i].price;
          } else alert("Reached Maximum Amount In Stock");
        }
      }
    },
    removed: (state, action: PayloadAction<string>) => {
      const productArray = state.products;
      for (let i = 0; i < productArray.length; i++) {
        if (action.payload === productArray[i].name) {
          if (productArray[i].numOfItems > 0) {
            productArray[i].numOfItems--;
            productArray[i].totalPrice =
              productArray[i].totalPrice - productArray[i].price;
          }
        }
      }
    },
    resetCart: (state) => {
      state.products.forEach((product) => {
        product.numOfItems = 0;
        product.totalPrice = 0;
      });
    },
    switchPage: (state) => {
      state.isInShopPage = !state.isInShopPage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<DatabaseProduct[]>) => {
        for (let i = 0; i < action.payload.length; i++) {
          let stateProduct: Product = {
            id: action.payload[i].id,
            name: action.payload[i].name,
            price: action.payload[i].price,
            numOfItems: 0,
            totalPrice: 0,
            quantityInStock: action.payload[i].quantityInStock,
            outOfStock: false,
          };
          if (stateProduct.quantityInStock <= 0) stateProduct.outOfStock = true;
          state.products[i] = stateProduct;
        }
        console.log("Products Fetched");
      }
    );
    builder.addCase(fetchProducts.pending, (state) => {
      console.log("Fetching products...");
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      console.log(action.error.message);
    });
    builder.addCase(buyProduct.fulfilled, (state, action) => {
      console.log("Products Updated:", action.payload);
    });
    builder.addCase(buyProduct.pending, (state) => {
      console.log("Updating Products");
    });
    builder.addCase(buyProduct.rejected, (state, action) => {
      console.log(action.error.message);
    });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      console.log("Product Updated:", action.payload);
    });
    builder.addCase(editProduct.pending, (state) => {
      console.log("Updating Products...");
    });
    builder.addCase(editProduct.rejected, (state, action) => {
      console.log(action.error.message);
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      console.log("Product Added:", action.payload);
    });
    builder.addCase(addProduct.pending, (state) => {
      console.log("Adding Product...");
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      console.log(action.error.message);
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      console.log("Product Deleted:", action.payload);
    });
    builder.addCase(deleteProduct.pending, (state) => {
      console.log("Deleting Product...");
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

const productReducer = productSlice.reducer;
const productActions = productSlice.actions;
export default productReducer;
export { productActions };
