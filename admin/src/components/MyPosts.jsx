import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../../api/api";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const MyPosts = () => {
  const [posts, setPosts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [deleteDialog, setDeleteDialog] = React.useState(null);
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
      await api.patch(`/posts/${id}/publish`, null, {
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

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
      await api.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      setPosts((posts) => posts.filter((post) => post.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

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

  const openDeletePostDialog = (post) => {
    setDeleteDialog({
      title: `Delete \"${post.title}\"?`,
      description:
        "This will permanently remove the post and all of its comments.",
      confirmLabel: "Delete post",
      onConfirm: () => handleDelete(post.id),
    });
  };

  const openDeleteCommentDialog = (post, comment) => {
    setDeleteDialog({
      title: "Delete this comment?",
      description: `This comment belongs to ${comment.user?.username || "this post"} and will be removed immediately.`,
      confirmLabel: "Delete comment",
      onConfirm: () => handleDeleteComment(post.id, comment.id),
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setAuthInfo({ token: null, username: "", role: "" });
    setPosts([]);
    setPage(1);
    setPagination({
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!authInfo.token) {
        setPosts([]);
        return;
      }

      try {
        const { data: res } = await api.get(
          `/posts/my-posts?page=${page}&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${authInfo.token}`,
            },
          },
        );

        if (Array.isArray(res)) {
          setPosts(res);
          setPagination({
            page,
            limit: 5,
            total: res.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: page > 1,
          });
        } else {
          setPosts(res.posts || []);
          setPagination(
            res.pagination || {
              page,
              limit: 5,
              total: 0,
              totalPages: 1,
              hasNextPage: false,
              hasPrevPage: page > 1,
            },
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [authInfo.token, page]);
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
                {pagination.total} Post{pagination.total === 1 ? "" : "s"} Total
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
              <>
                {posts.map((post) => (
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
                          onClick={() => openDeletePostDialog(post)}
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
                                  User:{" "}
                                  {comment.user?.username || "Unknown user"}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  openDeleteCommentDialog(post, comment)
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
                ))}

                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    disabled={!pagination.hasPrevPage}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-semibold text-ink-soft">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={!pagination.hasNextPage}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-6 text-sm text-ink-soft">
                Please log in to view your posts.
              </p>
            )}
          </div>
        </section>

        <ConfirmDeleteModal
          open={Boolean(deleteDialog)}
          title={deleteDialog?.title || "Confirm deletion"}
          description={
            deleteDialog?.description || "This action cannot be undone."
          }
          confirmLabel={deleteDialog?.confirmLabel || "Delete"}
          onCancel={closeDeleteDialog}
          onConfirm={async () => {
            const action = deleteDialog?.onConfirm;
            closeDeleteDialog();
            if (action) {
              await action();
            }
          }}
        />
      </div>
    </div>
  );
};

export default MyPosts;
