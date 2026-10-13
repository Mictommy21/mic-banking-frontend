"use client";

import { useEffect, useMemo, useState } from "react";

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
transactionType: string;
amount: number;
status: string;
createdAt: string;
modifiedAt: string;
};

export default function ReportsPage() {
const [stats, setStats] =
useState<DashboardStats | null>(null);

const [transactions, setTransactions] =
useState<Transaction[]>([]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchReports = async () => {
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

    const [dashboardResponse, transactionsResponse] =
      await Promise.all([
        fetch(
          "http://localhost:8086/admin/dashboard",
          { headers }
        ),

        fetch(
          "http://localhost:8086/admin/transactions",
          { headers }
        ),
      ]);

    if (
      dashboardResponse.status === 401 ||
      transactionsResponse.status === 401
    ) {
      setError(
        "Your session has expired. Please login again."
      );
      return;
    }

    if (
      dashboardResponse.status === 403 ||
      transactionsResponse.status === 403
    ) {
      setError(
        "Access denied. Only administrators can view reports."
      );
      return;
    }

    if (
      !dashboardResponse.ok ||
      !transactionsResponse.ok
    ) {
      throw new Error("Failed to load reports.");
    }

    const dashboardData =
      await dashboardResponse.json();

    const transactionsData =
      await transactionsResponse.json();

    setStats(dashboardData);
    setTransactions(transactionsData);
  } catch (err) {
    console.error(err);
    setError("Unable to load reports and analytics.");
  } finally {
    setLoading(false);
  }
};

fetchReports();

}, []);

const formatCurrency = (amount: number) => {
return new Intl.NumberFormat("en-TZ", {
style: "currency",
currency: "TZS",
maximumFractionDigits: 0,
}).format(amount);
};

const formatDate = (date: string) => {
if (!date) return "-";

return new Date(date).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

};

const successfulCount = useMemo(() => {
return transactions.filter(
(transaction) =>
transaction.status?.toUpperCase() === "SUCCESS"
).length;
}, [transactions]);

const failedCount = useMemo(() => {
return transactions.filter(
(transaction) =>
transaction.status?.toUpperCase() === "FAILED"
).length;
}, [transactions]);

const pendingCount = useMemo(() => {
return transactions.filter(
(transaction) =>
transaction.status?.toUpperCase() === "PENDING"
).length;
}, [transactions]);

const creditCount = useMemo(() => {
return transactions.filter(
(transaction) =>
transaction.transactionType?.toUpperCase() === "CREDIT"
).length;
}, [transactions]);

const debitCount = useMemo(() => {
return transactions.filter(
(transaction) =>
transaction.transactionType?.toUpperCase() === "DEBIT"
).length;
}, [transactions]);

const creditPercentage = useMemo(() => {
if (!transactions.length) return 0;

return Math.round(
  (creditCount / transactions.length) * 100
);

}, [creditCount, transactions.length]);

const debitPercentage = useMemo(() => {
if (!transactions.length) return 0;

return Math.round(
  (debitCount / transactions.length) * 100
);

}, [debitCount, transactions.length]);

const successPercentage = useMemo(() => {
if (!transactions.length) return 0;

return Math.round(
  (successfulCount / transactions.length) * 100
);

}, [successfulCount, transactions.length]);

const recentTransactions = transactions.slice(0, 8);

if (loading) {
return ( <div className="min-h-screen bg-[#f8fafc] px-5 py-8 lg:px-8">

    <div className="mb-8">
      <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-96 animate-pulse rounded bg-slate-200" />
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-32 animate-pulse rounded-xl bg-white shadow-sm"
        />
      ))}
    </div>

  </div>
);

}

if (error) {
return ( <div className="min-h-screen bg-[#f8fafc] px-5 py-8 lg:px-8">

    <div className="rounded-xl border border-red-200 bg-red-50 p-6">

      <h1 className="text-lg font-bold text-red-700">
        Reports unavailable
      </h1>

      <p className="mt-2 text-sm text-red-600">
        {error}
      </p>

    </div>

  </div>
);

}

if (!stats) {
return null;
}

