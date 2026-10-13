"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Transaction = {
  id?: string;
  transactionType: string;
  amount: number;
  accountNumber: string;
  status: string;
  createdAt: string;
  modifiedAt?: string;
};

export default function CustomerTransactionsPage() {
  const params = useParams();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerId = params.id;

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
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8086/admin/customers/${customerId}/transactions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session has expired. Please login again."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "Access denied. Only administrators can view transactions."
            );
          }

          if (response.status === 404) {
            throw new Error(
              "Customer or transactions not found."
            );
          }

          throw new Error(
            `Failed to load transactions. Status: ${response.status}`
          );
        }

        const data: Transaction[] = await response.json();

        setTransactions(data);
      } catch (err) {
        console.error("Transactions error:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load customer transactions.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchTransactions();
    }
  }, [customerId]);

  const totalCredits = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const type = transaction.transactionType.toUpperCase();

        return (
          type === "CREDIT" ||
          type === "DEPOSIT"
        );
      })
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );
  }, [transactions]);

  const totalDebits = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const type = transaction.transactionType.toUpperCase();

        return (
          type === "DEBIT" ||
          type === "WITHDRAW" ||
          type === "WITHDRAWAL"
        );
      })
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );
  }, [transactions]);

  const formatAmount = (amount: number) => {
    return `TZS ${Number(amount).toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString();
  };

  const getTransactionTypeClass = (type: string) => {
    const normalizedType = type.toUpperCase();

    if (
      normalizedType === "CREDIT" ||
      normalizedType === "DEPOSIT"
    ) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (
      normalizedType === "DEBIT" ||
      normalizedType === "WITHDRAW" ||
      normalizedType === "WITHDRAWAL"
    ) {
      return "bg-red-50 text-red-700";
    }

    if (normalizedType === "TRANSFER") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const getStatusClass = (status: string) => {
    const normalizedStatus = status.toUpperCase();

    if (
      normalizedStatus === "SUCCESS" ||
      normalizedStatus === "COMPLETED"
    ) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (
      normalizedStatus === "FAILED" ||
      normalizedStatus === "REJECTED"
    ) {
      return "bg-red-50 text-red-700";
    }

    if (
      normalizedStatus === "PENDING" ||
      normalizedStatus === "PROCESSING"
    ) {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading transactions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">
              Customer Transactions
            </h1>

            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(`/admin/customers/${customerId}`)
              }
              className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Customer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Customer Transactions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View all transactions for customer #{customerId}.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(`/admin/customers/${customerId}`)
            }
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Customer
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Transactions
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {transactions.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Credits
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {formatAmount(totalCredits)}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Debits
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {formatAmount(totalDebits)}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900">
              Transaction History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete transaction history for this customer.
            </p>
          </div>

          {transactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-600">
                No transactions found.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                This customer does not have any transactions yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Account
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction, index) => (
                    <tr
                      key={
                        transaction.id ??
                        `${transaction.createdAt}-${index}`
                      }
                      className="transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {formatDate(transaction.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getTransactionTypeClass(
                            transaction.transactionType
                          )}`}
                        >
                          {transaction.transactionType}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800">
                        {formatAmount(transaction.amount)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {transaction.accountNumber}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
