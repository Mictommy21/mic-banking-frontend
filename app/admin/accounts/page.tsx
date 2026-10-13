"use client";

import { useEffect, useMemo, useState } from "react";

type Account = {
  id: number;
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  phoneNumber: string;
  accountNumber: string;
  accountBalance: number;
  status: string;
  role: string;
};

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [selectedAccount, setSelectedAccount] =
    useState<Account | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // ==========================================
  // FETCH ACCOUNTS
  // ==========================================

  useEffect(() => {
    const fetchAccounts = async () => {
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
          "http://localhost:8086/admin/customers",
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
            "Failed to load accounts."
          );
        }

        const data: Account[] =
          await response.json();

        setAccounts(data);
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

    fetchAccounts();
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
  // FULL NAME
  // ==========================================

  const getFullName = (account: Account) => {
    return `${account.firstName} ${account.lastName}`;
  };

  // ==========================================
  // FILTER ACCOUNTS
  // ==========================================

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const fullName =
        `${account.firstName} ${account.lastName}`
          .toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        account.firstName
          .toLowerCase()
          .includes(searchValue) ||
        account.lastName
          .toLowerCase()
          .includes(searchValue) ||
        account.email
          .toLowerCase()
          .includes(searchValue) ||
        account.accountNumber
          .toLowerCase()
          .includes(searchValue) ||
        account.phoneNumber
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        account.status?.toUpperCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    accounts,
    search,
    statusFilter,
  ]);

  // ==========================================
  // TOTAL BALANCE
  // ==========================================

  const totalBalance = useMemo(() => {
    return accounts.reduce(
      (total, account) =>
        total +
        Number(account.accountBalance || 0),
      0
    );
  }, [accounts]);

  // ==========================================
  // ACTIVE ACCOUNTS
  // ==========================================

  const activeAccounts = useMemo(() => {
    return accounts.filter(
      (account) =>
        account.status?.toUpperCase() ===
        "ACTIVE"
    ).length;
  }, [accounts]);

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setSelectedAccount(null);
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
            Loading accounts...
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
            Unable to load accounts
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

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm font-medium text-blue-600">
              Admin Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Accounts
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage customer bank accounts and balances.
            </p>

          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">

            <p className="text-xs text-slate-400">
              Total Accounts
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {accounts.length}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total Accounts */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Accounts
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {accounts.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Registered accounts
          </p>

        </div>

        {/* Active Accounts */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Active Accounts
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {activeAccounts}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Currently active
          </p>

        </div>

        {/* Total Balance */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">

          <p className="text-sm text-slate-500">
            Total Balance
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            TZS{" "}
            {formatCurrency(totalBalance)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Combined customer balances
          </p>

        </div>

      </div>

      {/* ======================================
          SEARCH + FILTER
      ====================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="grid gap-4 lg:grid-cols-[1fr_200px]">

          {/* Search */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search Account
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search account number, customer, email or phone..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

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

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* ======================================
          ACCOUNTS TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="font-bold text-slate-900">
            Bank Accounts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredAccounts.length} account
            {filteredAccounts.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>

        {filteredAccounts.length === 0 ? (
          <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              🏦
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No accounts found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or status filter.
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
                    Account Number
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Balance
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredAccounts.map(
                  (account) => (
                    <tr
                      key={account.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Customer */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {account.firstName
                              ?.charAt(0)
                              .toUpperCase()}
                            {account.lastName
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-900">
                              {getFullName(
                                account
                              )}
                            </p>

                            <p className="truncate text-sm text-slate-500">
                              {account.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Account Number */}

                      <td className="px-5 py-4">

                        <p className="font-semibold text-slate-900">
                          {account.accountNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {account.role ===
                          "ROLE_ADMIN"
                            ? "Administrator"
                            : "Customer"}
                        </p>

                      </td>

                      {/* Phone */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {account.phoneNumber}
                      </td>

                      {/* Balance */}

                      <td className="px-5 py-4">

                        <p className="font-bold text-slate-900">
                          TZS{" "}
                          {formatCurrency(
                            Number(
                              account.accountBalance ||
                                0
                            )
                          )}
                        </p>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            account.status?.toUpperCase() ===
                            "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {account.status}
                        </span>

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAccount(
                              account
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
          ACCOUNT DETAILS MODAL
      ====================================== */}

      {selectedAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={closeModal}
        >

          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-slate-50 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                    {selectedAccount.firstName
                      ?.charAt(0)
                      .toUpperCase()}
                    {selectedAccount.lastName
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <p className="text-sm font-medium text-blue-600">
                      Account Details
                    </p>

                    <h2 className="text-xl font-bold text-slate-900">
                      {getFullName(
                        selectedAccount
                      )}
                    </h2>

                    <p className="mt-1 font-mono text-sm text-slate-500">
                      {selectedAccount.accountNumber}
                    </p>

                  </div>

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

              {/* Account Overview */}

              <h3 className="mb-4 text-base font-bold text-slate-900">
                Account Overview
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Account Number */}

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <p className="text-xs text-slate-400">
                    Account Number
                  </p>

                  <p className="mt-2 font-mono text-lg font-bold text-slate-900">
                    {selectedAccount.accountNumber}
                  </p>

                </div>

                {/* Balance */}

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

                  <p className="text-xs text-blue-500">
                    Current Balance
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-700">
                    TZS{" "}
                    {formatCurrency(
                      Number(
                        selectedAccount.accountBalance ||
                          0
                      )
                    )}
                  </p>

                </div>

                {/* Status */}

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <p className="text-xs text-slate-400">
                    Account Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedAccount.status?.toUpperCase() ===
                      "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedAccount.status}
                  </span>

                </div>

                {/* Role */}

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                  <p className="text-xs text-slate-400">
                    Account Holder Role
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {selectedAccount.role ===
                    "ROLE_ADMIN"
                      ? "Administrator"
                      : "Customer"}
                  </p>

                </div>

              </div>

              {/* Customer Information */}

              <div className="mt-8">

                <h3 className="mb-4 text-base font-bold text-slate-900">
                  Account Holder
                </h3>

                <div className="rounded-xl border border-slate-200 bg-white">

                  <div className="grid gap-0 sm:grid-cols-2">

                    <div className="border-b border-slate-100 p-5 sm:border-r">
                      <p className="text-xs text-slate-400">
                        Full Name
                      </p>

                      <p className="mt-2 font-semibold text-slate-900">
                        {getFullName(
                          selectedAccount
                        )}
                      </p>
                    </div>

                    <div className="border-b border-slate-100 p-5">
                      <p className="text-xs text-slate-400">
                        Email
                      </p>

                      <p className="mt-2 break-all font-medium text-slate-900">
                        {selectedAccount.email}
                      </p>
                    </div>

                    <div className="p-5 sm:border-r">
                      <p className="text-xs text-slate-400">
                        Phone Number
                      </p>

                      <p className="mt-2 font-medium text-slate-900">
                        {selectedAccount.phoneNumber}
                      </p>
                    </div>

                    <div className="p-5">
                      <p className="text-xs text-slate-400">
                        Customer ID
                      </p>

                      <p className="mt-2 font-medium text-slate-900">
                        {selectedAccount.id}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* Notice */}

              <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4">

                <p className="text-sm font-semibold text-blue-800">
                  Account Management
                </p>

                <p className="mt-1 text-sm text-blue-700">
                  This account is linked to the customer
                  profile and its current balance is
                  retrieved directly from the banking
                  backend.
                </p>

              </div>

              {/* Footer */}

              <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">

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
