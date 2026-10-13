"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAppearance } from "@/context/UserAppearanceContext";

interface AccountInfo {
  accountName: string;
  accountBalance: number;
  accountNumber: string;
}

interface ProfileResponse {
  responseCode: string;
  responseMessage: string;
  accountInfo: AccountInfo | null;
}

export default function ProfilePage() {
  const router = useRouter();

  const { appearance, setAppearance } =
    useUserAppearance();

  const [profile, setProfile] =
    useState<AccountInfo | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8086/api/user/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: ProfileResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.responseMessage ||
            "Failed to load profile."
        );
      }

      if (!data.accountInfo) {
        throw new Error(
          "Account information was not returned."
        );
      }

      setProfile(data.accountInfo);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to load profile. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    document.cookie =
      "token=; path=/; max-age=0";

    document.cookie =
      "role=; path=/; max-age=0";

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071a35] text-lg font-extrabold text-white shadow-sm">
              M
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                MIC Banking
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Digital Banking Platform
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <section className="relative overflow-hidden px-6 py-10 lg:px-8">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">

          {/* Back */}
          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="group mb-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>

            Back to Dashboard
          </button>

          {/* =================================================
              PAGE HEADER
          ================================================== */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-700">
              Account Settings
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              My Profile
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View your account information and
              personalize your MIC Banking experience.
            </p>
          </div>

          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />

                <div className="flex-1">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

                  <div className="mt-3 h-3 w-64 animate-pulse rounded bg-slate-100" />
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
              </div>

              <p className="mt-8 text-center text-sm text-slate-500">
                Loading profile information...
              </p>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================== */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                  !
                </div>

                <div>
                  <p className="font-semibold">
                    Unable to load profile
                  </p>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              PROFILE
          ================================================== */}
          {!loading && !error && profile && (
            <div className="space-y-6">

              {/* =================================================
                  PROFILE HERO
              ================================================== */}
              <div className="overflow-hidden rounded-3xl bg-[#071a35] shadow-xl">

                <div className="relative p-7 sm:p-9">

                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-2xl" />

                  <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl" />

                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                    {/* User */}
                    <div className="flex items-center gap-5">

                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl font-extrabold text-[#071a35] shadow-lg">
                        {profile.accountName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-blue-200">
                          Account Holder
                        </p>

                        <h3 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                          {profile.accountName}
                        </h3>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-400" />

                          <span className="text-sm text-slate-300">
                            Active Account
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account number */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                        Account Number
                      </p>

                      <p className="mt-1 text-lg font-bold tracking-wide text-white">
                        {profile.accountNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  ACCOUNT SUMMARY
              ================================================== */}
              <div className="grid gap-5 md:grid-cols-3">

                {/* Account Name */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                      👤
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Profile
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Account Name
                  </p>

                  <p className="mt-1 truncate text-lg font-bold text-slate-900">
                    {profile.accountName}
                  </p>
                </div>

                {/* Account Number */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                      #
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Account
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Account Number
                  </p>

                  <p className="mt-1 truncate text-lg font-bold text-slate-900">
                    {profile.accountNumber}
                  </p>
                </div>

                {/* Balance */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl text-green-700">
                      T
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Balance
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Available Balance
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-green-700">
                    TZS{" "}
                    {Number(
                      profile.accountBalance
                    ).toLocaleString("en-TZ", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* =================================================
                  APPEARANCE
              ================================================== */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                        ◐
                      </div>

                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900">
                          Appearance
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Personalize how MIC Banking looks for you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600">
                    {appearance} mode
                  </div>
                </div>

                {/* Appearance options */}
                <div className="mt-7 grid gap-4 md:grid-cols-3">

                  {/* Light */}
                  <label
                    className={`group cursor-pointer rounded-2xl border p-5 transition ${
                      appearance === "light"
                        ? "border-blue-700 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                        ☀
                      </div>

                      <input
                        type="radio"
                        name="appearance"
                        value="light"
                        checked={
                          appearance === "light"
                        }
                        onChange={() =>
                          setAppearance("light")
                        }
                        className="mt-1 h-4 w-4 accent-blue-700"
                      />
                    </div>

                    <h4 className="mt-5 font-bold text-slate-900">
                      Light
                    </h4>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Clean and bright appearance for
                      everyday banking.
                    </p>
                  </label>

                  {/* Dark */}
                  <label
                    className={`group cursor-pointer rounded-2xl border p-5 transition ${
                      appearance === "dark"
                        ? "border-yellow-500 bg-yellow-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-yellow-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-xl text-yellow-400 shadow-sm">
                        ☾
                      </div>

                      <input
                        type="radio"
                        name="appearance"
                        value="dark"
                        checked={
                          appearance === "dark"
                        }
                        onChange={() =>
                          setAppearance("dark")
                        }
                        className="mt-1 h-4 w-4 accent-yellow-500"
                      />
                    </div>

                    <h4 className="mt-5 font-bold text-slate-900">
                      Dark
                    </h4>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Black background with MIC Banking
                      gold accents.
                    </p>
                  </label>

                  {/* System */}
                  <label
                    className={`group cursor-pointer rounded-2xl border p-5 transition ${
                      appearance === "system"
                        ? "border-blue-700 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-700 shadow-sm">
                        ◐
                      </div>

                      <input
                        type="radio"
                        name="appearance"
                        value="system"
                        checked={
                          appearance === "system"
                        }
                        onChange={() =>
                          setAppearance("system")
                        }
                        className="mt-1 h-4 w-4 accent-blue-700"
                      />
                    </div>

                    <h4 className="mt-5 font-bold text-slate-900">
                      System
                    </h4>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Automatically follow your device
                      theme.
                    </p>
                  </label>
                </div>
              </div>

              {/* =================================================
                  SECURITY INFORMATION
              ================================================== */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg text-green-700">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Account Security
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Your banking account is protected
                      through secure authentication.
                      Never share your password or login
                      credentials with anyone.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MIC Banking.
          All rights reserved.
        </p>
      </footer>
    </main>
  );
}