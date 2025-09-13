import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});


// ================= AUTH =================
export const signup = async (formData) => {
  try {
    const response = await API.post("/signup", formData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const login = async (formData) => {
  try {
    const response = await API.post("/login", formData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};
export const resendCode = async ({ email }) => { try { const response = await API.post("/resend-code", { email }); return response.data; } catch (error) { return { error: error.response?.data?.error || error.message }; } };

export const verify = async (codeData) => {
  try {
    const response = await API.post("/verify", codeData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

// ================= PRODUCTS =================
export const getProducts = async () => {
  try {
    const response = await API.get("/products");
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: error.response?.data?.error || error.message };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await API.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await API.post("/products", productData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const updateProduct = async (id, productData, config = {}) => {
  try {
    const response = await API.put(`/products/${id}`, productData, config);
    return response.data;
  } catch (error) {
    console.error("updateProduct error:", error.response?.data || error.message);
    return { error: error.response?.data?.error || error.message };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

// ================= ORDERS =================
export const createOrder = async (orderData) => {
  try {
    const response = await API.post("/orders", orderData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await API.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const getAllOrders = async () => {
  try {
    const response = await API.get("/orders");
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await API.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

// ================= CUSTOMERS =================
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await API.put(`/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await API.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const getCustomers = async () => {
  try {
    const response = await API.get("/customers");
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await API.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

// ================= CART =================
// ================= CART =================
export const addToCart = async (cartData) => {
  try {
    // cartData = { customerId, productId, quantity, color, size }
    const response = await API.post("/cart", cartData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const getCart = async (customerId) => {
  try {
    const response = await API.get(`/cart/user/${customerId}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const deleteCartItem = async (cartId) => {
  try {
    const response = await API.delete(`/cart/${cartId}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};

export const clearCart = async (customerId) => {
  try {
    const response = await API.delete(`/cart/customer/${customerId}`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || error.message };
  }
};


export default API;
