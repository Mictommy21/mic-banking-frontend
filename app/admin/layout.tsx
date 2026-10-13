"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

type AdminSettings = {
  transactionNotifications: boolean;
  systemNotifications: boolean;
  compactMode: boolean;
  appearance?: "dark" | "light" | "system";
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [appearance, setAppearance] =
    useState<"dark" | "light" | "system">("dark");

  const [darkMode, setDarkMode] = useState(false);

  const [compactMode, setCompactMode] = useState(false);

  /*
   * =========================================
   * LOAD ADMIN SETTINGS
   * =========================================
   */
  const loadAdminSettings = () => {
    try {
      const savedSettings =
        localStorage.getItem("mic_admin_settings");

      if (!savedSettings) {
        setAppearance("light");
        setDarkMode(false);
        setCompactMode(false);
        return;
      }

      const settings: AdminSettings =
        JSON.parse(savedSettings);

      /*
       * =========================================
       * APPEARANCE
       * =========================================
       */

      const selectedAppearance =
        settings.appearance || "light";

      setAppearance(selectedAppearance);

      if (selectedAppearance === "dark") {
        setDarkMode(true);
      } else if (selectedAppearance === "light") {
        setDarkMode(false);
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        setDarkMode(prefersDark);
      }

      /*
       * =========================================
       * COMPACT MODE
       * =========================================
       */

      setCompactMode(
        settings.compactMode === true
      );
    } catch (error) {
      console.error(
        "Failed to load admin settings:",
        error
      );

      setAppearance("light");
      setDarkMode(false);
      setCompactMode(false);
    }
  };

  /*
   * =========================================
   * LOAD SETTINGS + LISTEN FOR CHANGES
   * =========================================
   */
  useEffect(() => {
    loadAdminSettings();

    const handleSettingsChange = () => {
      loadAdminSettings();
    };

    window.addEventListener(
      "mic-admin-settings-changed",
      handleSettingsChange
    );

    return () => {
      window.removeEventListener(
        "mic-admin-settings-changed",
        handleSettingsChange
      );
    };
  }, []);

  /*
   * =========================================
   * SYSTEM THEME CHANGE
   * =========================================
   */
  useEffect(() => {
    if (appearance !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = (
      event: MediaQueryListEvent
    ) => {
      setDarkMode(event.matches);
    };

    setDarkMode(mediaQuery.matches);

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, [appearance]);

  /*
   * =========================================
   * LOGOUT
   * =========================================
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";

    router.push("/login");
  };

  /*
   * =========================================
   * NAVIGATION
   * =========================================
   */
  const navigateTo = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  /*
   * =========================================
   * ACTIVE MENU
   * =========================================
   */
  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(path);
  };

  /*
   * =========================================
   * MENU ITEM STYLE
   * =========================================
   */
  const menuItemClass = (path: string) =>
    `mb-1 flex w-full items-center gap-3 rounded-lg px-4 ${
      compactMode ? "py-2" : "py-3"
    } text-left text-sm transition ${
      isActive(path)
        ? "bg-blue-600 font-semibold text-white shadow-sm"
        : "font-medium text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div
      className={`admin-console min-h-screen ${
        darkMode
          ? "admin-theme-dark"
          : "admin-theme-light"
      } ${
        compactMode
          ? "admin-compact"
          : ""
      }`}
    >
      {/* =========================================
          MOBILE OVERLAY
      ========================================== */}
      {mobileMenuOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================== */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[260px]
          flex-col bg-[#0f1f38] text-white
          transition-transform duration-300
          lg:z-40 lg:translate-x-0
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-start justify-between border-b border-white/10 px-6 ${
            compactMode ? "py-4" : "py-6"
          }`}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-400">
              MIC Banking
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Management Console
            </p>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 overflow-y-auto px-3 ${
            compactMode ? "py-3" : "py-5"
          }`}
        >
          <p
            className={`px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 ${
              compactMode ? "mb-2" : "mb-3"
            }`}
          >
            Main Menu
          </p>

          {/* Dashboard */}
          <button
            onClick={() =>
              navigateTo("/admin/dashboard")
            }
            className={menuItemClass("/admin")}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isActive("/admin")
                  ? "bg-white/10"
                  : "bg-blue-500/10 text-blue-400"
              }`}
            >
              ⌂
            </span>

            Dashboard
          </button>

          {/* Customers */}
          <button
            onClick={() =>
              navigateTo("/admin/customers")
            }
            className={menuItemClass(
              "/admin/customers"
            )}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isActive("/admin/customers")
                  ? "bg-white/10"
                  : "bg-blue-500/10 text-blue-400"
              }`}
            >
              👥
            </span>

            Customers
          </button>

          {/* Accounts */}
          <button
            onClick={() =>
              navigateTo("/admin/accounts")
            }
            className={menuItemClass(
              "/admin/accounts"
            )}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isActive("/admin/accounts")
                  ? "bg-white/10"
                  : "bg-green-500/10 text-green-400"
              }`}
            >
              🏦
            </span>

            Accounts
          </button>

          {/* Transactions */}
          <button
            onClick={() =>
              navigateTo("/admin/transactions")
            }
            className={menuItemClass(
              "/admin/transactions"
            )}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isActive("/admin/transactions")
                  ? "bg-white/10"
                  : "bg-purple-500/10 text-purple-400"
              }`}
            >
              ⇄
            </span>

            Transactions
          </button>

          {/* Deposits */}
          <button
            onClick={() =>
              navigateTo("/admin/deposits")
            }
            className={menuItemClass(
              "/admin/deposits"
            )}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isActive("/admin/deposits")
                  ? "bg-white/10"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              ↓
            </span>

            Deposits
          </button>

          {/* Withdrawals */}
          <button
            onClick={() =>
              navigateTo("/admin/withdrawals")
            }
            className={menuItemClass(
              "/admin/withdrawals"
            )}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isActive("/admin/withdrawals")
                  ? "bg-white/10"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              ↑
            </span>

            Withdrawals
          </button>

          {/* Reports */}
          <button
            onClick={() =>
              navigateTo("/admin/reports")
            }
            className={menuItemClass(
              "/admin/reports"
            )}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isActive("/admin/reports")
                  ? "bg-white/10"
                  : "bg-pink-500/10 text-pink-400"
              }`}
            >
              ▥
            </span>

            Reports & Analytics
          </button>

          {/* Divider */}
          <div
            className={`border-t border-white/10 ${
              compactMode ? "my-4" : "my-6"
            }`}
          />

          <p
            className={`px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 ${
              compactMode ? "mb-2" : "mb-3"
            }`}
          >
            System
          </p>

          {/* Settings */}
          <button
            onClick={() =>
              navigateTo("/admin/settings")
            }
            className={menuItemClass(
              "/admin/settings"
            )}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                isActive("/admin/settings")
                  ? "bg-white/10"
                  : "bg-slate-500/10"
              }`}
            >
              ⚙
            </span>

            Settings
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-4 ${
              compactMode ? "py-2" : "py-3"
            } text-left text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/10">
              ↪
            </span>

            Logout
          </button>
        </nav>

        {/* Admin Profile */}
        <div
          className={`border-t border-white/10 ${
            compactMode ? "p-2" : "p-4"
          }`}
        >
          <div
            className={`flex items-center gap-3 rounded-lg bg-white/5 ${
              compactMode ? "p-2" : "p-3"
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Administrator
              </p>

              <p className="text-xs text-slate-400">
                ROLE_ADMIN
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================
          MAIN AREA
      ========================================== */}
      <div className="lg:ml-[260px]">
        {/* Top Header */}
        <header
          className={`sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm lg:px-8 ${
            compactMode
              ? "h-[60px]"
              : "h-[72px]"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden">
              <h1 className="text-xl font-bold text-blue-700">
                MIC Banking
              </h1>

              <p className="text-[10px] text-slate-400">
                Management Console
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block">
              <p className="text-sm text-slate-500">
                Management Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification */}
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              title="Notifications"
            >
              ♧

              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                0
              </span>
            </button>

            {/* Admin */}
            <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                A
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Administrator
                </p>

                <p className="text-xs text-slate-500">
                  Admin Account
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className={
            compactMode
              ? "admin-compact-content"
              : ""
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}