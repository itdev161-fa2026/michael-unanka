// client/src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// ======================================================
// 🛡️ INTERCEPTORS — attach token + handle expired token
// ======================================================

// Include token with every request using Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout on expired/invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ======================================================
// 👤 AUTH API
// ======================================================

// Register user
export const registerUser = async (name, email, password) => {
  const response = await api.post("/users", { name, email, password });
  return response.data;
};

// Login user
export const loginUser = async (email, password) => {
  const response = await api.post("/auth", { email, password });
  return response.data;
};

// ======================================================
// 📝 POSTS API
// ======================================================

// Create a post
export const createPost = async (postData) => {
  const response = await api.post("/posts", postData);
  return response.data;
};

// Get all posts
export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

// Get single post
export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

// Update post
export const updatePost = async (id, { title, body }) => {
  const response = await api.put(`/posts/${id}`, { title, body });
  return response.data;
};

// Delete post
export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

// ======================================================
// 💬 COMMENTS API
// ======================================================

export const getComments = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

export const addComment = async (postId, text) => {
  const response = await api.post(`/posts/${postId}/comments`, { text });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

export const toggleLike = async (commentId) => {
  const response = await api.post(`/comments/${commentId}/like`);
  return response.data;
};

export default api;
