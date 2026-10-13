"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type NewsAnnouncement = {
  id: number;
  title: string;
  content: string;
  audience: "ALL" | "USER" | "ADMIN";
  status: string;
  createdAt?: string;
  publishedAt?: string | null;
};

export default function NewsAnnouncements() {
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
        setError("Please log in to view banking announcements.");
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
            "You are not authorized to view announcements."
          );
        }

        throw new Error(
          `Unable to load announcements (${response.status}).`
        );
      }

      const data: NewsAnnouncement[] = await response.json();

      setNews(
        data.filter(
          (item) => item.status?.toUpperCase() === "PUBLISHED"
        )
      );
    } catch (err) {
      console.error("News announcements error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  }, []);

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

  const featuredNews = news[0];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* NEWS HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
            📢
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              MIC Banking News
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest announcements and updates
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void fetchNews()}
          disabled={loading}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="p-5 sm:p-6">
        {/* LOADING */}
        {loading && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-6 w-3/4 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-2/3 rounded bg-slate-100" />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => void fetchNews()}
              className="mt-3 text-sm font-bold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && news.length === 0 && (
          <div className="rounded-xl bg-slate-50 px-5 py-7 text-center">
            <p className="font-semibold text-slate-700">
              No announcements available
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Published banking news will appear here.
            </p>
          </div>
        )}

        {/* FEATURED NEWS PREVIEW */}
        {!loading && !error && featuredNews && (
          <div>
            <button
              type="button"
              onClick={() => openNews(featuredNews.id)}
              className="group block w-full rounded-xl border border-slate-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  PUBLISHED
                </span>

                {featuredNews.audience === "ALL" && (
                  <span className="text-xs text-slate-500">
                    All customers
                  </span>
                )}

                {featuredNews.audience === "USER" && (
                  <span className="text-xs text-slate-500">
                    Customer announcement
                  </span>
                )}

                {featuredNews.audience === "ADMIN" && (
                  <span className="text-xs text-slate-500">
                    Administrator announcement
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-lg font-bold leading-6 text-slate-900 transition group-hover:text-blue-700">
                {featuredNews.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {featuredNews.content.length > 180
                  ? `${featuredNews.content.slice(0, 180).trimEnd()}...`
                  : featuredNews.content}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-500">
                  {formatDate(featuredNews.publishedAt)}
                </span>

                <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                  Read news
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </button>

            {/* VIEW ALL NEWS */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                {news.length} published{" "}
                {news.length === 1 ? "announcement" : "announcements"}
              </p>

              <button
                type="button"
                onClick={() => router.push("/dashboard/news")}
                className="rounded-lg bg-[#071a35] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b2850]"
              >
                View all news →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}