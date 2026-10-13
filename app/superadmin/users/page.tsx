"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "ROLE_USER" | "ROLE_ADMIN" | "ROLE_SUPERADMIN";

interface BankingUser {
id: number;
firstName?: string;
lastName?: string;
email?: string;
role?: UserRole | string;
}

interface ApiMessage {
message?: string;
email?: string;
detail?: string;
}

export default function SuperAdminUsersPage() {
const router = useRouter();

const [users, setUsers] = useState<BankingUser[]>([]);
const [roleDrafts, setRoleDrafts] = useState<Record<number, string>>({});
const [passwordDrafts, setPasswordDrafts] = useState<Record<number, string>>({});
const [loading, setLoading] = useState(true);
const [savingUserId, setSavingUserId] = useState<number | null>(null);
const [resettingPasswordId, setResettingPasswordId] = useState<number | null>(null);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const loadUsers = useCallback(async () => {
const token = localStorage.getItem("token");

if (!token) {
  setError("Your session has expired. Please log in again.");
  setLoading(false);
  return;
}

try {
  setLoading(true);
  setError("");
  setSuccess("");

  const response = await fetch("http://localhost:8086/superadmin/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new Error(
      "Your login token is invalid or expired. Please log out and log in again."
    );
  }

  if (response.status === 403) {
    throw new Error(
      "Access denied. The logged-in account must have ROLE_SUPERADMIN."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Failed to load users. Server returned status ${response.status}.`
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("The server returned an unexpected users response.");
  }

  const loadedUsers = data as BankingUser[];

  setUsers(loadedUsers);
  setRoleDrafts(
    Object.fromEntries(
      loadedUsers.map((user) => [user.id, user.role || "ROLE_USER"])
    ) as Record<number, string>
  );
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "An unexpected error occurred while loading users."
  );
} finally {
  setLoading(false);
}

}, []);

useEffect(() => {
void loadUsers();
}, [loadUsers]);

const handleRoleChange = (userId: number, role: string) => {
setRoleDrafts((current) => ({ ...current, [userId]: role }));
setError("");
setSuccess("");
};

const updateUserRole = async (user: BankingUser) => {
const newRole = roleDrafts[user.id];
const currentRole = user.role || "ROLE_USER";

if (!newRole || newRole === currentRole) return;

if (
  !window.confirm(
    `Change the role of ${user.email || `user #${user.id}`} from ${currentRole} to ${newRole}?`
  )
) {
  return;
}

const token = localStorage.getItem("token");

if (!token) {
  setError("Your session has expired. Please log in again.");
  return;
}

try {
  setSavingUserId(user.id);
  setError("");
  setSuccess("");

  const response = await fetch(
    `http://localhost:8086/superadmin/users/${user.id}/role`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    }
  );

  const result = await response.json().catch(() => ({} as ApiMessage));

  if (response.status === 401) {
    throw new Error("Your login token is invalid or expired. Please log in again.");
  }

  if (response.status === 403) {
    throw new Error("Access denied. Only a Superadmin can change user roles.");
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.detail ||
        `Failed to update role. Server returned status ${response.status}.`
    );
  }

  setUsers((current) =>
    current.map((item) =>
      item.id === user.id ? { ...item, role: newRole } : item
    )
  );

  setSuccess(
    `Role updated successfully for ${user.email || `user #${user.id}`}.`
  );
} catch (err) {
  setError(
    err instanceof Error ? err.message : "An unexpected error occurred."
  );

  setRoleDrafts((current) => ({
    ...current,
    [user.id]: currentRole,
  }));
} finally {
  setSavingUserId(null);
}

};

const resetUserPassword = async (user: BankingUser) => {
const newPassword = passwordDrafts[user.id] || "";


if (newPassword.length < 8) {
  setError("The new password must contain at least 8 characters.");
  setSuccess("");
  return;
}

if (
  !window.confirm(
    `Reset the password for ${user.email || `user #${user.id}`}?`
  )
) {
  return;
}

const token = localStorage.getItem("token");

if (!token) {
  setError("Your session has expired. Please log in again.");
  return;
}

try {
  setResettingPasswordId(user.id);
  setError("");
  setSuccess("");

  const response = await fetch(
    `http://localhost:8086/superadmin/users/${user.id}/password`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    }
  );

  const result = await response.json().catch(() => ({} as ApiMessage));

  if (response.status === 401) {
    throw new Error("Your login token is invalid or expired. Please log in again.");
  }

  if (response.status === 403) {
    throw new Error("Access denied. Only a Superadmin can reset user passwords.");
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.detail ||
        `Password reset failed. Server returned status ${response.status}.`
    );
  }

  setPasswordDrafts((current) => ({ ...current, [user.id]: "" }));

  setSuccess(
    `Password reset successfully for ${result.email || user.email || `user #${user.id}`}.`
  );
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "An unexpected error occurred while resetting the password."
  );
} finally {
  setResettingPasswordId(null);
}

};

const superadminCount = users.filter(
(user) => user.role === "ROLE_SUPERADMIN"
).length;

const adminCount = users.filter(
(user) => user.role === "ROLE_ADMIN"
).length;

