"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Transaction {
  transactionId: string;
  transactionType: string;
  amount: number;
  accountNumber: string;
  status: string;
  createdAt: string;
  modifiedAt: string;
}

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD TRANSACTIONS
  // =====================================================

  const loadTransactions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setError("");

      const today = new Date();

      const endDate = today
        .toISOString()
        .split("T")[0];

      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];

      const response = await fetch(
        `http://localhost:8086/bankStatement?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          "Failed to load transactions."
        );
      }

      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error(
        "Transaction error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to load transactions."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

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
  // FORMAT AMOUNT
  // =====================================================

  const formatAmount = (amount: number) => {
    return Number(amount).toLocaleString(
      "en-TZ",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-TZ",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // TRANSACTION SUMMARY
  // =====================================================

  const totalTransactions =
    transactions.length;

  const successfulTransactions =
    transactions.filter(
      (transaction) =>
        transaction.status?.toUpperCase() ===
        "SUCCESS"
    ).length;

  const creditTransactions =
    transactions.filter(
      (transaction) =>
        transaction.transactionType?.toUpperCase() ===
        "CREDIT"
    ).length;

  const debitTransactions =
    transactions.filter(
      (transaction) =>
        transaction.transactionType?.toUpperCase() !==
        "CREDIT"
    ).length;

  // =====================================================
  // PAGE
  // =====================================================

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
                router.push(
                  "/dashboard/profile"
                )
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
          MAIN CONTENT
      ================================================== */}
      <section className="relative overflow-hidden px-6 py-10 lg:px-8">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-7xl">

          {/* =================================================
              BACK BUTTON
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
              Banking Activity
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Transactions
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review your banking transaction history
              and monitor your recent account activity.
            </p>

          </div>

          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="space-y-6">

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {[1, 2, 3, 4].map(
                  (item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="h-10 w-10 rounded-xl bg-slate-200" />

                      <div className="mt-5 h-4 w-24 rounded bg-slate-200" />

                      <div className="mt-3 h-7 w-16 rounded bg-slate-200" />
                    </div>
                  )
                )}

              </div>

              <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-6">

                  <div className="h-6 w-52 rounded bg-slate-200" />

                  <div className="mt-3 h-4 w-72 rounded bg-slate-100" />

                </div>

                <div className="space-y-4 p-6">

                  {[1, 2, 3, 4, 5].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-12 rounded-xl bg-slate-100"
                      />
                    )
                  )}

                </div>

              </div>

              <p className="text-center text-sm text-slate-500">
                Loading transaction history...
              </p>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================== */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
                  !
                </div>

                <div>

                  <p className="font-semibold">
                    Transactions unavailable
                  </p>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>

                  <button
                    onClick={() => {
                      setError("");
                      setLoading(true);
                      loadTransactions();
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
              TRANSACTION CONTENT
          ================================================== */}
          {!loading && !error && (
            <div className="space-y-6">

              {/* =================================================
                  SUMMARY CARDS
              ================================================== */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Total */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700">
                      ≡
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Total
                    </span>

                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Transactions
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-slate-900">
                    {totalTransactions}
                  </p>

                </div>

                {/* Successful */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg font-bold text-green-700">
                      ✓
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Completed
                    </span>

                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Successful
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-slate-900">
                    {successfulTransactions}
                  </p>

                </div>

                {/* Credit */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700">
                      ↓
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Credit
                    </span>

                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Money In
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-slate-900">
                    {creditTransactions}
                  </p>

                </div>

                {/* Debit */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-lg font-bold text-red-600">
                      ↑
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Debit
                    </span>

                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    Money Out
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-slate-900">
                    {debitTransactions}
                  </p>

                </div>

              </div>

              {/* =================================================
                  TRANSACTIONS TABLE
              ================================================== */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                {/* Table header */}
                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-sm font-semibold text-blue-700">
                      Account Activity
                    </p>

                    <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                      Transaction History
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Your transactions for the current month.
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3">

                    <p className="text-xs font-medium text-slate-400">
                      Records
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {transactions.length}
                    </p>

                  </div>

                </div>

                {/* Empty state */}
                {transactions.length === 0 ? (

                  <div className="px-6 py-16 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                      ≡
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-slate-800">
                      No Transactions
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      You do not have any transactions
                      recorded for the current month.
                      Your activity will appear here
                      once you make a transaction.
                    </p>

                    <button
                      onClick={() =>
                        router.push("/dashboard")
                      }
                      className="mt-6 rounded-xl bg-[#071a35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b2850]"
                    >
                      Back to Dashboard
                    </button>

                  </div>

                ) : (

                  /* Table */
                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                      {/* Table header */}
                      <thead className="bg-slate-50">

                        <tr>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Transaction
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Amount
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Account
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Status
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Date
                          </th>

                        </tr>

                      </thead>

                      {/* Table body */}
                      <tbody>

                        {transactions.map(
                          (
                            transaction,
                            index
                          ) => {

                            const type =
                              transaction.transactionType?.toUpperCase();

                            const isCredit =
                              type === "CREDIT";

                            const isSuccess =
                              transaction.status?.toUpperCase() ===
                              "SUCCESS";

                            return (
                              <tr
                                key={
                                  transaction.transactionId ??
                                  index
                                }
                                className="border-t border-slate-200 transition hover:bg-slate-50"
                              >

                                {/* Transaction */}
                                <td className="px-6 py-5">

                                  <div className="flex items-center gap-3">

                                    <div
                                      className={
                                        isCredit
                                          ? "flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 font-bold text-green-700"
                                          : "flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600"
                                      }
                                    >
                                      {isCredit
                                        ? "↓"
                                        : "↑"}
                                    </div>

                                    <div>

                                      <p className="font-bold text-slate-900">
                                        {transaction.transactionType ??
                                          "-"}
                                      </p>

                                      <p className="mt-1 text-xs text-slate-400">
                                        Transaction ID
                                      </p>

                                      <p className="max-w-[180px] truncate text-xs font-medium text-slate-500">
                                        {transaction.transactionId ??
                                          "-"}
                                      </p>

                                    </div>

                                  </div>

                                </td>

                                {/* Amount */}
                                <td className="px-6 py-5">

                                  <p
                                    className={
                                      isCredit
                                        ? "font-extrabold text-green-700"
                                        : "font-extrabold text-red-600"
                                    }
                                  >
                                    {isCredit
                                      ? "+"
                                      : "-"}{" "}
                                    TZS{" "}
                                    {formatAmount(
                                      transaction.amount
                                    )}
                                  </p>

                                </td>

                                {/* Account */}
                                <td className="px-6 py-5">

                                  <p className="text-sm font-semibold text-slate-700">
                                    {transaction.accountNumber ??
                                      "-"}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-400">
                                    Account Number
                                  </p>

                                </td>

                                {/* Status */}
                                <td className="px-6 py-5">

                                  <span
                                    className={
                                      isSuccess
                                        ? "inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700"
                                        : "inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700"
                                    }
                                  >

                                    <span
                                      className={
                                        isSuccess
                                          ? "h-1.5 w-1.5 rounded-full bg-green-600"
                                          : "h-1.5 w-1.5 rounded-full bg-amber-600"
                                      }
                                    />

                                    {transaction.status ??
                                      "-"}

                                  </span>

                                </td>

                                {/* Date */}
                                <td className="px-6 py-5">

                                  <p className="text-sm font-semibold text-slate-700">
                                    {formatDate(
                                      transaction.createdAt
                                    )}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-400">
                                    Transaction Date
                                  </p>

                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

              {/* =================================================
                  ACCOUNT ACTIVITY INFORMATION
              ================================================== */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#071a35] text-lg font-extrabold text-white">
                      M
                    </div>

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Secure Banking
                      </p>

                      <p className="mt-1 text-base font-bold text-slate-900">
                        Your transaction history
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Transactions displayed here are
                        retrieved securely from your MIC
                        Banking account.
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        "/dashboard"
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Back to Dashboard
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>
      </section>

      {/* =================================================
          FOOTER
      ================================================== */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">

          <div>

            <p className="text-sm font-bold text-slate-900">
              MIC Banking
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Secure digital banking platform.
            </p>

          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} MIC Banking. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}