"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardStats {
totalUsers: number;
regularUsers: number;
administrators: number;
superadminAccounts: number;
}

interface Activity {
title: string;
description: string;
user: string;
date: string;
status: "Ready" | "Pending";
}

const initialStats: DashboardStats = {
totalUsers: 0,
regularUsers: 0,
administrators: 0,
superadminAccounts: 0,
};

const activities: Activity[] = [
{
title: "User role management",
description: "Manage user access and permissions",
user: "Superadmin",
date: "Available",
status: "Ready",
},
{
title: "Password management",
description: "Manage account password resets",
user: "Superadmin",
date: "Available",
status: "Ready",
},
{
title: "Homepage content",
description: "Platform content management",
user: "Superadmin",
date: "Coming soon",
status: "Pending",
},
{
title: "News announcement",
description: "Create and publish banking announcements",
user: "Superadmin",
date: "Available",
status: "Ready",
},
];

function MetricIcon({ type }: { type: string }) {
const common = {
width: 22,
height: 22,
viewBox: "0 0 24 24",
fill: "none",
stroke: "currentColor",
strokeWidth: 1.7,
strokeLinecap: "round" as const,
strokeLinejoin: "round" as const,
};

switch (type) {
case "users":
return (
<svg {...common}> <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /> <circle cx="10" cy="7" r="4" /> <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /> </svg>
);
case "user":
return (
<svg {...common}> <circle cx="12" cy="8" r="4" /> <path d="M5 21a7 7 0 0 1 14 0" /> </svg>
);
case "shield":
return (
<svg {...common}> <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /> <path d="m9 12 2 2 4-4" /> </svg>
);
case "crown":
return (
<svg {...common}> <path d="m2 8 5 4 5-8 5 8 5-4-2 12H4L2 8z" /> <path d="M4 20h16" /> </svg>
);
default:
return (
<svg {...common}> <circle cx="12" cy="12" r="9" /> </svg>
);
}
}

function MetricCard({
title,
value,
description,
icon,
}: {
title: string;
value: number;
description: string;
icon: string;
}) {
return ( <div className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 transition hover:border-yellow-500/30"> <div className="flex items-start justify-between gap-3"> <div> <p className="text-sm text-gray-400">{title}</p> <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
{value.toLocaleString()} </p> </div>

    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-400/[0.08] text-yellow-400">
      <MetricIcon type={icon} />
    </div>
  </div>

  <p className="mt-4 text-xs text-gray-500">{description}</p>
</div>

);
}

function TrendChart() {
const points = [18, 24, 21, 34, 29, 43, 38, 51, 47, 62, 57, 73];
const width = 700;
const height = 220;
const padding = 18;
const maxValue = Math.max(...points, 1);

const coordinates = points.map((point, index) => ({
x: padding + (index / (points.length - 1)) * (width - padding * 2),
y:
height -
padding -
(point / maxValue) * (height - padding * 2),
}));

const linePath = coordinates
.map((point, index) =>
`${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
)
.join(" ");

const areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x} ${
    height - padding
  } L ${coordinates[0].x} ${height - padding} Z`;

return ( <div> <div className="mb-5 flex flex-wrap items-center justify-between gap-3"> <div> <p className="text-sm font-medium text-white">Account Growth</p> <p className="mt-1 text-xs text-gray-500">
Registration trend preview </p> </div>

    <span className="rounded-full border border-yellow-500/20 bg-yellow-400/[0.06] px-3 py-1 text-xs text-yellow-400">
      Demo data
    </span>
  </div>

  <div className="w-full overflow-hidden">
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Illustrative account growth chart"
    >
      {[0, 1, 2, 3].map((line) => {
        const y =
          padding + (line / 3) * (height - padding * 2);

        return (
          <line
            key={line}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="#292929"
            strokeWidth="1"
            strokeDasharray="4 5"
          />
        );
      })}

      <path d={areaPath} fill="rgba(250, 204, 21, 0.08)" />

      <path
        d={linePath}
        fill="none"
        stroke="#FACC15"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {coordinates.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="3"
          fill="#FACC15"
        />
      ))}
    </svg>
  </div>

  <div className="mt-4 flex justify-between text-[11px] text-gray-500">
    <span>Period start</span>
    <span>Period end</span>
  </div>

  <p className="mt-4 text-xs leading-5 text-gray-500">
    This chart uses illustrative values. Actual registration history
    will appear after connecting the account growth API.
  </p>
</div>

);
}

export default function SuperAdminPage() {
const router = useRouter();

const [stats, setStats] = useState<DashboardStats>(initialStats);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchStats = useCallback(async () => {
setLoading(true);
setError("");

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token) {
  router.replace("/login");
  return;
}

if (role && role !== "ROLE_SUPERADMIN") {
  router.replace(
    role === "ROLE_ADMIN"
      ? "/admin"
      : role === "ROLE_USER"
        ? "/dashboard"
        : "/login"
  );
  return;
}

try {
  const response = await fetch(
    "http://localhost:8086/superadmin/dashboard/stats",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie =
      "role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    router.replace("/login");
    return;
  }

  if (response.status === 403) {
    setError(
      "Access denied. Your account does not have Superadmin permission."
    );
    return;
  }

  if (!response.ok) {
    throw new Error(
      `Unable to load dashboard statistics (${response.status}).`
    );
  }

  const data = await response.json();

  setStats({
    totalUsers: Number(data.totalUsers ?? 0),
    regularUsers: Number(data.regularUsers ?? 0),
    administrators: Number(data.administrators ?? 0),
    superadminAccounts: Number(data.superadminAccounts ?? 0),
  });
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "An unexpected error occurred while loading dashboard statistics."
  );
} finally {
  setLoading(false);
}


}, [router]);

