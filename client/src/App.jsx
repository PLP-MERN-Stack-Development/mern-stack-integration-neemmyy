import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [postForm, setPostForm] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/api/posts");
    setPosts(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) return alert("All fields required");
    await axios.post("http://localhost:5000/api/posts", postForm);
    setPostForm({ title: "", content: "" });
    setShowModal(false);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    await axios.delete(`http://localhost:5000/api/posts/${id}`);
    fetchPosts();
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setPostForm({ title: post.title, content: post.content });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/posts/${editPost._id}`, postForm);
    setEditPost(null);
    setShowModal(false);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-700 bg-gray-900/70 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-400">📰 MERN Blog</h1>
        <button
          onClick={() => {
            setEditPost(null);
            setPostForm({ title: "", content: "" });
            setShowModal(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
        >
          ➕ Create Post
        </button>
      </nav>

      {/* Posts */}
      <main className="px-6 py-10 max-w-6xl mx-auto">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No posts yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-800/70 border border-gray-700 rounded-2xl p-6 shadow-xl"
                >
                  <h2 className="text-xl font-semibold mb-3 text-blue-400">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 mb-4">{post.content}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    🕓 {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-3 py-1 bg-yellow-500/80 hover:bg-yellow-600 rounded-lg text-sm font-semibold"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-3 py-1 bg-red-500/80 hover:bg-red-600 rounded-lg text-sm font-semibold"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={editPost ? handleUpdate : handleCreate}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-96 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4 text-blue-400">
                {editPost ? "✏️ Edit Post" : "➕ New Post"}
              </h2>
              <input
                type="text"
                placeholder="Title"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                className="w-full mb-3 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Content"
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                className="w-full mb-4 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold"
                >
                  {editPost ? "Update" : "Save"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
