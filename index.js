const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('MongoDB connection error:', error));

// Import models
const Product = require('./models/Product');
const Invoice = require('./models/Invoice');

// Product CRUD routes
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

app.put('/products/:id', async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted successfully' });
});

// Create invoice route
app.post('/invoices', async (req, res) => {
  const { customer, products } = req.body;
  let total = 0;

  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ message: 'Product unavailable or insufficient stock' });
    }
    total += product.price * item.quantity;
    product.stock -= item.quantity;
    await product.save();
  }

  const invoice = new Invoice({ customer, products, total });
  await invoice.save();
  res.json(invoice);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
