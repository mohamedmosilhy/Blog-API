import React, { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: res } = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.role === "AUTHOR") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("username", res.username || "");
        localStorage.setItem("role", res.role || "");
        navigate("/dashboard");
      } else {
        throw new Error(res.message || "Login failed");
      }
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-6 px-4 py-8 md:grid-cols-2 md:px-8">
        <section className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-copper">
            Admin Portal
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
            Author Dashboard Login
          </h1>
          <p className="mt-3 text-sm text-ink-soft md:text-base">
            Sign in with your author account to manage posts and publishing.
          </p>
        </section>

        <section className="rounded-3xl border border-line bg-white/85 p-6 shadow-md md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label
                className="mb-1 text-sm font-semibold text-ink"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="focus-brand min-h-11 rounded-xl border border-line bg-white px-3 py-2 text-ink outline-none transition"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="mb-1 text-sm font-semibold text-ink"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="focus-brand min-h-11 rounded-xl border border-line bg-white px-3 py-2 text-ink outline-none transition"
              />
            </div>

            {error ? (
              <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-11 rounded-xl bg-brand-teal px-4 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
