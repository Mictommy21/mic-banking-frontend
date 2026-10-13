"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NewsAnnouncements from "@/app/components/NewsAnnouncements";

interface AccountInfo {
  accountNumber: string;
  accountName: string;
  accountBalance: number;
}

interface ProfileResponse {
  responseCode: string;
  responseMessage: string;
  accountInfo: AccountInfo | null;
}

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setError("");

      const response = await fetch(
        "http://localhost:8086/api/user/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data: ProfileResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.responseMessage ||
            "Failed to load account information."
        );
      }

      if (!data.accountInfo) {
        throw new Error("Account information was not returned.");
      }

      setProfile(data.accountInfo);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load account information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";

    router.push("/login");
  };

  const formatBalance = (balance: number) => {
    return Number(balance).toLocaleString("en-TZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <main className="min-h-screen bg-slate-100">
      {/* TOP NAVIGATION */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071a35] text-lg font-extrabold text-white shadow-sm">
              M
            </div>

            <div className="text-left">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                MIC Banking
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Digital Banking Platform
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/profile")}
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:block"
            >
              My Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <section className="relative overflow-hidden px-6 py-10 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* PAGE HEADER */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-700">
              Personal Banking
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your account, transfer money, view transactions
              and access your banking services.
            </p>
          </div>

          {/* SUPERADMIN PUBLISHED NEWS */}
          <div className="mb-8">
            <NewsAnnouncements />
          </div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-6">
              <div className="animate-pulse rounded-3xl bg-[#071a35] p-8">
                <div className="h-4 w-32 rounded bg-white/20" />
                <div className="mt-5 h-10 w-72 rounded bg-white/20" />
                <div className="mt-8 h-12 w-48 rounded bg-white/10" />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="h-36 animate-pulse rounded-2xl bg-white" />
                <div className="h-36 animate-pulse rounded-2xl bg-white" />
                <div className="h-36 animate-pulse rounded-2xl bg-white" />
              </div>

              <div className="rounded-3xl bg-white p-8">
                <p className="text-center text-sm text-slate-500">
                  Loading account information...
                </p>
              </div>
            </div>
          )}

          {/* PROFILE ERROR */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                  !
                </div>

                <div>
                  <p className="font-semibold">
                    Unable to load account
                  </p>

                  <p className="mt-1 text-sm">{error}</p>

                  <button
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      void loadProfile();
                    }}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD */}
          {!loading && !error && profile && (
            <div className="space-y-7">
              {/* ACCOUNT HERO */}
              <div className="overflow-hidden rounded-3xl bg-[#071a35] shadow-xl">
                <div className="relative p-7 sm:p-9">
                  <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-2xl" />
                  <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-400/10 blur-2xl" />

                  <div className="relative">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-[#071a35] shadow-lg">
                            {profile.accountName.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-blue-200">
                              Welcome back
                            </p>

                            <h3 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                              {profile.accountName}
                            </h3>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                          <span className="text-sm font-medium text-slate-300">
                            Account Active
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
                          Account Number
                        </p>

                        <p className="mt-1 text-lg font-bold tracking-wide text-white">
                          {profile.accountNumber}
                        </p>
                      </div>
                    </div>

                    <div className="mt-10 border-t border-white/10 pt-7">
                      <p className="text-sm font-medium text-slate-300">
                        Available Balance
                      </p>

                      <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                          TZS {formatBalance(profile.accountBalance)}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            router.push("/dashboard/transactions")
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#071a35] transition hover:bg-slate-100"
                        >
                          View Transactions <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACCOUNT OVERVIEW */}
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                      T
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Balance
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Current Balance
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-slate-900">
                    TZS {formatBalance(profile.accountBalance)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700">
                      #
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Account
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Account Number
                  </p>

                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {profile.accountNumber}
                  </p>
                </div>

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

                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {profile.accountName}
                  </p>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div>
                <div className="mb-5">
                  <p className="text-sm font-semibold text-blue-700">
                    Banking Services
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                    Quick Actions
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Quickly access the banking service you need.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/deposit")}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                        +
                      </div>
                      <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                        →
                      </span>
                    </div>

                    <h4 className="mt-5 text-lg font-extrabold text-slate-900">
                      Deposit
                    </h4>

                    <p className="mt-2 text-sm leading-5 text-slate-500">
                      Add money to your MIC Banking account.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/withdraw")}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700">
                        −
                      </div>
                      <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                        →
                      </span>
                    </div>

                    <h4 className="mt-5 text-lg font-extrabold text-slate-900">
                      Withdraw
                    </h4>

                    <p className="mt-2 text-sm leading-5 text-slate-500">
                      Withdraw money from your account securely.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/transfer")}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                        ↔
                      </div>
                      <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                        →
                      </span>
                    </div>

                    <h4 className="mt-5 text-lg font-extrabold text-slate-900">
                      Transfer
                    </h4>

                    <p className="mt-2 text-sm leading-5 text-slate-500">
                      Send money securely to another account.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/dashboard/transactions")
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                        ≡
                      </div>
                      <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                        →
                      </span>
                    </div>

                    <h4 className="mt-5 text-lg font-extrabold text-slate-900">
                      Transactions
                    </h4>

                    <p className="mt-2 text-sm leading-5 text-slate-500">
                      View your transaction history and statement.
                    </p>
                  </button>
                </div>
              </div>

              {/* PROFILE SECTION */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-6 p-7 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                      👤
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        Account Settings
                      </p>

                      <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                        My Profile
                      </h3>

                      <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                        View your account information and personalize
                        your MIC Banking experience.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/profile")}
                    className="rounded-xl bg-[#071a35] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0b2850]"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MIC Banking. All rights reserved.
        </p>
      </footer>
    </main>
  );
}