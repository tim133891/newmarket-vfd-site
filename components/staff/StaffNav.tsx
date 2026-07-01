import Link from "next/link";
import type { SessionUser } from "@/lib/auth";

export default function StaffNav({ user }: { user: SessionUser }) {
  const isAdmin = user.role === "ADMIN" || user.role === "CHIEF";

  return (
    <div className="mb-8 rounded-3xl border border-white/10 bg-black/30 p-4 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xl font-semibold">New Market VFD</div>
          <div className="text-sm text-slate-300">Staff Portal</div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/staff/dashboard" className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">
            Dashboard
          </Link>
          <Link href="/staff/reports" className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">
            Reports
          </Link>
          <Link href="/staff/reports/new" className="rounded-xl bg-red-600 px-4 py-2 hover:bg-red-500">
            New Report
          </Link>
          {isAdmin && (
            <Link href="/staff/users" className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">
              Personnel
            </Link>
          )}
          <Link href="/staff/approvals" className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">
            Approvals
          </Link>
          <form action="/api/auth/logout" method="post">
            <button className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}