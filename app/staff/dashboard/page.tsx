import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import StaffNav from "@/components/staff/StaffNav";

export default async function StaffDashboardPage() {
  const user = await getSession();
  if (!user) redirect("/staff/login");

  const [totalStaff, drafts, submitted, approved, locked, recentReports] =
    await Promise.all([
      prisma.staffUser.count({ where: { active: true } }),
      prisma.runReport.count({ where: { status: "DRAFT" } }),
      prisma.runReport.count({ where: { status: "SUBMITTED" } }),
      prisma.runReport.count({ where: { status: "APPROVED" } }),
      prisma.runReport.count({ where: { status: "LOCKED" } }),
      prisma.runReport.findMany({
        take: 6,
        orderBy: { updatedAt: "desc" },
        include: {
          createdBy: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
    ]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <StaffNav user={user} />

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl font-semibold">Staff Dashboard</div>
          <div className="mt-2 text-slate-300">
            Welcome, {user.firstName} {user.lastName}
          </div>
          <div className="mt-1 text-sm text-slate-400">Role: {user.role}</div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <Stat label="Active Staff" value={totalStaff} />
          <Stat label="Draft Reports" value={drafts} />
          <Stat label="Submitted" value={submitted} />
          <Stat label="Approved" value={approved} />
          <Stat label="Locked" value={locked} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/staff/reports/new" className="rounded-3xl bg-red-600 p-6 hover:bg-red-500">
            <div className="text-2xl font-semibold">New Run Report</div>
            <div className="mt-2 text-red-50">Start a new digital report.</div>
          </Link>

          <Link href="/staff/reports" className="rounded-3xl border border-white/10 bg-black/20 p-6 hover:bg-white/10">
            <div className="text-2xl font-semibold">Reports</div>
            <div className="mt-2 text-slate-300">View, edit, and manage reports.</div>
          </Link>

          <Link href="/staff/approvals" className="rounded-3xl border border-white/10 bg-black/20 p-6 hover:bg-white/10">
            <div className="text-2xl font-semibold">Approvals</div>
            <div className="mt-2 text-slate-300">Review submitted reports.</div>
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/20">
          <div className="border-b border-white/10 p-5">
            <div className="text-2xl font-semibold">Recent Reports</div>
            <div className="mt-1 text-sm text-slate-300">Latest department report activity.</div>
          </div>

          {recentReports.length === 0 ? (
            <div className="p-5 text-slate-300">No reports created yet.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {recentReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/staff/reports/${report.id}`}
                  className="grid gap-3 p-5 text-sm hover:bg-white/5 md:grid-cols-5"
                >
                  <div>
                    <div className="text-slate-400">Run #</div>
                    <div>{report.runNumber || "Not entered"}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Patient #</div>
                    <div>{report.patientNumber || "Not entered"}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Status</div>
                    <div>{report.status}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Created By</div>
                    <div>{report.createdBy.firstName} {report.createdBy.lastName}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Updated</div>
                    <div>{new Date(report.updatedAt).toLocaleDateString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm text-slate-300">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}