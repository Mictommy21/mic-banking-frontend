"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface NewsAnnouncement {
  id: number | string;
  title: string;
  content: string;
  audience?: string;
  status?: string;
  publishedAt?: string;
  createdAt?: string;
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const newsId = params.id;

  const [news, setNews] = useState<NewsAnnouncement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNewsDetail = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8086/api/news", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (response.status === 403) {
        throw new Error("You do not have permission to view this announcement.");
      }

      if (!response.ok) {
        throw new Error("Failed to load the announcement. Please try again.");
      }

      const data: NewsAnnouncement[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an unexpected response.");
      }

      const selectedNews = data.find(
        (item) => String(item.id) === String(newsId)
      );

      if (!selectedNews) {
        setNews(null);
        setError(
          "Announcement not found, unpublished, or unavailable for your role."
        );
        return;
      }

      setNews(selectedNews);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading the announcement."
      );
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    fetchNewsDetail();
  }, [fetchNewsDetail]);

  const publishedDate = news?.publishedAt || news?.createdAt;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard/news"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-yellow-400 hover:text-yellow-300"
          >
            <span aria-hidden="true">←</span>
            All News
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-yellow-300"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-yellow-400" />
            <p className="text-slate-300">Loading announcement...</p>
          </section>
        ) : error ? (
          <section className="rounded-2xl border border-red-900/60 bg-slate-900 p-6 sm:p-8">
            <div className="mb-3 text-3xl" aria-hidden="true">
              ⚠️
            </div>

            <h1 className="mb-3 text-xl font-bold text-white">
              Unable to Open Announcement
            </h1>

            <p className="mb-6 leading-7 text-slate-300">{error}</p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={fetchNewsDetail}
                className="rounded-lg bg-yellow-400 px-5 py-2.5 font-bold text-slate-950 transition hover:bg-yellow-300"
              >
                Try Again
              </button>

              <Link
                href="/dashboard/news"
                className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800"
              >
                View All News
              </Link>
            </div>
          </section>
        ) : news ? (
          <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <div className="h-1.5 bg-yellow-400" />

            <div className="p-6 sm:p-10">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-300">
                  Official Announcement
                </span>

                {news.audience && (
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                    Audience: {news.audience}
                  </span>
                )}
              </div>

              <h1 className="mb-5 break-words text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                {news.title}
              </h1>

              {publishedDate && (
                <p className="mb-8 border-b border-slate-800 pb-6 text-sm text-slate-400">
                  Published:{" "}
                  {Number.isNaN(Date.parse(publishedDate))
                    ? publishedDate
                    : new Date(publishedDate).toLocaleString()}
                </p>
              )}

              <div className="whitespace-pre-wrap break-words text-base leading-8 text-slate-200 sm:text-lg">
                {news.content}
              </div>

              <div className="mt-10 border-t border-slate-800 pt-6">
                <p className="text-sm text-slate-400">
                  MIC Banking Management
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/news"
                    className="rounded-lg bg-yellow-400 px-5 py-2.5 font-bold text-slate-950 transition hover:bg-yellow-300"
                  >
                    Read More News
                  </Link>

                  <Link
                    href="/dashboard"
                    className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}