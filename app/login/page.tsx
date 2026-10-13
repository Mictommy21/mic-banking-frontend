"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8086/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.responseMessage ||
            data.message ||
            "Login failed"
        );
      }

      // Backend returns JWT inside responseMessage
      const token = data.responseMessage;

      // Backend returns role separately
      const role = data.role;

      if (!token) {
        throw new Error(
          "Login succeeded but JWT token was not received."
        );
      }

      if (!role) {
        throw new Error(
          "Login succeeded but user role was not received."
        );
      }

      // Save JWT token in browser
      localStorage.setItem("token", token);

      // Save user role in browser
      localStorage.setItem("role", role);

      // Save authentication data in cookies
      document.cookie = `token=${token}; path=/`;
      document.cookie = `role=${role}; path=/`;

      // Redirect based on user role
      
      // Redirect based on user role
      if (role === "ROLE_SUPERADMIN") {
        router.push("/superadmin");
      } else if (role === "ROLE_ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "ROLE_USER") {
        router.push("/dashboard");
      } else {
        throw new Error("Unrecognized user role. Please contact support.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-lg font-extrabold text-white shadow-sm">
              M
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                MIC Banking
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Secure Digital Banking
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Secure Connection
          </div>
        </div>
      </nav>

      {/* Main Login Area */}
      <section className="relative flex min-h-[calc(100vh-81px)] items-center justify-center overflow-hidden px-6 py-12">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
        </div>

        <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-2">

          {/* Left Branding Panel */}
          <div className="relative hidden overflow-hidden bg-[#071a35] p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-2xl" />

            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl" />

            <div className="relative">

              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-extrabold text-[#071a35]">
                  M
                </div>

                <div>
                  <p className="text-xl font-bold">
                    MIC Banking
                  </p>

                  <p className="text-sm text-blue-200">
                    Digital Banking Platform
                  </p>
                </div>
              </div>

              <span className="inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-200">
                Welcome back
              </span>

              <h2 className="mt-6 max-w-md text-4xl font-extrabold leading-tight">
                Banking made
                <span className="block text-blue-300">
                  simple and secure.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                Manage your account, transfer money,
                check transactions and access your
                banking services from one secure platform.
              </p>
            </div>

            {/* Features */}
            <div className="relative mt-10 space-y-4">

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  ✓
                </div>

                <div>
                  <p className="font-semibold">
                    Secure Banking
                  </p>

                  <p className="text-sm text-slate-400">
                    Your account is protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  ↗
                </div>

                <div>
                  <p className="font-semibold">
                    Fast Transactions
                  </p>

                  <p className="text-sm text-slate-400">
                    Manage your money with ease.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Login Panel */}
          <div className="p-7 sm:p-10 lg:p-12">

            {/* Mobile Branding */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071a35] text-lg font-extrabold text-white">
                M
              </div>

              <div>
                <h1 className="text-lg font-extrabold text-slate-900">
                  MIC Banking
                </h1>

                <p className="text-xs text-slate-500">
                  Secure Digital Banking
                </p>
              </div>
            </div>

            {/* Header */}
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Account Access
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue to your MIC Banking
                account.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-start gap-3">
                  <span className="font-bold">!</span>

                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-blue-400 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Logging in...
                  </>
                ) : (
                  "Login to Account"
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?
              </p>

              <a
                href="/register"
                className="mt-2 inline-block text-sm font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
              >
                Create a new account
              </a>
            </div>

            {/* Security note */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Your connection is protected
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MIC Banking. All rights reserved.
        </p>
      </footer>
    </main>
  );
}