import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Get all posts
export const getPosts = async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
};

// Get single post by ID
export const getPostById = async (id) => {
  const res = await axios.get(`${API_URL}/posts/${id}`);
  return res.data;
};
