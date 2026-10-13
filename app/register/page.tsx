"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    otherName: "",
    gender: "",
    address: "",
    stateOfOrigin: "",
    email: "",
    password: "",
    phoneNumber: "",
    alternativePhoneNumber: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
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

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8086/api/user",
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
            "Account creation failed"
        );
      }

      if (data.responseCode !== "000") {
        throw new Error(
          data.responseMessage ||
            "Account creation failed"
        );
      }

      setMessage(
        data.responseMessage ||
          "Account created successfully!"
      );

      setFormData({
        firstName: "",
        lastName: "",
        otherName: "",
        gender: "",
        address: "",
        stateOfOrigin: "",
        email: "",
        password: "",
        phoneNumber: "",
        alternativePhoneNumber: "",
      });
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

      {/* Register Section */}
      <section className="relative overflow-hidden px-6 py-12 sm:py-16">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-[0.85fr_1.15fr]">

          {/* Left Information Panel */}
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
                Join MIC Banking
              </span>

              <h2 className="mt-6 text-4xl font-extrabold leading-tight">
                Your banking,
                <span className="block text-blue-300">
                  your way.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                Create your MIC Banking account and
                enjoy convenient access to your account,
                transactions and digital banking services.
              </p>
            </div>

            {/* Benefits */}
            <div className="relative mt-10 space-y-4">

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  ✓
                </div>

                <div>
                  <p className="font-semibold">
                    Secure Account
                  </p>

                  <p className="text-sm text-slate-400">
                    Your information stays protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  $
                </div>

                <div>
                  <p className="font-semibold">
                    Easy Banking
                  </p>

                  <p className="text-sm text-slate-400">
                    Manage your money from one place.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  →
                </div>

                <div>
                  <p className="font-semibold">
                    Quick Access
                  </p>

                  <p className="text-sm text-slate-400">
                    Access your account anytime.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Form Panel */}
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
                New Customer
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill in your details below to create
                your MIC Banking account.
              </p>
            </div>

            {/* Success Message */}
            {message && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                <div className="flex items-start gap-3">
                  <span className="font-bold">✓</span>

                  <p>{message}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
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
              className="mt-8 space-y-6"
            >

              {/* Personal Information */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                    Personal Information
                  </h3>

                  <div className="mt-2 h-px bg-slate-200" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      autoComplete="given-name"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      autoComplete="family-name"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                    />
                  </div>

                  {/* Other Name */}
                  <div>
                    <label
                      htmlFor="otherName"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Other Name
                      <span className="ml-1 font-normal text-slate-400">
                        (Optional)
                      </span>
                    </label>

                    <input
                      id="otherName"
                      name="otherName"
                      type="text"
                      value={formData.otherName}
                      onChange={handleChange}
                      placeholder="Enter other name"
                      autoComplete="additional-name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label
                      htmlFor="gender"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Gender
                    </label>

                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                    >
                      <option value="">
                        Select gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                    Contact Information
                  </h3>

                  <div className="mt-2 h-px bg-slate-200" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Address
                    </label>

                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      autoComplete="street-address"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label
                      htmlFor="stateOfOrigin"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      State of Origin
                    </label>

                    <input
                      id="stateOfOrigin"
                      name="stateOfOrigin"
                      type="text"
                      value={formData.stateOfOrigin}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email Address
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

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      autoComplete="tel"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                    />
                  </div>

                  {/* Alternative Phone */}
                  <div>
                    <label
                      htmlFor="alternativePhoneNumber"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Alternative Phone
                      <span className="ml-1 font-normal text-slate-400">
                        (Optional)
                      </span>
                    </label>

                    <input
                      id="alternativePhoneNumber"
                      name="alternativePhoneNumber"
                      type="tel"
                      value={
                        formData.alternativePhoneNumber
                      }
                      onChange={handleChange}
                      placeholder="Alternative number"
                      autoComplete="tel"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                    />
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                    Account Security
                  </h3>

                  <div className="mt-2 h-px bg-slate-200" />
                </div>

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
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Choose a password that you can remember
                  and keep private.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-blue-400 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating Account...
                  </>
                ) : (
                  "Create MIC Banking Account"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have a MIC Banking account?
              </p>

              <a
                href="/login"
                className="mt-2 inline-block text-sm font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
              >
                Login to your account
              </a>
            </div>

            {/* Security Note */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Your information is securely protected
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MIC Banking. All
          rights reserved.
        </p>
      </footer>
    </main>
  );
}