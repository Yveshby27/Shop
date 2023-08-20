const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/api/products", async (request, response) => {
  try {
    const products = await prisma.product.findMany();
    response.json(products);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.put("/api/product/:id/updateQuantity", async (request, response) => {
  const productId = request.params.id;
  const { newQuantityInStock } = request.body;
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!existingProduct) {
      return response.status(404).json({ message: "Product Not Found" });
    }
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        quantityInStock: newQuantityInStock,
      },
    });
    response.status(200).json(updatedProduct);
  } catch (error) {
    response.status(500).json({ message: "Error Updating the Product" });
  }
});

app.put("/api/product/:id/updateProduct", async (request, response) => {
  const productId = request.params.id;
  const { newName, newPrice, newQuantityInStock } = request.body;
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!existingProduct) {
      return response.status(404).json({ message: "Product Not Found" });
    }
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: newName,
        price: newPrice,
        quantityInStock: newQuantityInStock,
      },
    });
    response.status(200).json(updatedProduct);
  } catch (error) {
    response.status(500).json({ message: "Error Updating the Product" });
  }
});

app.post("/api/product/addProduct", async (request, response) => {
  const { addedName, addedPrice, addedQuantityInStock } = request.body;
  try {
    await prisma.product.create({
      data: {
        name: addedName,
        price: addedPrice,
        quantityInStock: addedQuantityInStock,
      },
    });
    response.status(200).json({ message: "Product Added" });
  } catch (error) {
    response.status(500).json({ message: "Error Adding Product" });
  }
});

app.post("/api/product/:id/deleteProduct", async (request, response) => {
  const productId = request.params.id;
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!existingProduct) {
      response.status(404).json({ message: "Product Not Found" });
    }
    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    response.status(200).json(deletedProduct);
  } catch (error) {
    response.status(500).json("Error Deleting Product");
  }
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
