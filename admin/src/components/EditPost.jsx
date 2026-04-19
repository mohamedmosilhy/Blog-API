import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setpublished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load post");
      }

      const res = await response.json();
      setTitle(res.title);
      setContent(res.content);
      setpublished(res.published);
    };

    fetchPost();
  }, [id]);

  const handleEditingPost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content, published }),
      });
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-paper via-paper-deep to-paper p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-ink mb-8">
          Edit Post
        </h1>
        <form onSubmit={handleEditingPost} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-ink"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-ink placeholder-ink-soft transition"
              placeholder="Enter post title"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-ink"
            >
              Content
            </label>
            <textarea
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="8"
              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white text-ink placeholder-ink-soft transition resize-none"
              placeholder="Write your post content here..."
            />
          </div>
          <div className="flex items-center space-x-3 p-4 bg-white border border-line rounded-lg">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setpublished(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
            <label
              htmlFor="published"
              className="text-sm font-medium text-ink cursor-pointer flex-1"
            >
              Publish immediately
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
