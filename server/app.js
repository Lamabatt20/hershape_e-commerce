
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

dotenv.config();
import multer from "multer";

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "../client/public/images/");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});


const app = express();
const prisma = new PrismaClient();


app.use(cors());
app.use(express.json());


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, 
});

// ====== AUTH ======


app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ error: "Email already exists" });

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername)
      return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

  
    const user = await prisma.user.create({
      data: {
        username,
        email,
        role: "customer",
        password: hashedPassword,
        verificationCode: code,
        codeExpiry: expiry,
        isVerified: false,
      },
    });

 
    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        name: username,
        address: "",
        phone:"",
        email:email,
        
      },
    });

    await transporter.sendMail({
  from: `"Her shape" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Email Verification Code",
  html: `
    <div style="background-color:#6f3d6d;padding:30px;color:#fcf8f0;font-family:Arial,sans-serif;max-width:600px;margin:auto;border-radius:8px;">
      <h2 style="color:#F7B6FF;text-align:center;">🔒 Email Verification</h2>
      <p style="text-align:center;">Hello,</p>
      <p style="text-align:center;">Thank you for signing up with <strong>Her shape</strong>. To complete your registration, please use the verification code below:</p>
      
      <div style="display:flex; justify-content:center; margin:30px 0;">
        <div style="background:#F7B6FF; width:200px; text-align:center; padding:15px 0; border-radius:8px; font-size:28px; font-weight:bold; color:#fcf8f0; letter-spacing:5px; margin:auto;">
          ${code}
        </div>
      </div>
      
      <p style="text-align:center;">This code will expire in <strong>15 minutes</strong>. Please do not share it with anyone.</p>
      <hr style="border:0;border-top:1px solid #F7B6FF;margin:20px 0;">
      <p style="text-align:center;">If you did not request this verification, please ignore this email or contact our support team.</p>
      <p style="text-align:center;">Regards,<br><strong>The Her shape Team</strong></p>
    </div>
  `,
});


    res.json({ message: "Verification code sent to email", user, customer });
  } catch (err) {
    console.error("Error in /signup:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.status(400).json({ error: "Already verified" });
    if (user.verificationCode !== code) return res.status(400).json({ error: "Invalid code" });
    if (new Date() > user.codeExpiry) return res.status(400).json({ error: "Code expired" });

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, verificationCode: null, codeExpiry: null },
    });

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { customer: true }, 
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isVerified) return res.status(403).json({ error: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// ====== PRODUCTS ======
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,  
        orderItems: true,
      },
    });

    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      name_ar: p.name_ar,
      description: p.description,
      description_ar: p.description_ar,
      price: p.price,
      images: p.images,
      available: p.available,
      sold: p.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      variants: p.variants, 
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { variants: true, orderItems: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({
      ...product,
      available: product.available,
      sold: product.orderItems.reduce((sum, item) => sum + item.quantity, 0),
      variants: product.variants,
    });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/products", upload.array("images"), async (req, res) => {
  try {
    const { name, description, price,available, variants } = req.body;
    const images = req.files.map(file => `/images/${file.filename}`);
    const parsedVariants = JSON.parse(variants); 

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images,
        available,
        variants: {
          create: parsedVariants.map(v => ({
            size: v.size,
            color: v.color,
            stock: parseInt(v.stock),
            images: v.images || [],
          })),
        },
      },
      include: { variants: true },
    });

    res.json(newProduct);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/products/:id", upload.array("images"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, variants, removedImages,available} = req.body;
  const newImages = req.files.map(file => `/images/${file.filename}`);

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { variants: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (removedImages) {
      const removedArray = Array.isArray(removedImages) ? removedImages : [removedImages];
      removedArray.forEach(img => {
        const filePath = path.join(__dirname, "../client/public", img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    let updatedImages = product.images || [];
    if (removedImages) {
      const removedArray = Array.isArray(removedImages) ? removedImages : [removedImages];
      updatedImages = updatedImages.filter(img => !removedArray.includes(img));
    }
    updatedImages = [...updatedImages, ...newImages];

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        images: updatedImages,
        available,
      },
    });

    if (variants) {
      const parsedVariants = JSON.parse(variants);
      await prisma.productVariant.deleteMany({ where: { productId: parseInt(id) } });
      await prisma.productVariant.createMany({
        data: parsedVariants.map(v => ({
          productId: parseInt(id),
          size: v.size,
          color: v.color,
          stock: parseInt(v.stock),
           images: v.images || [],
        })),
      });
    }

    const productWithVariants = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { variants: true },
    });

    res.json(productWithVariants);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.productVariant.deleteMany({
      where: { productId: parseInt(id) },
    });

    
    const deleted = await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Product deleted successfully", deleted });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// ====== ORDERS ======
app.post("/orders", async (req, res) => {
  const { customerId, items, subtotal, shipping, total } = req.body;

  try {
    const customer = await prisma.customer.findUnique({ where: { id: parseInt(customerId) } });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    for (const item of items) {
      const product = await prisma.product.findUnique({ 
        where: { id: item.productId },
        include: { variants: true }
      });

      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });

      const variant = product.variants.find(v => v.color === item.color && v.size === item.size);
      if (!variant) return res.status(404).json({ error: `Variant not found for ${product.name}` });

      if (variant.stock < item.quantity)
        return res.status(400).json({ error: `Not enough stock for ${product.name} (${item.size}, ${item.color})` });

      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { stock: variant.stock - item.quantity }
      });
    }
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        subtotal,
        shipping,
        status: "pending",
        items: {
          create: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
            size: i.size
          }))
        }
      },
      include: { items: { include: { product: true } }, customer: true }
    });

    
    try {
      await transporter.sendMail({
        from: `"Her Shape Orders" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, 
        subject: "🛍️ New Order Received",
        html: `
          <div style="background:#f8f2fc;padding:25px;border-radius:10px;font-family:Arial,sans-serif;line-height:1.6;">
            <h2 style="color:#6f3d6d;">New Order Received!</h2>
            <p>You have a new order from <strong>${order.customer.name}</strong>.</p>
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p style="margin-top:10px;">Click below to view it on your dashboard using email (Larashareef@hotmail.com) $ password (lara1996):</p>
            <a href="https://www.hershape.online/dashboard"
              style="display:inline-block;margin-top:15px;background:#6f3d6d;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">
              🔍 Go to Dashboard
            </a>
          </div>
        `,
      });

      console.log("📩 Order notification email sent to admin successfully");
    } catch (emailErr) {
      console.error("❌ Error sending order email:", emailErr);
    }

    res.json(order);

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/orders/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const customer = await prisma.customer.findUnique({
      where: { userId: parseInt(userId) },
    });
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: { items: { include: { product: true } }, customer: true,   },
    });

    res.json(orders);
  } catch (err) {
    console.error("Get user orders error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/orders", async (req, res) => {
  try {
     const orders = await prisma.order.findMany({
      include: { 
        items: { include: { product: true } },
        customer: true,   
      },
    });
    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ====== CUSTOMERS ======
app.post("/customers", async (req, res) => {
  const { userId } = req.body;
  try {
    const newCustomer = await prisma.customer.create({
      data: { userId: parseInt(userId) },
    });
    res.json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { 
        user: true,
        orders: { 
          include: { items: { include: { product: true } } }
        }
      },
    });
    res.json(customers);
  } catch (err) {
    console.error("Get customers error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.put("/orders/:orderId/status", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
      include: {
        items: { include: { product: true } },
        customer: true,
      },
    });

    res.json(updatedOrder);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
      include: { user: true, orders: { include: { items: true } } },
    });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    console.error("Get customer error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, city, address, postal_code, country_region } = req.body;

  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        city,
        address,
        postal_code,
        country_region,
      },
      include: { user: true },
    });

    res.json(updatedCustomer);
  } catch (err) {
    console.error("Update customer error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Delete customer error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ====== CART ======

app.post("/cart", async (req, res) => {
  const { customerId, productId, quantity, color, size } = req.body;
  const qty = parseInt(quantity);

  if (!customerId || !productId)
    return res.status(400).json({ error: "Missing customerId or productId" });

  try {
    const customer = await prisma.customer.findUnique({ where: { id: parseInt(customerId) } });
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // get variant stock
    const variant = await prisma.productVariant.findFirst({
      where: { productId, color, size }
    });

    if (!variant) return res.status(404).json({ error: "Variant not found" });

    const existing = await prisma.cartItem.findFirst({
      where: { customerId: customer.id, productId, color, size },
    });

    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > variant.stock)
        return res.status(400).json({ error: "Quantity exceeds available stock" });

      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
      return res.json(updated);
    }

    if (qty > variant.stock)
      return res.status(400).json({ error: "Quantity exceeds available stock" });

    const newItem = await prisma.cartItem.create({
      data: { customerId: customer.id, productId, quantity: qty, color, size },
    });

    res.json(newItem);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/cart/user/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    const cart = await prisma.cartItem.findMany({
      where: { customerId: parseInt(customerId) },
      include: { 
        product: {
          include: { 
            variants: true 
          } 
        }
      }
    });
    res.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/cart/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    await prisma.cartItem.delete({ where: { id: parseInt(cartId) } });
    res.json({ message: "Cart item deleted" });
  } catch (err) {
    console.error("Delete cart item error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/cart/customer/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    await prisma.cartItem.deleteMany({ where: { customerId: parseInt(customerId) } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// UPDATE cart item
app.put("/cart/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const { quantity, color, size } = req.body;

  try {
    const cartItem = await prisma.cartItem.findUnique({ where: { id: parseInt(cartId) } });
    if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

    const newQty = quantity !== undefined ? parseInt(quantity) : cartItem.quantity;
    const newColor = color || cartItem.color;
    const newSize = size || cartItem.size;

    const variant = await prisma.productVariant.findFirst({
      where: { productId: cartItem.productId, color: newColor, size: newSize },
    });

    if (!variant) return res.status(404).json({ error: "Variant not found" });
    if (newQty > variant.stock)
      return res.status(400).json({ error: "Quantity exceeds available stock" });

    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(cartId) },
      data: { quantity: newQty, color: newColor, size: newSize },
      include: { product: true },
    });

    res.json(updatedItem);
  } catch (err) {
    console.error("Update cart item error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// ====== SERVER ======
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
