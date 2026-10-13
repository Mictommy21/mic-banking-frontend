"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

interface CreditResponse {
  responseCode: string;
  responseMessage: string;
  accountInfo: AccountInfo | null;
}

export default function DepositPage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<AccountInfo | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [amount, setAmount] =
    useState("");

  const [depositLoading, setDepositLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD PROFILE
  // =====================================================

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
            "Failed to load account information."
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
          "Failed to load account information."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // =====================================================
  // DEPOSIT MONEY
  // =====================================================

  const handleDeposit = async () => {
    setMessage("");
    setError("");

    if (!amount) {
      setError(
        "Please enter the amount you want to deposit."
      );
      return;
    }

    const depositAmount = Number(amount);

    if (
      Number.isNaN(depositAmount) ||
      depositAmount <= 0
    ) {
      setError(
        "Deposit amount must be greater than 0."
      );
      return;
    }

    if (!profile) {
      setError(
        "Account information is not available."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setDepositLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8086/api/user/credit",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountNumber:
              profile.accountNumber,
            amount: depositAmount,
          }),
        }
      );

      const data: CreditResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.responseMessage ||
            "Deposit failed."
        );
      }

      if (!data.accountInfo) {
        throw new Error(
          data.responseMessage ||
            "Deposit failed."
        );
      }

      // Update balance immediately
      setProfile(data.accountInfo);

      // Clear amount field
      setAmount("");

      // Success message
      setMessage(
        data.responseMessage ||
          "Money deposited successfully."
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Deposit failed. Please try again."
        );
      }
    } finally {
      setDepositLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    document.cookie =
      "token=; path=/; max-age=0";

    document.cookie =
      "role=; path=/; max-age=0";

    router.push("/login");
  };

  // =====================================================
  // FORMAT BALANCE
  // =====================================================

  const formatBalance = (balance: number) => {
    return Number(balance).toLocaleString(
      "en-TZ",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================================
  // QUICK AMOUNTS
  // =====================================================

  const quickAmounts = [
    10000,
    20000,
    50000,
    100000,
  ];

  return (
    <main className="min-h-screen bg-slate-100">

      {/* =================================================
          NAVIGATION
      ================================================== */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          {/* Brand */}
          <button
            onClick={() =>
              router.push("/dashboard")
            }
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

          {/* Actions */}
          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                router.push("/dashboard/profile")
              }
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:block"
            >
              My Profile
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* =================================================
          MAIN
      ================================================== */}
      <section className="relative overflow-hidden px-6 py-10 lg:px-8">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-5xl">

          {/* =================================================
              BACK
          ================================================== */}
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
              Banking Service
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Deposit Money
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Add money to your MIC Banking account
              securely and conveniently.
            </p>

          </div>

          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="space-y-6">

              {/* Balance skeleton */}
              <div className="animate-pulse rounded-3xl bg-[#071a35] p-8">

                <div className="h-4 w-32 rounded bg-white/20" />

                <div className="mt-5 h-10 w-64 rounded bg-white/20" />

                <div className="mt-4 h-4 w-48 rounded bg-white/10" />

              </div>

              {/* Form skeleton */}
              <div className="animate-pulse rounded-3xl bg-white p-8">

                <div className="h-6 w-48 rounded bg-slate-200" />

                <div className="mt-8 h-14 rounded-xl bg-slate-100" />

                <div className="mt-5 h-12 rounded-xl bg-slate-200" />

              </div>

              <p className="text-center text-sm text-slate-500">
                Loading account information...
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
                    Deposit unavailable
                  </p>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>

                  <button
                    onClick={() => {
                      setError("");
                      setLoading(true);
                      loadProfile();
                    }}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Try Again
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* =================================================
              DEPOSIT CONTENT
          ================================================== */}
          {!loading && !error && profile && (
            <div className="space-y-6">

              {/* =================================================
                  CURRENT BALANCE
              ================================================== */}
              <div className="overflow-hidden rounded-3xl bg-[#071a35] shadow-xl">

                <div className="relative p-7 sm:p-9">

                  {/* Decorations */}
                  <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-2xl" />

                  <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl" />

                  <div className="relative">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-sm font-medium text-blue-200">
                          Available Balance
                        </p>

                        <h3 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                          TZS{" "}
                          {formatBalance(
                            profile.accountBalance
                          )}
                        </h3>

                        <p className="mt-3 text-sm text-slate-300">
                          Current account balance
                        </p>

                      </div>

                      {/* Account */}
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
              </div>

              {/* =================================================
                  DEPOSIT FORM
              ================================================== */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700">
                    +
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-blue-700">
                      Add Funds
                    </p>

                    <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                      Enter Deposit Amount
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Enter the amount you would like to
                      add to your account.
                    </p>

                  </div>
                </div>

                {/* Amount input */}
                <div className="mt-8">

                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Amount (TZS)
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      TZS
                    </span>

                    <input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError("");
                        setMessage("");
                      }}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 pl-16 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                </div>

                {/* Quick amounts */}
                <div className="mt-5">

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Quick Amount
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                    {quickAmounts.map(
                      (quickAmount) => (
                        <button
                          key={quickAmount}
                          type="button"
                          onClick={() => {
                            setAmount(
                              quickAmount.toString()
                            );
                            setError("");
                            setMessage("");
                          }}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {quickAmount.toLocaleString(
                            "en-TZ"
                          )}
                        </button>
                      )
                    )}

                  </div>
                </div>

                {/* Deposit button */}
                <button
                  onClick={handleDeposit}
                  disabled={depositLoading}
                  className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#071a35] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#0b2850] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {depositLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Processing Deposit...
                    </>
                  ) : (
                    <>
                      Deposit Money
                      <span>→</span>
                    </>
                  )}

                </button>

                <p className="mt-4 text-center text-xs text-slate-400">
                  Please review the amount before
                  confirming your deposit.
                </p>

              </div>

              {/* =================================================
                  SUCCESS MESSAGE
              ================================================== */}
              {message && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                      ✓
                    </div>

                    <div>

                      <p className="font-bold text-green-800">
                        Deposit Successful
                      </p>

                      <p className="mt-1 text-sm leading-6 text-green-700">
                        {message}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-green-800">
                        Updated Balance: TZS{" "}
                        {formatBalance(
                          profile.accountBalance
                        )}
                      </p>

                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  ACCOUNT HOLDER
              ================================================== */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-extrabold text-blue-700">
                      {profile.accountName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Account Holder
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {profile.accountName}
                      </p>

                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        "/dashboard/transactions"
                      )
                    }
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    View Transactions
                  </button>

                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center">

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MIC Banking.
          All rights reserved.
        </p>

      </footer>

    </main>
  );
}
