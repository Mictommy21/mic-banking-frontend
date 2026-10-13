"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AppearanceMode = "dark" | "light" | "system";

type SettingsState = {
  transactionNotifications: boolean;
  systemNotifications: boolean;
  compactMode: boolean;
  appearance: AppearanceMode;
};

const DEFAULT_SETTINGS: SettingsState = {
  transactionNotifications: true,
  systemNotifications: true,
  compactMode: false,
  appearance: "light",
};

export default function AdminSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<SettingsState>(DEFAULT_SETTINGS);

  const [backendStatus, setBackendStatus] =
    useState<"checking" | "connected" | "failed">("checking");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedSettings =
      localStorage.getItem("mic_admin_settings");

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
        });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }

    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8086/admin/test",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setBackendStatus("connected");
      } else if (
        response.status === 401 ||
        response.status === 403
      ) {
        setBackendStatus("failed");
      } else {
        setBackendStatus("failed");
      }
    } catch {
      setBackendStatus("failed");
    }
  };

  const updateSetting = (
    key:
      | "transactionNotifications"
      | "systemNotifications"
      | "compactMode",
    value: boolean
  ) => {
    const updatedSettings = {
      ...settings,
      [key]: value,
    };

    setSettings(updatedSettings);

    localStorage.setItem(
      "mic_admin_settings",
      JSON.stringify(updatedSettings)
    );

    window.dispatchEvent(
      new Event("mic-admin-settings-changed")
    );

    setMessage("Settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const updateAppearance = (
    appearance: "dark" | "light" | "system"
  ) => {
    const updatedSettings = {
      ...settings,
      appearance,
    };

    setSettings(updatedSettings);

    localStorage.setItem(
      "mic_admin_settings",
      JSON.stringify(updatedSettings)
    );

    window.dispatchEvent(
      new Event("mic-admin-settings-changed")
    );

    setMessage("Appearance setting saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie =
      "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/login");
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage administrator preferences, security and
          system configuration.
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {/* Administrator Profile */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Administrator Profile
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current administrator account information.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-3">

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Account
            </p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              Administrator
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Role
            </p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              ROLE_ADMIN
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Account Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <span className="text-lg font-semibold text-green-700">
                Active
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Security */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Security
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Authentication and backend security status.
          </p>
        </div>

        <div className="divide-y divide-gray-100">

          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="font-medium text-gray-900">
                JWT Authentication
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Admin requests use JWT authentication.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="font-medium text-gray-900">
                Backend Connection
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Connection to the MIC Banking Spring Boot API.
              </p>
            </div>

            {backendStatus === "checking" && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                Checking...
              </span>
            )}

            {backendStatus === "connected" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Connected
              </span>
            )}

            {backendStatus === "failed" && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Failed
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="font-medium text-gray-900">
                Session
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Sign out from the current administrator session.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>

        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Notifications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Control administrator notification preferences.
          </p>
        </div>

        <div className="divide-y divide-gray-100">

          {/* Transaction Notifications */}
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="font-medium text-gray-900">
                Transaction Notifications
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Receive notifications for banking transactions.
              </p>
            </div>

            <button
              onClick={() =>
                updateSetting(
                  "transactionNotifications",
                  !settings.transactionNotifications
                )
              }
              className={`relative h-6 w-11 rounded-full transition ${
                settings.transactionNotifications
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
              aria-label="Toggle transaction notifications"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  settings.transactionNotifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* System Notifications */}
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="font-medium text-gray-900">
                System Notifications
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Receive important system and security notifications.
              </p>
            </div>

            <button
              onClick={() =>
                updateSetting(
                  "systemNotifications",
                  !settings.systemNotifications
                )
              }
              className={`relative h-6 w-11 rounded-full transition ${
                settings.systemNotifications
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
              aria-label="Toggle system notifications"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  settings.systemNotifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose how the MIC Banking admin console should look.
          </p>
        </div>

        <div className="p-6">

          {/* Appearance Options */}
          <div className="grid gap-4 md:grid-cols-3">

            {/* Light */}
            <button
              type="button"
              onClick={() =>
                updateAppearance("light")
              }
              className={`rounded-2xl border-2 p-5 text-left transition ${
                settings.appearance === "light"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                ☀️
              </div>

              <h3 className="font-semibold text-gray-900">
                Light
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Clean and bright administration interface.
              </p>

              {settings.appearance === "light" && (
                <div className="mt-4 text-xs font-semibold text-blue-600">
                  ✓ Selected
                </div>
              )}
            </button>

            {/* Dark */}
            <button
              type="button"
              onClick={() =>
                updateAppearance("dark")
              }
              className={`rounded-2xl border-2 p-5 text-left transition ${
                settings.appearance === "dark"
                  ? "border-yellow-400 bg-gray-950"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-xl">
                🌙
              </div>

              <h3
                className={`font-semibold ${
                  settings.appearance === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Dark
              </h3>

              <p
                className={`mt-1 text-sm ${
                  settings.appearance === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Black and gold banking control center.
              </p>

              {settings.appearance === "dark" && (
                <div className="mt-4 text-xs font-semibold text-yellow-400">
                  ✓ Selected
                </div>
              )}
            </button>

            {/* System */}
            <button
              type="button"
              onClick={() =>
                updateAppearance("system")
              }
              className={`rounded-2xl border-2 p-5 text-left transition ${
                settings.appearance === "system"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                🖥️
              </div>

              <h3 className="font-semibold text-gray-900">
                System
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Follow your Windows or browser appearance.
              </p>

              {settings.appearance === "system" && (
                <div className="mt-4 text-xs font-semibold text-blue-600">
                  ✓ Selected
                </div>
              )}
            </button>

          </div>

          {/* Compact Mode */}
          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-5">

            <div>
              <p className="font-medium text-gray-900">
                Compact Mode
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Use a more compact layout for tables and lists.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                updateSetting(
                  "compactMode",
                  !settings.compactMode
                )
              }
              className={`relative h-6 w-11 rounded-full transition ${
                settings.compactMode
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
              aria-label="Toggle compact mode"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  settings.compactMode
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

        </div>
      </section>

      {/* System Information */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            System Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current MIC Banking application configuration.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* Frontend */}
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Frontend
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              Next.js
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Port 3000
            </p>
          </div>

          {/* Backend */}
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Backend
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              Spring Boot
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Port 8086
            </p>
          </div>

          {/* Authentication */}
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Authentication
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              JWT
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Role-based access
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}