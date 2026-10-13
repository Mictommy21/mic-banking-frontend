
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type NewsItem = {
  id: number;
  title: string;
  content: string;
  audience: "ALL" | "USER" | "ADMIN";
  status: "DRAFT" | "PUBLISHED";
  createdBy?: string;
  createdAt?: string;
  modifiedAt?: string;
  publishedAt?: string | null;
};

type NewsForm = {
  title: string;
  content: string;
  audience: "ALL" | "USER" | "ADMIN";
  status: "DRAFT" | "PUBLISHED";
};

const API_URL = "http://localhost:8086/superadmin/news";

const emptyForm: NewsForm = {
  title: "",
  content: "",
  audience: "ALL",
  status: "DRAFT",
};

export default function SuperAdminNewsPage() {
  const router = useRouter();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    document.cookie = "token=; Max-Age=0; path=/";
    document.cookie = "role=; Max-Age=0; path=/";
    router.replace("/login");
  }, [router]);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError(
          "Access denied. Sign in with a ROLE_SUPERADMIN account."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(`Unable to load news (HTTP ${response.status}).`);
      }

      const data: NewsItem[] = await response.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("News loading failed:", err);
      setError(
        "Unable to connect to the backend. Check that Spring Boot is running on port 8086."
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, handleUnauthorized]);

  useEffect(() => {
    void loadNews();
  }, [loadNews]);

  const updateForm = <K extends keyof NewsForm>(
    key: K,
    value: NewsForm[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      audience: item.audience,
      status: item.status,
    });
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      setError("Please enter both a title and the news content.");
      return;
    }

    setSaving(true);

    try {
      const url = editingId === null
        ? API_URL
        : `${API_URL}/${editingId}`;

      const response = await fetch(url, {
        method: editingId === null ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          audience: form.audience,
          status: form.status,
        }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("You do not have permission to manage announcements.");
        return;
      }

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Unable to save announcement (HTTP ${response.status}).`
        );
      }

      setSuccess(
        editingId === null
          ? form.status === "PUBLISHED"
            ? "Announcement published successfully."
            : "Draft saved successfully."
          : "Announcement updated successfully."
      );

      resetForm();
      await loadNews();
    } catch (err) {
      console.error("Saving announcement failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: NewsItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/${item.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("You do not have permission to delete announcements.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Unable to delete announcement (HTTP ${response.status}).`);
      }

      if (editingId === item.id) resetForm();

      setSuccess("Announcement deleted successfully.");
      await loadNews();
    } catch (err) {
      console.error("Deleting announcement failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the announcement."
      );
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "Not published";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString();
  };

  const publishedCount = news.filter(
    (item) => item.status === "PUBLISHED"
  ).length;

  const draftCount = news.filter(
    (item) => item.status === "DRAFT"
  ).length;

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-6 text-white sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link
              href="/superadmin"
              className="transition hover:text-yellow-400"
            >
              Superadmin
            </Link>
            <span>/</span>
            <span className="text-yellow-400">News Management</span>
          </div>

          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">
            News Announcement Center
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Create, publish, edit, and manage banking announcements.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void loadNews()}
            disabled={loading}
            className="rounded-lg border border-white/10 bg-[#151515] px-4 py-2.5 text-sm transition hover:border-yellow-500/40 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <Link
            href="/superadmin"
            className="rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Announcements", value: news.length },
          { label: "Published", value: publishedCount },
          { label: "Drafts", value: draftCount },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-white/[0.08] bg-[#111111] p-5"
          >
            <p className="text-sm text-gray-400">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-yellow-400">
              {loading ? "..." : metric.value.toLocaleString()}
            </p>
          </div>
        ))}
      </section>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-500/30 bg-red-500/[0.07] p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4 text-sm text-emerald-300"
        >
          {success}
        </div>
      )}

      <section className="mb-8 rounded-2xl border border-white/[0.08] bg-[#111111] p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              {editingId === null ? "Create Announcement" : `Edit Announcement #${editingId}`}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose who can see this announcement and whether to publish it.
            </p>
          </div>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:border-yellow-500/40"
            >
              Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label
              htmlFor="news-title"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Announcement Title
            </label>
            <input
              id="news-title"
              type="text"
              maxLength={180}
              required
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Enter announcement title"
              className="w-full rounded-lg border border-white/10 bg-[#090909] px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-yellow-500/60"
            />
          </div>

          <div>
            <label
              htmlFor="news-content"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Announcement Content
            </label>
            <textarea
              id="news-content"
              required
              rows={6}
              value={form.content}
              onChange={(event) => updateForm("content", event.target.value)}
              placeholder="Write the announcement details here..."
              className="w-full resize-y rounded-lg border border-white/10 bg-[#090909] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-600 focus:border-yellow-500/60"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="news-audience"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Audience
              </label>
              <select
                id="news-audience"
                value={form.audience}
                onChange={(event) =>
                  updateForm(
                    "audience",
                    event.target.value as NewsForm["audience"]
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-[#090909] px-4 py-3 text-sm outline-none focus:border-yellow-500/60"
              >
                <option value="ALL">All users and administrators</option>
                <option value="USER">Regular users only</option>
                <option value="ADMIN">Administrators only</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="news-status"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Publication Status
              </label>
              <select
                id="news-status"
                value={form.status}
                onChange={(event) =>
                  updateForm(
                    "status",
                    event.target.value as NewsForm["status"]
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-[#090909] px-4 py-3 text-sm outline-none focus:border-yellow-500/60"
              >
                <option value="DRAFT">Save as draft</option>
                <option value="PUBLISHED">Publish now</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-white/[0.07] pt-5">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Announcement"
                  : form.status === "PUBLISHED"
                    ? "Publish Announcement"
                    : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:border-white/25"
            >
              Clear Form
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]">
        <div className="border-b border-white/[0.07] px-5 py-5 sm:px-7">
          <h2 className="font-semibold">All Announcements</h2>
          <p className="mt-1 text-sm text-gray-500">
            Published items and saved drafts.
          </p>
        </div>

        {loading ? (
          <p className="p-8 text-sm text-gray-400">
            Loading announcements...
          </p>
        ) : news.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium text-gray-300">
              No announcements found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Create your first announcement using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.07]">
            {news.map((item) => (
              <article key={item.id} className="p-5 sm:p-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-gray-500">
                        NEWS #{item.id}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.status === "PUBLISHED"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-yellow-400/10 text-yellow-400"
                        }`}
                      >
                        {item.status}
                      </span>

                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-gray-400">
                        {item.audience === "ALL"
                          ? "Everyone"
                          : item.audience === "USER"
                            ? "Regular users"
                            : "Administrators"}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-400">
                      {item.content}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                      <span>Created: {formatDate(item.createdAt)}</span>
                      <span>Published: {formatDate(item.publishedAt)}</span>
                      {item.createdBy && (
                        <span>Author: {item.createdBy}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2 lg:flex-col">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="rounded-lg border border-yellow-500/25 px-3 py-2 text-sm text-yellow-400 transition hover:bg-yellow-400/10"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(item)}
                      className="rounded-lg border border-red-500/25 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-8 border-t border-white/[0.07] pt-5 text-xs text-gray-600">
        MIC Banking · Superadmin News Management
      </footer>
    </main>
  );
}