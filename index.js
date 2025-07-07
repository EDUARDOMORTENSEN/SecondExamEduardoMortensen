const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Import models
const Product = require('./models/Product');
const Invoice = require('./models/Invoice');

// === PRODUCT ROUTES ===

// Get all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Create a new product
app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

// Update a product
app.put('/products/:id', async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted successfully' });
});

// === INVOICE ROUTES ===

// Create a new invoice
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

// Get invoice total by ID (recalculate from products)
app.get('/invoices/:id/total', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    let total = 0;

    for (const item of invoice.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
      }
      total += product.price * item.quantity;
    }

    res.json({
      invoiceId: invoice._id,
      customer: invoice.customer,
      calculatedTotal: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating total', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
