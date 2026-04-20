import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const registerResponse = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      const registerResult = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerResult.message || "Registration failed");
      }

      const loginResponse = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginResult = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(
          loginResult.message || "Login after registration failed",
        );
      }

      localStorage.setItem("token", loginResult.token);
      localStorage.setItem("username", loginResult.username || "");
      localStorage.setItem("role", loginResult.role || "");
      localStorage.setItem("id", loginResult.id || "");
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
            Create An Account
          </h1>
          <p className="mt-3 text-sm text-ink-soft md:text-base">
            Join our community to share your thoughts and connect with others.
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
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