useEffect(() => {
void fetchStats();
}, [fetchStats]);

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("role");

document.cookie =
  "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
document.cookie =
  "role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

router.replace("/login");

};

return ( <main className="min-h-screen bg-[#080808] text-white"> <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#080808]/95 backdrop-blur"> <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"> <Link href="/superadmin" className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 font-bold text-black">
MIC </div>

        <div>
          <p className="text-sm font-semibold tracking-wide">
            MIC Banking
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            Superadmin Control Center
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full border border-yellow-500/20 bg-yellow-400/[0.06] px-3 py-1.5 text-xs font-medium text-yellow-400 sm:inline-flex">
          ROLE_SUPERADMIN
        </span>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:border-red-400/40 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </div>
  </header>

  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400">
          Management overview
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Admin Control Center
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
          Manage users, administrator permissions, banking announcements,
          and platform operations from one central dashboard.
        </p>
      </div>

      <button
        type="button"
        onClick={() => void fetchStats()}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-yellow-500/30 px-4 py-2.5 text-sm font-medium text-yellow-400 transition hover:bg-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-50 md:self-auto"
      >
        <span>{loading ? "Refreshing..." : "Refresh dashboard"}</span>
      </button>
    </section>

    {error && (
      <div
        role="alert"
        className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 sm:flex-row sm:items-center"
      >
        <p className="text-sm leading-6 text-red-300">{error}</p>

        <button
          type="button"
          onClick={() => void fetchStats()}
          className="self-start text-sm font-medium text-red-200 underline underline-offset-4 sm:self-center"
        >
          Try again
        </button>
      </div>
    )}

    <section
      aria-label="User statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <MetricCard
        title="Total Accounts"
        value={stats.totalUsers}
        description="All registered banking users"
        icon="users"
      />

      <MetricCard
        title="Regular Users"
        value={stats.regularUsers}
        description="Accounts with regular user access"
        icon="user"
      />

      <MetricCard
        title="Administrators"
        value={stats.administrators}
        description="Accounts with administrator access"
        icon="shield"
      />

      <MetricCard
        title="Superadmin Accounts"
        value={stats.superadminAccounts}
        description="Accounts with full management access"
        icon="crown"
      />
    </section>

    {loading && (
      <p className="mt-4 text-xs text-gray-500" aria-live="polite">
        Loading dashboard statistics...
      </p>
    )}

    <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
        <TrendChart />
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">
              Quick Actions
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Common platform management tasks
            </p>
          </div>

          <span className="text-yellow-400">
            <MetricIcon type="shield" />
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <Link
            href="/superadmin/users"
            className="flex items-center gap-4 rounded-xl border border-white/[0.08] p-4 transition hover:border-yellow-500/40 hover:bg-yellow-400/[0.03]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <MetricIcon type="users" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">
                Manage Users
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                View accounts and manage user roles
              </span>
            </span>

            <span className="text-gray-500">→</span>
          </Link>

          <Link
            href="/superadmin/news"
            className="flex items-center gap-4 rounded-xl border border-white/[0.08] p-4 transition hover:border-yellow-500/40 hover:bg-yellow-400/[0.03]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              ▤
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">
                Publish News
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Create and manage banking announcements
              </span>
            </span>

            <span className="text-gray-500">→</span>
          </Link>

          <Link
            href="/superadmin/security"
            className="flex items-center gap-4 rounded-xl border border-white/[0.08] p-4 transition hover:border-yellow-500/40 hover:bg-yellow-400/[0.03]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <MetricIcon type="shield" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">
                Security Center
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Review account access and security
              </span>
            </span>

            <span className="text-gray-500">→</span>
          </Link>
        </div>
      </div>
    </section>

    <section className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101010]">
      <div className="flex flex-col justify-between gap-2 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="text-base font-semibold">
            Platform Management
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Management capabilities and current availability
          </p>
        </div>

        <span className="text-xs text-gray-500">
          {activities.filter((activity) => activity.status === "Ready").length}{" "}
          available
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs text-gray-500">
              <th className="px-6 py-4 font-medium">Feature</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium">Availability</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((activity) => (
              <tr
                key={activity.title}
                className="border-b border-white/[0.05] last:border-0"
              >
                <td className="px-6 py-4 text-sm font-medium text-white">
                  {activity.title}
                </td>

                <td className="px-6 py-4 text-sm text-gray-400">
                  {activity.description}
                </td>

                <td className="px-6 py-4 text-sm text-gray-400">
                  {activity.user}
                </td>

                <td className="px-6 py-4 text-sm text-gray-400">
                  {activity.date}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      activity.status === "Ready"
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-gray-400/10 text-gray-400"
                    }`}
                  >
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section className="mt-8 rounded-2xl border border-yellow-500/15 bg-yellow-400/[0.03] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-400/[0.08] text-yellow-400">
          <MetricIcon type="shield" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-yellow-300">
            Security Notice
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Superadmin operations should be restricted to authorized
            accounts. The backend must enforce role permissions for every
            management endpoint. Account Growth currently uses demo data;
            it is not a live registration report.
          </p>
        </div>
      </div>
    </section>

    <footer className="mt-10 border-t border-white/[0.08] py-6 text-center text-xs text-gray-600">
      MIC Banking Management Console
    </footer>
  </div>
</main>

);
}
