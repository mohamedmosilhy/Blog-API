import React from "react";
import { useEffect } from "react";
import { Link } from "react-router";

const MyPosts = () => {
  const [posts, setPosts] = React.useState([]);
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

      const response = await fetch("/posts", {
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
            <h2 className="font-display text-2xl text-ink">My Posts</h2>
            <p className="mt-1 text-sm text-ink-soft">
              View and manage your blog posts.
            </p>

            {authInfo.token ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="mt-6 rounded-2xl border border-line bg-white/70 p-4 shadow-sm"
                >
                  <h3 className="font-semibold text-ink flex items-center justify-between gap-2">
                    {post.title}
                    <p className="text-xs text-ink-soft italic">
                      Published: {post.published ? "Yes" : "No"}
                    </p>
                  </h3>
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