return ( <div className="min-h-screen bg-[#f8fafc] px-5 py-6 lg:px-8">

  {/* =========================================
      HEADER
  ========================================== */}
  <div className="mb-8">

    <h1 className="text-2xl font-bold text-slate-900">
      Reports & Analytics
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Overview and performance analytics of your banking system.
    </p>

  </div>

  {/* =========================================
      OVERVIEW CARDS
  ========================================== */}
  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

    {/* Customers */}
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        Total Customers
      </p>

      <div className="mt-3 flex items-end justify-between">

        <div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalCustomers}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Registered customers
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
          👥
        </div>

      </div>

    </div>

    {/* Accounts */}
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        Total Accounts
      </p>

      <div className="mt-3 flex items-end justify-between">

        <div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalAccounts}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Bank accounts
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
          🏦
        </div>

      </div>

    </div>

    {/* Transactions */}
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        Total Transactions
      </p>

      <div className="mt-3 flex items-end justify-between">

        <div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.totalTransactions}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            All transactions
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
          ⇄
        </div>

      </div>

    </div>

    {/* Balance */}
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        Total Balance
      </p>

      <div className="mt-3">

        <p className="text-2xl font-bold text-slate-900">
          {formatCurrency(stats.totalBalance)}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Customer account balances
        </p>

      </div>

    </div>

  </div>

  {/* =========================================
      FINANCIAL OVERVIEW
  ========================================== */}
  <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

    {/* Credits / Deposits */}
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Total Deposits
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatCurrency(stats.totalCredits)}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
          ↓
        </div>

      </div>

      <div className="mt-6">

        <div className="mb-2 flex justify-between text-xs">

          <span className="text-slate-500">
            Credit transactions
          </span>

          <span className="font-semibold text-slate-700">
            {creditCount}
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

          <div
            className="h-full rounded-full bg-emerald-500"
            style={{
              width: `${creditPercentage}%`,
            }}
          />

        </div>

        <p className="mt-2 text-xs text-slate-400">
          {creditPercentage}% of all transactions
        </p>

      </div>

    </div>

    {/* Debits / Withdrawals */}
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Total Withdrawals
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {formatCurrency(stats.totalDebits)}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
          ↑
        </div>

      </div>

      <div className="mt-6">

        <div className="mb-2 flex justify-between text-xs">

          <span className="text-slate-500">
            Debit transactions
          </span>

          <span className="font-semibold text-slate-700">
            {debitCount}
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

          <div
            className="h-full rounded-full bg-red-500"
            style={{
              width: `${debitPercentage}%`,
            }}
          />

        </div>

        <p className="mt-2 text-xs text-slate-400">
          {debitPercentage}% of all transactions
        </p>

      </div>

    </div>

  </div>

  {/* =========================================
      TRANSACTION HEALTH
  ========================================== */}
  <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

    {/* Successful */}
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
          ✓
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Successful Transactions
          </p>

          <p className="text-2xl font-bold text-slate-900">
            {successfulCount}
          </p>

        </div>

      </div>

      <div className="mt-5">

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

          <div
            className="h-full rounded-full bg-green-500"
            style={{
              width: `${successPercentage}%`,
            }}
          />

        </div>

        <p className="mt-2 text-xs text-slate-500">
          {successPercentage}% success rate
        </p>

      </div>

    </div>

    {/* Failed */}
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
          !
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Failed Transactions
          </p>

          <p className="text-2xl font-bold text-slate-900">
            {failedCount}
          </p>

        </div>

      </div>

      <p className="mt-5 text-xs text-slate-500">
        Transactions that were not completed successfully.
      </p>

    </div>

    {/* Pending */}
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">
          ⏳
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Pending Transactions
          </p>

          <p className="text-2xl font-bold text-slate-900">
            {pendingCount}
          </p>

        </div>

      </div>

      <p className="mt-5 text-xs text-slate-500">
        Transactions waiting for completion.
      </p>

    </div>

  </div>

  {/* =========================================
      RECENT ACTIVITY
  ========================================== */}
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Recent Transaction Activity
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Latest banking transactions
        </p>
      </div>

      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        {transactions.length} total
      </span>

    </div>

    <div className="overflow-x-auto">

      <table className="w-full min-w-[750px]">

        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Customer
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Account
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Type
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Amount
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">

          {recentTransactions.map((transaction) => {

            const isCredit =
              transaction.transactionType?.toUpperCase() ===
              "CREDIT";

            return (
              <tr
                key={transaction.transactionId}
                className="transition hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <p className="text-sm font-semibold text-slate-800">
                    {transaction.customerName}
                  </p>

                </td>

                <td className="px-6 py-4">

                  <span className="font-mono text-xs text-slate-600">
                    {transaction.accountNumber}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isCredit
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transaction.transactionType}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <span
                    className={`text-sm font-bold ${
                      isCredit
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {isCredit ? "+" : "-"}{" "}
                    {formatCurrency(transaction.amount)}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      transaction.status?.toUpperCase() ===
                      "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : transaction.status?.toUpperCase() ===
                          "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transaction.status}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <span className="text-sm text-slate-600">
                    {formatDate(transaction.createdAt)}
                  </span>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>

  </div>

</div>
);
}
