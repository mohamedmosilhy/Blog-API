import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const PostsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [authInfo, setAuthInfo] = useState(() => ({
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
    id: localStorage.getItem("id"),
  }));

  const getRoleLabel = (role) => {
    if (role === "AUTHOR") {
      return "Admin";
    }

    if (role === "USER") {
      return "Client";
    }

    return "Client";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    setAuthInfo({ token: null, username: "", role: "", id: "" });
  };

  const handleEditComment = async (comment) => {
    setEditingComment(comment);
    setEditingContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editingComment) return;

    const trimmedComment = editingContent.trim();
    if (!trimmedComment) {
      alert("Comment content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`/comments/${editingComment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authInfo.token}`,
        },
        body: JSON.stringify({ content: trimmedComment }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const updatedComment = await response.json();

      setData((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.map((c) =>
            c.id === editingComment.id ? updatedComment : c,
          ),
        })),
      );

      setEditingComment(null);
      setEditingContent("");
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditingContent("");
  };
  const handleDeleteComment = async (comment) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await fetch(`/comments/${comment.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setData((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.filter((c) => c.id !== comment.id),
        })),
      );
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };

  const handleAddingComment = async (event, post) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      navigate("/login");
      return;
    }

    const content = (commentInputs[post.id] || "").trim();
    if (!content) {
      setError("Comment content is required");
      return;
    }

    try {
      const response = await fetch("/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, postId: post.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add comment");
      }

      setError(null);
      setCommentInputs((prev) => ({ ...prev, [post.id]: "" }));
      setData((prevPosts) =>
        prevPosts.map((currentPost) =>
          currentPost.id === post.id
            ? { ...currentPost, comments: [...currentPost.comments, result] }
            : currentPost,
        ),
      );
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/posts", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const res = await response.json();
        setData(res.filter((post) => post.published));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
          <p className="text-center text-lg font-medium text-ink-soft">
            Loading posts...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
          <div className="rounded-2xl border border-red-300/70 bg-red-50 p-5 text-red-700 shadow-sm">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <header className="mb-8 overflow-hidden rounded-3xl border border-white/40 bg-white/75 p-6 shadow-lg backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-copper">
                Community Feed
              </p>
              <h1 className="font-display text-3xl leading-tight text-ink md:text-5xl">
                Blog Stories & Discussions
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-ink-soft md:text-base">
                Read fresh posts and join the conversation by adding your own
                comments.
              </p>
              <div className="mt-4 inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                {data.length} Published Post{data.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="w-full rounded-2xl border border-line bg-white/85 p-4 shadow-sm md:w-auto md:min-w-64">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-copper">
                Current Session
              </p>
              <span className="mt-2 inline-flex items-center rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                {authInfo.token
                  ? `${authInfo.username || "Signed in"} · ${getRoleLabel(authInfo.role)}`
                  : "Guest · Client"}
              </span>

              <div className="mt-3">
                {authInfo.token ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex w-full items-center justify-center rounded-full border border-brand-teal bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      className="inline-flex w-full items-center justify-center rounded-full border border-brand-teal bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex w-full items-center justify-center rounded-full border border-brand-teal bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {data.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white/70 p-8 text-center text-ink-soft shadow-sm">
            No posts found.
          </div>
        ) : (
          <ul className="space-y-6">
            {data.map((post) => (
              <li
                className="post-card rounded-3xl border border-line bg-white/80 p-5 shadow-md backdrop-blur md:p-6"
                key={post.id}
              >
                <h2 className="font-display text-2xl leading-tight text-ink md:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  {post.content}
                </p>
                <p className="mt-3 text-sm font-medium text-brand-copper">
                  By {post.author.username}
                </p>

                <section className="mt-5 rounded-2xl border border-line bg-white/75 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    Comments ({post.comments.length})
                  </h3>
                  <div className="mt-3 space-y-3">
                    {post.comments.length === 0 ? (
                      <p className="text-sm text-ink-soft">
                        No comments yet. Be the first to reply.
                      </p>
                    ) : (
                      post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-xl border border-line bg-paper p-3"
                        >
                          <p className="text-sm text-ink">{comment.content}</p>
                          <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-brand-copper">
                            By {comment.user?.username || "Unknown"}
                          </p>

                          {comment.user?.id === Number(authInfo.id) && (
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="flex-1 rounded-lg border border-brand-teal bg-brand-teal/10 px-3 py-1.5 text-sm font-semibold text-brand-teal transition hover:bg-brand-teal/20 active:scale-95"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment)}
                                className="flex-1 rounded-lg border border-red-400 bg-red-50/50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-95"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <form
                  className="mt-5"
                  onSubmit={(event) => handleAddingComment(event, post)}
                >
                  <label
                    className="mb-2 block text-sm font-semibold text-ink"
                    htmlFor={`comment-${post.id}`}
                  >
                    Add a comment
                  </label>
                  <div className="flex flex-col gap-2 md:flex-row">
                    <input
                      className="min-h-11 flex-1 rounded-xl border border-line bg-white px-3 py-2 text-ink outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-(--brand-teal)/25"
                      type="text"
                      id={`comment-${post.id}`}
                      value={commentInputs[post.id] || ""}
                      onChange={(event) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: event.target.value,
                        }))
                      }
                    />
                    <button
                      type="submit"
                      className="min-h-11 rounded-xl bg-brand-teal px-4 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95"
                    >
                      Add Comment
                    </button>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Comment Modal */}
      {editingComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/40 bg-white/95 p-6 shadow-2xl">
            <h2 className="mb-4 font-display text-2xl font-bold text-ink">
              Edit Your Comment
            </h2>

            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-semibold text-ink"
                htmlFor="edit-comment-input"
              >
                Comment Text
              </label>
              <textarea
                id="edit-comment-input"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-(--brand-teal)/25"
                rows="4"
                placeholder="Edit your comment..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 rounded-lg border border-line bg-white/50 px-4 py-2.5 font-semibold text-ink transition hover:bg-white/75 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 rounded-lg bg-brand-teal px-4 py-2.5 font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
