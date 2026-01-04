import express from "express";
import { getPosts } from "../controllers/postController.js";
import Post from "../models/Post.js";

const router = express.Router();

// pagination + search route
router.get("/", getPosts);

// create post
router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    const saved = await post.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get single
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});

// update
router.put("/:id", async (req, res) => {
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// delete
router.delete("/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
