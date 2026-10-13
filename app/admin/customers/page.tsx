"use client";

import { useEffect, useMemo, useState } from "react";

type Customer = {
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

type CustomerTransaction = {
  transactionId: string;
  transactionType: string;
  amount: number;
  accountNumber: string;
  status: string;
  createdAt: string;
  modifiedAt: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [customerTransactions, setCustomerTransactions] =
    useState<CustomerTransaction[]>([]);

  const [loading, setLoading] = useState(true);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [detailsError, setDetailsError] =
    useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  // ==========================================
  // FETCH CUSTOMERS
  // ==========================================

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication token not found.");
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
          throw new Error("Unauthorized. Please login again.");
        }

        if (response.status === 403) {
          throw new Error(
            "Access denied. Admin permission required."
          );
        }

        if (!response.ok) {
          throw new Error(
            "Failed to load customers."
          );
        }

        const data: Customer[] =
          await response.json();

        setCustomers(data);
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

    fetchCustomers();
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
  // FULL NAME
  // ==========================================

  const getFullName = (customer: Customer) => {
    return `${customer.firstName} ${customer.lastName}`;
  };

  // ==========================================
  // FINANCIAL SUMMARY
  // ==========================================

  const getCustomerTotalCredits = () => {
    return customerTransactions
      .filter(
        (transaction) =>
          transaction.transactionType.toUpperCase() ===
          "CREDIT"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  };

  const getCustomerTotalDebits = () => {
    return customerTransactions
      .filter(
        (transaction) =>
          transaction.transactionType.toUpperCase() ===
          "DEBIT"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  };

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const fullName =
        `${customer.firstName} ${customer.lastName}`
          .toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        customer.firstName
          .toLowerCase()
          .includes(searchValue) ||
        customer.lastName
          .toLowerCase()
          .includes(searchValue) ||
        customer.email
          .toLowerCase()
          .includes(searchValue) ||
        customer.accountNumber
          .toLowerCase()
          .includes(searchValue) ||
        customer.phoneNumber
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        customer.status.toUpperCase() ===
          statusFilter;

      const matchesRole =
        roleFilter === "ALL" ||
        customer.role === roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [
    customers,
    search,
    statusFilter,
    roleFilter,
  ]);

  // ==========================================
  // OPEN CUSTOMER DETAILS
  // ==========================================

  const openCustomerDetails = async (
    customer: Customer
  ) => {
    try {
      setSelectedCustomer(customer);

      setCustomerTransactions([]);

      setDetailsLoading(true);

      setDetailsError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      // ----------------------------------------
      // CUSTOMER DETAILS
      // ----------------------------------------

      const customerResponse = await fetch(
        `http://localhost:8086/admin/customers/${customer.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!customerResponse.ok) {
        throw new Error(
          "Failed to load customer details."
        );
      }

      const customerData: Customer =
        await customerResponse.json();

      setSelectedCustomer(customerData);

      // ----------------------------------------
      // CUSTOMER TRANSACTIONS
      // ----------------------------------------

      const transactionsResponse =
        await fetch(
          `http://localhost:8086/admin/customers/${customer.id}/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (!transactionsResponse.ok) {
        throw new Error(
          "Failed to load customer transactions."
        );
      }

      const transactionsData:
        CustomerTransaction[] =
        await transactionsResponse.json();

      setCustomerTransactions(
        transactionsData
      );
    } catch (err) {
      setDetailsError(
        err instanceof Error
          ? err.message
          : "Failed to load customer details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setSelectedCustomer(null);
    setCustomerTransactions([]);
    setDetailsError("");
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
            Loading customers...
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
            Unable to load customers
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
              Customers
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage and view all registered bank customers.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-slate-400">
              Total Customers
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {customers.length}
            </p>
          </div>

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
              Search Customer
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search name, email, account or phone..."
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

          {/* Role */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">
                All Roles
              </option>

              <option value="ROLE_USER">
                User
              </option>

              <option value="ROLE_ADMIN">
                Admin
              </option>
            </select>
          </div>

        </div>

      </div>

      {/* ======================================
          CUSTOMER TABLE
      ====================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-bold text-slate-900">
                Customer Accounts
              </h2>

              <p className="text-sm text-slate-500">
                {filteredCustomers.length} customer
                {filteredCustomers.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

          </div>

        </div>

        {filteredCustomers.length === 0 ? (
          <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              👤
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No customers found
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

                {filteredCustomers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Customer */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {customer.firstName
                              ?.charAt(0)
                              .toUpperCase()}
                            {customer.lastName
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-900">
                              {getFullName(
                                customer
                              )}
                            </p>

                            <p className="truncate text-sm text-slate-500">
                              {customer.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Account */}

                      <td className="px-5 py-4">

                        <p className="font-medium text-slate-900">
                          {customer.accountNumber}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {customer.role ===
                          "ROLE_ADMIN"
                            ? "Administrator"
                            : "Customer"}
                        </p>

                      </td>

                      {/* Phone */}

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {customer.phoneNumber}
                      </td>

                      {/* Balance */}

                      <td className="px-5 py-4">

                        <p className="font-semibold text-slate-900">
                          TZS{" "}
                          {formatCurrency(
                            Number(
                              customer.accountBalance ||
                                0
                            )
                          )}
                        </p>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            customer.status?.toUpperCase() ===
                            "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {customer.status}
                        </span>

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            openCustomerDetails(
                              customer
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
          CUSTOMER DETAILS MODAL
      ====================================== */}

      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={closeModal}
        >

          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-slate-50 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ==================================
                MODAL HEADER
            ================================== */}

            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                    {selectedCustomer.firstName
                      ?.charAt(0)
                      .toUpperCase()}
                    {selectedCustomer.lastName
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {getFullName(
                        selectedCustomer
                      )}
                    </h2>

                    {selectedCustomer.otherName && (
                      <p className="text-sm text-slate-500">
                        {selectedCustomer.otherName}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-slate-500">
                      Customer ID:{" "}
                      {selectedCustomer.id}
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

              {/* ==================================
                  CUSTOMER INFORMATION
              ================================== */}

              <div>

                <h3 className="mb-4 text-base font-bold text-slate-900">
                  Customer Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  {/* Account */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs text-slate-400">
                      Account Number
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                      {selectedCustomer.accountNumber}
                    </p>

                  </div>

                  {/* Balance */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs text-slate-400">
                      Account Balance
                    </p>

                    <p className="mt-2 font-bold text-blue-600">
                      TZS{" "}
                      {formatCurrency(
                        Number(
                          selectedCustomer.accountBalance ||
                            0
                        )
                      )}
                    </p>

                  </div>

                  {/* Status */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs text-slate-400">
                      Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedCustomer.status?.toUpperCase() ===
                        "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedCustomer.status}
                    </span>

                  </div>

                  {/* Role */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs text-slate-400">
                      Role
                    </p>

                    <p className="mt-2 font-semibold text-slate-900">
                      {selectedCustomer.role ===
                      "ROLE_ADMIN"
                        ? "Administrator"
                        : "Customer"}
                    </p>

                  </div>

                  {/* Email */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2">

                    <p className="text-xs text-slate-400">
                      Email
                    </p>

                    <p className="mt-2 break-all font-medium text-slate-900">
                      {selectedCustomer.email}
                    </p>

                  </div>

                  {/* Phone */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2">

                    <p className="text-xs text-slate-400">
                      Phone Number
                    </p>

                    <p className="mt-2 font-medium text-slate-900">
                      {selectedCustomer.phoneNumber}
                    </p>

                  </div>

                </div>

              </div>

              {/* ==================================
                  FINANCIAL SUMMARY
              ================================== */}

              <div className="mt-8">

                <h3 className="mb-4 text-base font-bold text-slate-900">
                  Financial Summary
                </h3>

                <div className="grid gap-4 sm:grid-cols-3">

                  {/* Total Transactions */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs text-slate-400">
                      Transactions
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {customerTransactions.length}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Total recorded
                    </p>

                  </div>

                  {/* Total Credits */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs text-slate-400">
                      Total Credits
                    </p>

                    <p className="mt-2 text-xl font-bold text-emerald-600">
                      TZS{" "}
                      {formatCurrency(
                        getCustomerTotalCredits()
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Money credited
                    </p>

                  </div>

                  {/* Total Debits */}

                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <p className="text-xs text-slate-400">
                      Total Debits
                    </p>

                    <p className="mt-2 text-xl font-bold text-red-600">
                      TZS{" "}
                      {formatCurrency(
                        getCustomerTotalDebits()
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Money deducted
                    </p>

                  </div>

                </div>

              </div>

              {/* ==================================
                  TRANSACTION HISTORY
              ================================== */}

              <div className="mt-8">

                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-base font-bold text-slate-900">
                      Transaction History
                    </h3>

                    <p className="text-sm text-slate-500">
                      Recent financial activity for this customer.
                    </p>

                  </div>

                  <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                    {customerTransactions.length} transaction
                    {customerTransactions.length !==
                    1
                      ? "s"
                      : ""}
                  </div>

                </div>

                {/* Loading */}

                {detailsLoading && (
                  <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading customer transactions...
                    </p>

                  </div>
                )}

                {/* Error */}

                {!detailsLoading &&
                  detailsError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                      <p className="text-sm font-semibold text-red-700">
                        {detailsError}
                      </p>

                    </div>
                  )}

                {/* Empty */}

                {!detailsLoading &&
                  !detailsError &&
                  customerTransactions.length ===
                    0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        📋
                      </div>

                      <p className="mt-3 font-semibold text-slate-900">
                        No transactions found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        This customer has no recorded transactions.
                      </p>

                    </div>
                  )}

                {/* Transactions Table */}

                {!detailsLoading &&
                  !detailsError &&
                  customerTransactions.length >
                    0 && (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                      <div className="overflow-x-auto">

                        <table className="min-w-full">

                          <thead className="bg-slate-50">

                            <tr className="border-b border-slate-200">

                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Date
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Type
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Amount
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                              </th>

                              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Transaction ID
                              </th>

                            </tr>

                          </thead>

                          <tbody className="divide-y divide-slate-100">

                            {customerTransactions.map(
                              (transaction) => (
                                <tr
                                  key={
                                    transaction.transactionId
                                  }
                                  className="hover:bg-slate-50"
                                >

                                  {/* Date */}

                                  <td className="px-4 py-4 text-sm text-slate-600">
                                    {formatDate(
                                      transaction.createdAt
                                    )}
                                  </td>

                                  {/* Type */}

                                  <td className="px-4 py-4">

                                    <span
                                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                        transaction.transactionType?.toUpperCase() ===
                                        "CREDIT"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {
                                        transaction.transactionType
                                      }
                                    </span>

                                  </td>

                                  {/* Amount */}

                                  <td className="px-4 py-4">

                                    <p
                                      className={`font-semibold ${
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

                                  <td className="px-4 py-4">

                                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                      {
                                        transaction.status
                                      }
                                    </span>

                                  </td>

                                  {/* Transaction ID */}

                                  <td className="px-4 py-4">

                                    <p className="max-w-[180px] truncate font-mono text-xs text-slate-500">
                                      {
                                        transaction.transactionId
                                      }
                                    </p>

                                  </td>

                                </tr>
                              )
                            )}

                          </tbody>

                        </table>

                      </div>

                    </div>
                  )}

              </div>

              {/* ==================================
                  MODAL FOOTER
              ================================== */}

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
