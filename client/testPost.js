import axios from "axios";

async function createPost() {
  try {
    const response = await axios.post("http://localhost:5000/api/posts", {
      title: "Test Post from Node Script",
      content: "This post was created without Postman!",
    });
    console.log("Post created successfully:", response.data);
  } catch (error) {
    console.error("❌ Error creating post:", error.message);
  }
}

createPost();
