"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEVICE_TOKEN_KEY = "adminDeviceToken";

export default function AdminPlusButton({
  redirectTo,
  inline = false,
}: {
  redirectTo: string;
  inline?: boolean;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function tryDeviceToken(): Promise<boolean> {
    const token = localStorage.getItem(DEVICE_TOKEN_KEY);
    if (!token) return false;

    const res = await fetch("/api/admin/verify-device", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceToken: token }),
    });

    if (res.ok) return true;

    // Token is invalid (password changed) — clear it
    localStorage.removeItem(DEVICE_TOKEN_KEY);
    return false;
  }

  async function handlePlusClick() {
    setLoading(true);
    const valid = await tryDeviceToken();
    setLoading(false);

    if (valid) {
      router.push(redirectTo);
    } else {
      setShowModal(true);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const { deviceToken } = await res.json();
      localStorage.setItem(DEVICE_TOKEN_KEY, deviceToken);
      setShowModal(false);
      router.push(redirectTo);
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handlePlusClick}
        disabled={loading}
        aria-label="New entry"
        className={
          inline
            ? "p-2 border border-foreground rounded-md md:hover:border-indigo-400 transition-colors md:hover:text-indigo-400 active:border-indigo-400 active:text-indigo-400 disabled:opacity-40"
            : "fixed bottom-8 right-8 w-12 h-12 rounded-full border border-gray-600 bg-background text-2xl flex items-center justify-center hover:border-indigo-400 hover:text-indigo-400 transition-colors disabled:opacity-40 shadow-lg z-50"
        }
      >
        {loading ? "…" : "Add entry"}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setPassword("");
              setError("");
            }
          }}
        >
          <form
            onSubmit={handlePasswordSubmit}
            className="flex flex-col gap-4 w-full max-w-xs border border-gray-700 rounded-lg p-8 bg-background"
          >
            <h2 className="text-lg font-semibold">Admin</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="border border-gray-700 rounded px-3 py-2 bg-background text-foreground outline-none focus:border-indigo-400 transition-colors"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="border border-foreground rounded px-4 py-2 hover:border-indigo-400 hover:text-indigo-400 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Continue"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
