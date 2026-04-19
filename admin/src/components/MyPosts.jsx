import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

const MyPosts = () => {
  const [posts, setPosts] = React.useState([]);
  let navigate = useNavigate();
  const [authInfo, setAuthInfo] = React.useState(() => ({
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
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

  const handlePublish = async (id) => {
    try {
      const response = await fetch(`/posts/${id}/publish`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update the state of publishing the post");
      }

      setPosts((posts) =>
        posts.map((post) =>
          post.id === id ? { ...post, published: !post.published } : post,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts((posts) => posts.filter((post) => post.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await fetch(`/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId,
                ),
              }
            : post,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setAuthInfo({ token: null, username: "", role: "" });
    setPosts([]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!authInfo.token) {
        setPosts([]);
        return;
      }

      const response = await fetch("/posts/my-posts", {
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const posts = await response.json();
      setPosts(posts);
    };

    fetchPosts();
  }, [authInfo.token]);
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-10 ">
        <header className="mb-8 overflow-hidden rounded-3xl border border-white/40 bg-white/75 p-6 shadow-lg backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-copper">
                Management
              </p>
              <h1 className="font-display text-3xl leading-tight text-ink md:text-5xl">
                Admin Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-ink-soft md:text-base">
                Manage content, publish updates, and keep your blog organized.
              </p>
              <div className="mt-4 inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                {posts.length} Post{posts.length === 1 ? "" : "s"} Loaded
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
                  <Link
                    to="/"
                    className="inline-flex w-full items-center justify-center rounded-full border border-brand-teal bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="fade-rise rounded-3xl border border-line bg-white/80 p-6 shadow-md backdrop-blur md:p-8">
          <div>
            <div className="flex items-center justify-between ">
              <div>
                <h2 className="font-display text-2xl text-ink">My Posts</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  View and manage your blog posts.
                </p>
              </div>
              {authInfo.token && (
                <button
                  onClick={() => {
                    navigate("/create-post");
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-brand-teal bg-brand-teal px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95"
                >
                  Create Post
                </button>
              )}
            </div>

            {authInfo.token ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="mt-6 rounded-2xl border border-line bg-white/70 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-ink ">{post.title}</h3>
                    <div className="flex items-center gap-4">
                      <p className="text-xs text-ink-soft italic">
                        Published: {post.published ? "Yes" : "No"}
                      </p>

                      <button
                        className="text-xs font-semibold text-brand-teal hover:text-brand-teal/80"
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs font-semibold text-brand-teal hover:text-brand-teal/80"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </button>
                      {post.published ? (
                        <button
                          onClick={() => handlePublish(post.id)}
                          className="text-xs font-semibold text-brand-teal hover:text-brand-teal/80"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(post.id)}
                          className="text-xs font-semibold text-brand-teal hover:text-brand-teal/80"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-line pt-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                      Comments ({post.comments.length})
                    </p>
                    <div className="mt-2 space-y-2">
                      {post.comments.length ? (
                        post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-center justify-between rounded-xl border border-line bg-white/80 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm text-ink">
                                {comment.content}
                              </p>
                              <p className="text-xs text-ink-soft">
                                User: {comment.user?.username || "Unknown user"}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteComment(post.id, comment.id)
                              }
                              className="text-xs font-semibold text-brand-copper hover:text-brand-copper/80"
                            >
                              Delete
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-ink-soft">
                          No comments yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-6 text-sm text-ink-soft">
                Please log in to view your posts.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyPosts;
