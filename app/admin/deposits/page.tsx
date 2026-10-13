"use client";

import { useEffect, useMemo, useState } from "react";

type Deposit = {
transactionId: string;
customerName: string;
accountNumber: string;
transactionType: string;
amount: number;
status: string;
createdAt: string;
modifiedAt: string;
};

export default function DepositsPage() {
const [deposits, setDeposits] = useState<Deposit[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");

const [selectedDeposit, setSelectedDeposit] =
useState<Deposit | null>(null);

useEffect(() => {
const fetchDeposits = async () => {
try {
setLoading(true);
setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    const response = await fetch(
      "http://localhost:8086/admin/transactions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      setError("Your session has expired. Please login again.");
      return;
    }

    if (response.status === 403) {
      setError(
        "Access denied. Only administrators can view deposits."
      );
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to load deposits.");
    }

    const data: Deposit[] = await response.json();

    const creditTransactions = data.filter(
      (transaction) =>
        transaction.transactionType?.toUpperCase() === "CREDIT"
    );

    setDeposits(creditTransactions);
  } catch (err) {
    console.error(err);
    setError("Unable to load deposits.");
  } finally {
    setLoading(false);
  }
};

fetchDeposits();

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

const filteredDeposits = useMemo(() => {
const query = search.trim().toLowerCase();

return deposits.filter((deposit) => {
  const matchesSearch =
    !query ||
    deposit.customerName?.toLowerCase().includes(query) ||
    deposit.accountNumber?.toLowerCase().includes(query) ||
    deposit.transactionId?.toLowerCase().includes(query);

  const matchesStatus =
    statusFilter === "ALL" ||
    deposit.status?.toUpperCase() === statusFilter;

  return matchesSearch && matchesStatus;
});

}, [deposits, search, statusFilter]);

const totalDeposits = useMemo(() => {
return deposits.reduce(
(total, deposit) => total + Number(deposit.amount || 0),
0
);
}, [deposits]);

const successfulDeposits = useMemo(() => {
return deposits.filter(
(deposit) =>
deposit.status?.toUpperCase() === "SUCCESS"
).length;
}, [deposits]);

const pendingDeposits = useMemo(() => {
return deposits.filter(
(deposit) =>
deposit.status?.toUpperCase() === "PENDING"
).length;
}, [deposits]);

return ( <div className="min-h-screen bg-[#f8fafc] px-5 py-6 lg:px-8">

  {/* =========================================
      PAGE HEADER
  ========================================== */}
  <div className="mb-8">

    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Deposits
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Manage and monitor money credited to customer accounts.
      </p>
    </div>

  </div>

  {/* =========================================
      SUMMARY CARDS
  ========================================== */}
  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

    {/* Total Deposits */}
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Total Deposits
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalDeposits)}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Total money credited
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
          ↓
        </div>

      </div>

    </div>

    {/* Number of Deposits */}
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Number of Deposits
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {deposits.length}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Credit transactions
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
          #
        </div>

      </div>

    </div>

    {/* Successful */}
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Successful
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {successfulDeposits}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Completed deposits
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
          ✓
        </div>

      </div>

    </div>

    {/* Pending */}
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Pending
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {pendingDeposits}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Awaiting completion
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">
          ⏳
        </div>

      </div>

    </div>

  </div>

  {/* =========================================
      MAIN CARD
  ========================================== */}
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

    {/* Toolbar */}
    <div className="border-b border-slate-200 p-5">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}
        <div className="relative w-full lg:max-w-md">

          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customer, account or transaction..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">

          <label
            htmlFor="status"
            className="text-sm font-medium text-slate-600"
          >
            Status:
          </label>

          <select
            id="status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">All</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

        </div>

      </div>

    </div>

    {/* =========================================
        TABLE
    ========================================== */}
    <div className="overflow-x-auto">

      <table className="w-full min-w-[850px]">

        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Customer
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Account
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

          {loading ? (

            <tr>
              <td
                colSpan={6}
                className="px-5 py-12 text-center text-sm text-slate-500"
              >
                Loading deposits...
              </td>
            </tr>

          ) : error ? (

            <tr>
              <td
                colSpan={6}
                className="px-5 py-12 text-center"
              >
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </td>
            </tr>

          ) : filteredDeposits.length === 0 ? (

            <tr>
              <td
                colSpan={6}
                className="px-5 py-12 text-center"
              >

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                  ↓
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No deposits found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try changing your search or filter.
                </p>

              </td>
            </tr>

          ) : (

            filteredDeposits.map((deposit) => (

              <tr
                key={deposit.transactionId}
                className="transition hover:bg-slate-50"
              >

                {/* Customer */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {deposit.customerName
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {deposit.customerName ||
                          "Unknown Customer"}
                      </p>

                      <p className="text-xs text-slate-500">
                        Deposit
                      </p>
                    </div>

                  </div>

                </td>

                {/* Account */}
                <td className="px-5 py-4">

                  <span className="font-mono text-sm text-slate-700">
                    {deposit.accountNumber}
                  </span>

                </td>

                {/* Amount */}
                <td className="px-5 py-4">

                  <span className="text-sm font-bold text-emerald-600">
                    + {formatCurrency(deposit.amount)}
                  </span>

                </td>

                {/* Status */}
                <td className="px-5 py-4">

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      deposit.status?.toUpperCase() ===
                      "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : deposit.status?.toUpperCase() ===
                          "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {deposit.status}
                  </span>

                </td>

                {/* Date */}
                <td className="px-5 py-4">

                  <span className="text-sm text-slate-600">
                    {formatDate(deposit.createdAt)}
                  </span>

                </td>

                {/* View */}
                <td className="px-5 py-4 text-right">

                  <button
                    onClick={() =>
                      setSelectedDeposit(deposit)
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    View
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

    {/* Footer */}
    {!loading &&
      !error &&
      filteredDeposits.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredDeposits.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {deposits.length}
            </span>{" "}
            deposits
          </p>

        </div>
      )}

  </div>

  {/* =========================================
      DEPOSIT DETAILS MODAL
  ========================================== */}
  {selectedDeposit && (

    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={() => setSelectedDeposit(null)}
    >

      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Deposit Details
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Transaction information
            </p>
          </div>

          <button
            onClick={() =>
              setSelectedDeposit(null)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
          >
            ✕
          </button>

        </div>

        {/* Amount */}
        <div className="border-b border-slate-200 bg-emerald-50 px-6 py-6 text-center">

          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Deposit Amount
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-700">
            + {formatCurrency(selectedDeposit.amount)}
          </p>

          <span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {selectedDeposit.status}
          </span>

        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2">

          <div>
            <p className="text-xs text-slate-500">
              Customer
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {selectedDeposit.customerName}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Account Number
            </p>

            <p className="mt-1 font-mono text-sm font-semibold text-slate-800">
              {selectedDeposit.accountNumber}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Transaction Type
            </p>

            <p className="mt-1 text-sm font-semibold text-emerald-600">
              {selectedDeposit.transactionType}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Status
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {selectedDeposit.status}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Created Date
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formatDate(selectedDeposit.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Last Modified
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formatDate(selectedDeposit.modifiedAt)}
            </p>
          </div>

          <div className="sm:col-span-2">

            <p className="text-xs text-slate-500">
              Transaction ID
            </p>

            <p className="mt-1 break-all rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-700">
              {selectedDeposit.transactionId}
            </p>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-right">

          <button
            onClick={() =>
              setSelectedDeposit(null)
            }
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
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
