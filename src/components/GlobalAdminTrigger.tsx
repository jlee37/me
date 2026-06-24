"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEVICE_TOKEN_KEY = "adminDeviceToken";

export default function GlobalAdminTrigger() {
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
    localStorage.removeItem(DEVICE_TOKEN_KEY);
    return false;
  }

  async function handleClick() {
    setLoading(true);
    const valid = await tryDeviceToken();
    setLoading(false);

    if (valid) {
      router.push("/admin");
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
      router.push("/admin");
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setPassword("");
    setError("");
  }

  return (
    <>
      {/* Invisible trigger: bottom-left corner, desktop only */}
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label="Admin"
        className="hidden md:block fixed bottom-0 left-0 w-8 h-8 opacity-0 z-50 cursor-default"
      />

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
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
