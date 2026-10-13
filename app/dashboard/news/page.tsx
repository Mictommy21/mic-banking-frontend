"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NewsAnnouncement {
  id: number;
  title: string;
  content: string;
  audience: "ALL" | "USER" | "ADMIN";
  status: string;
  createdAt?: string;
  publishedAt?: string | null;
}

export default function NewsPage() {
  const router = useRouter();

  const [news, setNews] = useState<NewsAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:8086/api/news",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please log in again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You are not authorized to view these announcements."
          );
        }

        throw new Error(
          `Unable to load news (${response.status}).`
        );
      }

      const data: NewsAnnouncement[] = await response.json();

      setNews(
        data.filter(
          (item) => item.status?.toUpperCase() === "PUBLISHED"
        )
      );
    } catch (err) {
      console.error("News page error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchNews();
  }, [fetchNews]);

  const formatDate = (date?: string | null) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-TZ", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(parsedDate);
  };

  const openNews = (id: number) => {
    router.push(`/dashboard/news/${id}`);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071a35] text-lg font-extrabold text-white">
              M
            </span>

            <span>
              <span className="block font-extrabold text-slate-900">
                MIC Banking
              </span>
              <span className="block text-xs text-slate-500">
                Digital Banking Platform
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-8">
          <p className="text-sm font-bold text-blue-700">
            CUSTOMER INFORMATION
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            MIC Banking News
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Read the latest banking announcements, service updates
            and important information from MIC Banking.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-800">
              Unable to load news
            </h2>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => void fetchNews()}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && news.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <div className="text-4xl">📢</div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No news available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              New published announcements will appear here.
            </p>
          </div>
        )}

        {/* NEWS LIST */}
        {!loading && !error && news.length > 0 && (
          <div className="space-y-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                {news.length}{" "}
                {news.length === 1
                  ? "announcement"
                  : "announcements"}
              </p>

              <button
                type="button"
                onClick={() => void fetchNews()}
                className="text-sm font-bold text-blue-700 hover:text-blue-900"
              >
                Refresh
              </button>
            </div>

            {news.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openNews(item.id)}
                className="group block w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    PUBLISHED
                  </span>

                  <span className="text-xs text-slate-500">
                    {item.audience === "ALL"
                      ? "All customers"
                      : item.audience === "USER"
                      ? "Customer announcement"
                      : "Administrator announcement"}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-extrabold text-slate-900 transition group-hover:text-blue-700 sm:text-xl">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.content.length > 220
                    ? `${item.content.slice(0, 220).trimEnd()}...`
                    : item.content}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-500">
                    Published: {formatDate(item.publishedAt)}
                  </span>

                  <span className="text-sm font-bold text-blue-700 group-hover:underline">
                    Read full announcement →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-5 py-5 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MIC Banking. All rights reserved.
        </p>
      </footer>
    </main>
  );
}