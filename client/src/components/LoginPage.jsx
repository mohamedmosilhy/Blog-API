import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      localStorage.setItem("token", result.token);
      navigate("/");
    } catch (submitError) {
      setError(submitError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-6 px-4 py-8 md:grid-cols-2 md:px-8">
        <section className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-copper">
            Welcome Back
          </p>
          <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
            Sign In To Continue
          </h1>
          <p className="mt-3 text-sm text-ink-soft md:text-base">
            Access your account to post comments and engage with the community.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center text-sm font-semibold text-brand-teal underline-offset-4 hover:underline"
          >
            Back to posts
          </Link>
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
                className="min-h-11 rounded-xl border border-line bg-white px-3 py-2 text-ink outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-(--brand-teal)/25"
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
                className="min-h-11 rounded-xl border border-line bg-white px-3 py-2 text-ink outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-(--brand-teal)/25"
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
