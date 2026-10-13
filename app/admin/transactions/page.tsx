"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // ==========================================
  // FETCH TRANSACTIONS
  // ==========================================

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError(
            "Authentication token not found. Please login again."
          );
          return;
        }

        const response = await fetch(
          "http://localhost:8086/admin/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          throw new Error(
            "Unauthorized. Please login again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Access denied. Admin permission required."
          );
        }

        if (!response.ok) {
          throw new Error(
            "Failed to load transactions."
          );
        }

        const data: Transaction[] =
          await response.json();

        setTransactions(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-TZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  // ==========================================
  // FILTER TRANSACTIONS
  // ==========================================

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchValue ||
        transaction.customerName
          .toLowerCase()
          .includes(searchValue) ||
        transaction.accountNumber
          .toLowerCase()
          .includes(searchValue) ||
        transaction.transactionId
          .toLowerCase()
          .includes(searchValue) ||
        transaction.transactionType
          .toLowerCase()
          .includes(searchValue);

      const matchesType =
        typeFilter === "ALL" ||
        transaction.transactionType?.toUpperCase() ===
          typeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        transaction.status?.toUpperCase() ===
          statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    transactions,
    search,
    typeFilter,
    statusFilter,
  ]);

  // ==========================================
  // FINANCIAL STATISTICS
  // ==========================================

  const totalCredits = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.transactionType?.toUpperCase() ===
          "CREDIT"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  const totalDebits = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.transactionType?.toUpperCase() ===
          "DEBIT"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  const successfulTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        transaction.status?.toUpperCase() ===
        "SUCCESS"
    ).length;
  }, [transactions]);

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading transactions...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="p-6">

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <h2 className="text-lg font-bold text-red-700">
            Unable to load transactions
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6">

        <p className="text-sm font-medium text-blue-600">
          Admin Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Transactions
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor and review all banking transactions.
        </p>

      </div>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Transactions */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Transactions
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {transactions.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            All recorded transactions
          </p>

        </div>

        {/* Credits */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Credits
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            TZS{" "}
            {formatCurrency(totalCredits)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Total money credited
          </p>

        </div>

        {/* Debits */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Debits
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            TZS{" "}
            {formatCurrency(totalDebits)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Total money deducted
          </p>

        </div>

        {/* Successful */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Successful
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {successfulTransactions}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Successfully completed
          </p>

        </div>

      </div>

      {/* ======================================
          SEARCH + FILTERS
      ====================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">

          {/* Search */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search Transactions
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customer, account or transaction ID..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Type */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Transaction Type
            </label>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="ALL">
                All Types
              </option>

              <option value="CREDIT">
                Credit
              </option>

              <option value="DEBIT">
                Debit
              </option>

            </select>

          </div>

          {/* Status */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="ALL">
                All Status
              </option>

              <option value="SUCCESS">
                Success
              </option>

              <option value="FAILED">
                Failed
              </option>

              <option value="PENDING">
                Pending
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* ======================================
          TRANSACTIONS TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="font-bold text-slate-900">
            Transaction Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredTransactions.length} transaction
            {filteredTransactions.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>

        {filteredTransactions.length === 0 ? (
          <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              💳
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No transactions found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr className="border-b border-slate-200">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Account
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredTransactions.map(
                  (transaction) => (
                    <tr
                      key={
                        transaction.transactionId
                      }
                      className="transition hover:bg-slate-50"
                    >

                      {/* Customer */}

                      <td className="px-5 py-4">

                        <p className="font-semibold text-slate-900">
                          {transaction.customerName}
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                          {transaction.transactionId}
                        </p>

                      </td>

                      {/* Account */}

                      <td className="px-5 py-4">

                        <p className="font-mono text-sm font-medium text-slate-900">
                          {transaction.accountNumber}
                        </p>

                      </td>

                      {/* Type */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            transaction.transactionType?.toUpperCase() ===
                            "CREDIT"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.transactionType}
                        </span>

                      </td>

                      {/* Amount */}

                      <td className="px-5 py-4">

                        <p
                          className={`font-bold ${
                            transaction.transactionType?.toUpperCase() ===
                            "CREDIT"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.transactionType?.toUpperCase() ===
                          "CREDIT"
                            ? "+"
                            : "-"}{" "}
                          TZS{" "}
                          {formatCurrency(
                            Number(
                              transaction.amount ||
                                0
                            )
                          )}
                        </p>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            transaction.status?.toUpperCase() ===
                            "SUCCESS"
                              ? "bg-emerald-100 text-emerald-700"
                              : transaction.status?.toUpperCase() ===
                                "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.status}
                        </span>

                      </td>

                      {/* Date */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(
                          transaction.createdAt
                        )}
                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedTransaction(
                              transaction
                            )
                          }
                          className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        >
                          View
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ======================================
          TRANSACTION DETAILS MODAL
      ====================================== */}

      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={closeModal}
        >

          <div
            className="w-full max-w-2xl rounded-2xl bg-slate-50 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="border-b border-slate-200 bg-white px-6 py-5">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-sm font-medium text-blue-600">
                    Transaction Details
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {selectedTransaction.customerName}
                  </h2>

                  <p className="mt-1 font-mono text-xs text-slate-400">
                    {selectedTransaction.transactionId}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  ×
                </button>

              </div>

            </div>

            <div className="p-6">

              {/* Amount */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">

                <p className="text-sm text-slate-500">
                  Transaction Amount
                </p>

                <p
                  className={`mt-2 text-3xl font-bold ${
                    selectedTransaction.transactionType?.toUpperCase() ===
                    "CREDIT"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedTransaction.transactionType?.toUpperCase() ===
                  "CREDIT"
                    ? "+"
                    : "-"}{" "}
                  TZS{" "}
                  {formatCurrency(
                    Number(
                      selectedTransaction.amount ||
                        0
                    )
                  )}
                </p>

                <div className="mt-4">

                  <span
                    className={`inline-flex rounded-full px-4 py-1.5 text-xs font-semibold ${
                      selectedTransaction.transactionType?.toUpperCase() ===
                      "CREDIT"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {
                      selectedTransaction.transactionType
                    }
                  </span>

                </div>

              </div>

              {/* Details */}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {/* Customer */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                  <p className="text-xs text-slate-400">
                    Customer
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {
                      selectedTransaction.customerName
                    }
                  </p>

                </div>

                {/* Account */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                  <p className="text-xs text-slate-400">
                    Account Number
                  </p>

                  <p className="mt-2 font-mono font-semibold text-slate-900">
                    {
                      selectedTransaction.accountNumber
                    }
                  </p>

                </div>

                {/* Status */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                  <p className="text-xs text-slate-400">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedTransaction.status?.toUpperCase() ===
                      "SUCCESS"
                        ? "bg-emerald-100 text-emerald-700"
                        : selectedTransaction.status?.toUpperCase() ===
                          "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {
                      selectedTransaction.status
                    }
                  </span>

                </div>

                {/* Transaction Type */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                  <p className="text-xs text-slate-400">
                    Transaction Type
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {
                      selectedTransaction.transactionType
                    }
                  </p>

                </div>

                {/* Created */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                  <p className="text-xs text-slate-400">
                    Created Date
                  </p>

                  <p className="mt-2 font-medium text-slate-900">
                    {formatDate(
                      selectedTransaction.createdAt
                    )}
                  </p>

                </div>

                {/* Modified */}

                <div className="rounded-xl border border-slate-200 bg-white p-4">

                  <p className="text-xs text-slate-400">
                    Last Modified
                  </p>

                  <p className="mt-2 font-medium text-slate-900">
                    {formatDate(
                      selectedTransaction.modifiedAt
                    )}
                  </p>

                </div>

              </div>

              {/* Transaction ID */}

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

                <p className="text-xs text-slate-400">
                  Transaction ID
                </p>

                <p className="mt-2 break-all font-mono text-sm text-slate-700">
                  {
                    selectedTransaction.transactionId
                  }
                </p>

              </div>

              {/* Footer */}

              <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
