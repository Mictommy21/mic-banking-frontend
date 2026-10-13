"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NewsAnnouncements from "@/app/components/NewsAnnouncements";


type DashboardStats = {
  totalCustomers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalBalance: number;
  totalCredits: number;
  totalDebits: number;
  successfulTransactions: number;
  activeCustomers: number;
};

type Transaction = {
  transactionId: string;
  customerName: string;
  accountNumber: string;
  transactionType: "CREDIT" | "DEBIT";
  amount: number;
  status: string;
  createdAt: string;
  modifiedAt: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<DashboardStats | null>(null);

  const [recentTransactions, setRecentTransactions] =
    useState<Transaction[]>([]);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // ==========================================
        // LOAD DASHBOARD STATISTICS
        // ==========================================

        const dashboardResponse = await fetch(
          "http://localhost:8086/admin/dashboard",
          {
            method: "GET",
            headers,
          }
        );

        if (!dashboardResponse.ok) {
          if (dashboardResponse.status === 401) {
            throw new Error(
              "Unauthorized. Please login again."
            );
          }

          if (dashboardResponse.status === 403) {
            throw new Error(
              "Access denied. Admin permission required."
            );
          }

          throw new Error(
            `Failed to load dashboard. Status: ${dashboardResponse.status}`
          );
        }

        const dashboardData: DashboardStats =
          await dashboardResponse.json();

        setDashboard(dashboardData);

        // ==========================================
        // LOAD RECENT TRANSACTIONS
        // ==========================================

        const transactionsResponse = await fetch(
          "http://localhost:8086/admin/transactions",
          {
            method: "GET",
            headers,
          }
        );

        if (!transactionsResponse.ok) {
          throw new Error(
            `Failed to load transactions. Status: ${transactionsResponse.status}`
          );
        }

        const transactionsData: Transaction[] =
          await transactionsResponse.json();

        // Backend already returns newest transactions first.
        // We only display the latest 5 here.
        setRecentTransactions(
          transactionsData.slice(0, 5)
        );
      } catch (err) {
        console.error("Dashboard error:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-TZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8fafc] px-5 py-6 lg:px-8">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your banking system.
        </p>
      </div>

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Customers */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Customers
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {loading
                  ? "..."
                  : dashboard?.totalCustomers ?? 0}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Registered customers
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600">
              👥
            </div>

          </div>
        </div>

        {/* Total Accounts */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Accounts
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {loading
                  ? "..."
                  : dashboard?.totalAccounts ?? 0}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Bank accounts
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-xl text-emerald-600">
              🏦
            </div>

          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Transactions
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {loading
                  ? "..."
                  : dashboard?.totalTransactions ?? 0}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Total transactions
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-xl text-purple-600">
              ⇄
            </div>

          </div>
        </div>

        {/* Total Balance */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Balance
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                {loading
                  ? "..."
                  : formatCurrency(
                      dashboard?.totalBalance ?? 0
                    )}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Customer account balances
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-sm font-bold text-amber-600">
              TZS
            </div>

          </div>
        </div>

      </div>

      {/* ==========================================
          FINANCIAL SUMMARY
      ========================================== */}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Credits */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Total Credits
          </p>

          <h2 className="mt-3 text-2xl font-bold text-emerald-600">
            {loading
              ? "..."
              : formatCurrency(
                  dashboard?.totalCredits ?? 0
                )}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Money credited to accounts
          </p>

        </div>

        {/* Debits */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Total Debits
          </p>

          <h2 className="mt-3 text-2xl font-bold text-red-600">
            {loading
              ? "..."
              : formatCurrency(
                  dashboard?.totalDebits ?? 0
                )}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Money deducted from accounts
          </p>

        </div>

        {/* Successful Transactions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Successful Transactions
          </p>

          <h2 className="mt-3 text-2xl font-bold text-blue-600">
            {loading
              ? "..."
              : dashboard?.successfulTransactions ?? 0}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Successfully completed
          </p>

        </div>

        {/* Active Customers */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Active Customers
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {loading
              ? "..."
              : dashboard?.activeCustomers ?? 0}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Currently active accounts
          </p>

        </div>

      </div>

      {/* ==========================================
          MAIN GRID
      ========================================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        {/* Welcome */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm font-medium text-blue-600">
                Management Console
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Welcome, Administrator
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Manage customers, accounts and banking
                transactions from your administration console.
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-600">
              A
            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-base font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-4 space-y-2">

            <button
              onClick={() =>
                router.push("/admin/customers")
              }
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span>View Customers</span>
              <span className="text-blue-600">→</span>
            </button>

            <button
              onClick={() =>
                router.push("/admin/accounts")
              }
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span>View Accounts</span>
              <span className="text-blue-600">→</span>
            </button>

            <button
              onClick={() =>
                router.push("/admin/transactions")
              }
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span>View Transactions</span>
              <span className="text-blue-600">→</span>
            </button>

          </div>

        </div>

      </div>

      {/* ==========================================
          RECENT ACTIVITY
      ========================================== */}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest banking activity
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/admin/transactions")
            }
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div className="px-6 py-10 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading recent transactions...
            </p>

          </div>
        )}

        {/* Empty State */}
        {!loading && recentTransactions.length === 0 && (
          <div className="px-6 py-10 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
              ⇄
            </div>

            <p className="mt-3 text-sm font-medium text-slate-600">
              No recent transactions
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Transaction activity will appear here.
            </p>

          </div>
        )}

        {/* Transactions */}
        {!loading && recentTransactions.length > 0 && (
          <div className="divide-y divide-slate-100">

            {recentTransactions.map((transaction) => {

              const isCredit =
                transaction.transactionType === "CREDIT";

              return (
                <div
                  key={transaction.transactionId}
                  className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >

                  {/* Transaction Left Side */}
                  <div className="flex min-w-0 items-center gap-4">

                    {/* Credit / Debit Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                        isCredit
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {isCredit ? "+" : "−"}
                    </div>

                    {/* Customer Information */}
                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-slate-900">
                        {transaction.customerName ||
                          "Unknown Customer"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {transaction.accountNumber}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">

                        {/* Type */}
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            isCredit
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {transaction.transactionType}
                        </span>

                        {/* Status */}
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            transaction.status === "SUCCESS"
                              ? "bg-blue-50 text-blue-700"
                              : transaction.status === "FAILED"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {transaction.status}
                        </span>

                        {/* Date */}
                        <span className="text-[11px] text-slate-400">
                          {formatDate(transaction.createdAt)}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Transaction Right Side */}
                  <div className="flex items-center justify-between gap-4 sm:justify-end">

                    {/* Amount */}
                    <p
                      className={`text-sm font-bold ${
                        isCredit
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {isCredit ? "+" : "-"}{" "}
                      {formatCurrency(transaction.amount)}
                    </p>

                    {/* View */}
                    <button
                      onClick={() =>
                        setSelectedTransaction(transaction)
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                    >
                      View
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* ==========================================
          TRANSACTION DETAILS MODAL
      ========================================== */}

      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setSelectedTransaction(null)}
        >

          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Transaction Details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complete transaction information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedTransaction(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* Transaction Amount */}
            <div className="px-6 pt-6">

              <div className="rounded-xl bg-slate-50 p-5 text-center">

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Transaction Amount
                </p>

                <p
                  className={`mt-2 text-3xl font-bold ${
                    selectedTransaction.transactionType ===
                    "CREDIT"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedTransaction.transactionType ===
                  "CREDIT"
                    ? "+"
                    : "-"}{" "}
                  {formatCurrency(
                    selectedTransaction.amount
                  )}
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedTransaction.transactionType ===
                    "CREDIT"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {selectedTransaction.transactionType}
                </span>

              </div>

            </div>

            {/* Transaction Details */}
            <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">

              {/* Customer */}
              <div>
                <p className="text-xs text-slate-400">
                  Customer
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedTransaction.customerName ||
                    "Unknown Customer"}
                </p>
              </div>

              {/* Account */}
              <div>
                <p className="text-xs text-slate-400">
                  Account Number
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedTransaction.accountNumber}
                </p>
              </div>

              {/* Transaction ID */}
              <div>
                <p className="text-xs text-slate-400">
                  Transaction ID
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-700">
                  {selectedTransaction.transactionId}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-slate-400">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    selectedTransaction.status ===
                    "SUCCESS"
                      ? "bg-emerald-50 text-emerald-700"
                      : selectedTransaction.status ===
                        "FAILED"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              {/* Created Date */}
              <div>
                <p className="text-xs text-slate-400">
                  Created Date
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDate(
                    selectedTransaction.createdAt
                  )}
                </p>
              </div>

              {/* Last Modified */}
              <div>
                <p className="text-xs text-slate-400">
                  Last Modified
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDate(
                    selectedTransaction.modifiedAt
                  )}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 px-6 py-4">

              <button
                onClick={() =>
                  setSelectedTransaction(null)
                }
                className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