const regularUserCount = users.filter(
(user) => user.role === "ROLE_USER"
).length;

return ( <main className="min-h-screen bg-[#080808] px-4 py-8 text-white md:px-8"> <div className="mx-auto max-w-7xl"> <header className="mb-8 flex flex-wrap items-center justify-between gap-4"> <div> <p className="text-sm font-bold tracking-[0.2em] text-yellow-400">
MIC BANKING </p> <h1 className="mt-2 text-2xl font-bold md:text-3xl">
User Management </h1> <p className="mt-2 text-sm text-gray-400">
Manage registered users, roles, and account passwords. </p> </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => router.push("/superadmin")}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => void loadUsers()}
          disabled={loading}
          className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Users"}
        </button>
      </div>
    </header>

    <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Registered Users", value: users.length },
        { label: "Regular Users", value: regularUserCount },
        { label: "Administrators", value: adminCount },
        { label: "Superadmin Accounts", value: superadminCount },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/10 bg-[#121212] p-5"
        >
          <p className="text-sm text-gray-400">{item.label}</p>
          <p className="mt-2 text-3xl font-bold text-yellow-400">
            {item.value}
          </p>
        </div>
      ))}
    </section>

    {error && (
      <div
        role="alert"
        className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
      >
        <p className="font-semibold">Operation failed</p>
        <p className="mt-1">{error}</p>
      </div>
    )}

    {success && (
      <div
        role="status"
        className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300"
      >
        {success}
      </div>
    )}

    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#121212]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="font-semibold">Registered Accounts</h2>
        <p className="mt-1 text-xs text-gray-500">
          Change a user's role or reset their password.
        </p>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-400">
          Loading registered users...
        </div>
      ) : users.length === 0 ? (
        <div className="p-10 text-center text-gray-400">
          {error
            ? "Users could not be loaded. Resolve the error above and try Refresh Users."
            : "No registered users were found."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead className="bg-[#1a1a1a] text-gray-400">
              <tr>
                <th className="px-5 py-4 font-medium">ID</th>
                <th className="px-5 py-4 font-medium">Full Name</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Current Role</th>
                <th className="px-5 py-4 font-medium">Change Role</th>
                <th className="px-5 py-4 font-medium">Role Action</th>
                <th className="px-5 py-4 font-medium">Reset Password</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {users.map((user) => {
                const currentRole = user.role || "ROLE_USER";
                const selectedRole = roleDrafts[user.id] || currentRole;
                const hasChanges = selectedRole !== currentRole;
                const isSaving = savingUserId === user.id;
                const isResetting = resettingPasswordId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="align-top transition hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4 text-gray-400">{user.id}</td>

                    <td className="px-5 py-4 font-medium">
                      {[user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-gray-300">
                      {user.email || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-yellow-500/30 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                        {currentRole}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <label
                        className="sr-only"
                        htmlFor={`role-${user.id}`}
                      >
                        Select role for user {user.id}
                      </label>
                      <select
                        id={`role-${user.id}`}
                        value={selectedRole}
                        onChange={(event) =>
                          handleRoleChange(user.id, event.target.value)
                        }
                        disabled={isSaving || isResetting}
                        className="min-w-[180px] rounded-lg border border-white/15 bg-[#080808] px-3 py-2 text-sm text-white outline-none focus:border-yellow-400 disabled:opacity-50"
                      >
                        <option value="ROLE_USER">Regular User</option>
                        <option value="ROLE_ADMIN">Administrator</option>
                        <option value="ROLE_SUPERADMIN">Superadmin</option>
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => void updateUserRole(user)}
                        disabled={
                          !hasChanges ||
                          savingUserId !== null ||
                          resettingPasswordId !== null
                        }
                        className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isSaving ? "Saving..." : "Save Role"}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex min-w-[230px] flex-col gap-2">
                        <label
                          className="sr-only"
                          htmlFor={`password-${user.id}`}
                        >
                          New password for user {user.id}
                        </label>
                        <input
                          id={`password-${user.id}`}
                          type="password"
                          autoComplete="new-password"
                          minLength={8}
                          value={passwordDrafts[user.id] || ""}
                          onChange={(event) => {
                            setPasswordDrafts((current) => ({
                              ...current,
                              [user.id]: event.target.value,
                            }));
                            setError("");
                            setSuccess("");
                          }}
                          placeholder="New password (8+ characters)"
                          disabled={isResetting || isSaving}
                          className="w-full rounded-lg border border-white/15 bg-[#080808] px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-yellow-400 disabled:opacity-50"
                        />
                        <button
                          onClick={() => void resetUserPassword(user)}
                          disabled={
                            (passwordDrafts[user.id] || "").length < 8 ||
                            resettingPasswordId !== null ||
                            savingUserId !== null
                          }
                          className="rounded-lg border border-yellow-400/40 px-3 py-2 text-xs font-bold text-yellow-400 transition hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isResetting ? "Resetting..." : "Reset Password"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>

    <p className="mt-4 text-xs leading-5 text-gray-500">
      Role changes and password resets require Superadmin authorization.
      Passwords must be hashed by the backend before storage.
    </p>
  </div>
</main>
);
}