import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // Automatically uses the Vite proxy
})

// Fetch all posts
export const getPosts = async () => {
  const response = await api.get('/posts')
  return response.data
}

// Create a new post
export const createPost = async (postData) => {
  const response = await api.post('/posts', postData)
  return response.data
}

// Get single post by ID
export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`)
  return response.data
}

export default api
