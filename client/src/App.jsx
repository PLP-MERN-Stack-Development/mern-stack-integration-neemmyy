import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);

  // pagination + search + filtering
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // create post form state
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
  });

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts", {
        params: {
          page,
          limit: 5,
          search,
          category,
        },
      });

      setPosts(res.data.posts);
      setPages(res.data.pages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, category]);

  // create post handler
  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/posts", newPost);

      // reset form
      setNewPost({ title: "", content: "", category: "" });
      setShowForm(false);

      // reload posts
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-10">

      <h1 className="text-3xl font-bold mb-6">MERN Blog</h1>

      {/* top bar */}
      <div className="flex justify-between items-center mb-6">

        {/* search + filter row */}
        <div className="flex gap-4 items-center">

          <input
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            <option value="tech">Tech</option>
            <option value="news">News</option>
            <option value="sports">Sports</option>
          </select>

          <button
            onClick={() => {
              setPage(1);
              fetchPosts();
            }}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            Search
          </button>
        </div>

        {/* create button */}
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 rounded"
        >
          + New Post
        </button>
      </div>

      {/* posts list */}
      <div className="space-y-4">
        {posts.length === 0 && <p>No posts found.</p>}

        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-800 rounded p-4 border border-gray-700"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-300">{post.content}</p>
            <p className="text-sm text-gray-400 mt-2">
              Category: {post.category || "none"}
            </p>
          </div>
        ))}
      </div>

      {/* pagination */}
      <div className="flex justify-center gap-4 mt-8">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span>
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
        >
          Next
        </button>

      </div>

      {/* CREATE POST MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-[420px]">

            <h2 className="text-xl font-semibold mb-4">Create New Post</h2>

            <form onSubmit={handleCreatePost} className="space-y-3">

              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                required
              />

              <textarea
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                placeholder="Content"
                rows="4"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                required
              />

              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700"
                placeholder="Category"
                value={newPost.category}
                onChange={(e) =>
                  setNewPost({ ...newPost, category: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 mt-2">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-2 bg-gray-600 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-3 py-2 bg-green-600 rounded"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
