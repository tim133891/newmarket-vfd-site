"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@newmarketvfd.org");
  const [password, setPassword] = useState("ChangeThisPassword123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/staff/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="text-2xl font-semibold">Staff Login</div>
        <div className="mt-2 text-sm text-slate-300">
          New Market Volunteer Fire Department
        </div>

        <form onSubmit={login} className="mt-8 space-y-4">
          <input
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />

          {error && <div className="text-sm text-red-300">{error}</div>}

          <button
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-red-600 font-medium hover:bg-red-500 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}