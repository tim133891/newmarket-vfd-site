import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function StaffAdminPage() {
  const user = await getSession();

  if (!user) redirect("/staff/login");

  if (user.role !== "ADMIN" && user.role !== "CHIEF") {
    redirect("/staff/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl font-semibold">Admin Panel</div>
          <div className="mt-2 text-slate-300">
            Manage staff users, reports, and department settings.
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/staff/users" className="rounded-3xl border border-white/10 bg-black/20 p-5 hover:bg-white/10">
            <div className="text-xl font-semibold">Staff Users</div>
            <div className="mt-2 text-sm text-slate-300">Create and manage staff accounts.</div>
          </Link>

          <Link href="/staff/reports" className="rounded-3xl border border-white/10 bg-black/20 p-5 hover:bg-white/10">
            <div className="text-xl font-semibold">Run Reports</div>
            <div className="mt-2 text-sm text-slate-300">Create and review run reports.</div>
          </Link>

          <Link href="/staff/approvals" className="rounded-3xl border border-white/10 bg-black/20 p-5 hover:bg-white/10">
            <div className="text-xl font-semibold">Approvals</div>
            <div className="mt-2 text-sm text-slate-300">Review submitted reports.</div>
          </Link>
        </div>
      </div>
    </div>
  );
}