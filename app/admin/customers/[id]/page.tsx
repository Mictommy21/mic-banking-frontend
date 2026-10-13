"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = params.id;

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication token not found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8086/admin/customers/${id}`,
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
              "Access denied. Only administrators can view customer details."
            );
          }

          if (response.status === 404) {
            throw new Error("Customer not found.");
          }

          throw new Error(
            `Failed to fetch customer. Status: ${response.status}`
          );
        }

        const data: Customer = await response.json();

        setCustomer(data);
      } catch (err) {
        console.error("Customer details error:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load customer details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading customer...
        </p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
          <p className="text-red-600">
            {error || "Customer not found."}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Customer Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View customer account information and transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </button>
        </div>

        {/* Customer information */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              {customer.firstName}{" "}
              {customer.otherName
                ? `${customer.otherName} `
                : ""}
              {customer.lastName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Customer ID: {customer.id}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                First Name
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {customer.firstName}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Other Name
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {customer.otherName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Last Name
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {customer.lastName}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {customer.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Phone Number
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {customer.phoneNumber}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Account Number
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {customer.accountNumber}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Balance
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                TZS{" "}
                {Number(customer.accountBalance).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {customer.status}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Role
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {customer.role}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/admin/customers/${customer.id}/transactions`
                )
              }
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
