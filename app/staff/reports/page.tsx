import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import StaffNav from "@/components/staff/StaffNav";

export default async function ReportsPage() {
  const user = await getSession();
  if (!user) redirect("/staff/login");

  const reports = await prisma.runReport.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      createdBy: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <StaffNav user={user} />

        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-3xl font-semibold">Run Reports</div>
            <div className="mt-2 text-slate-300">Create and manage department reports.</div>
          </div>

          <Link href="/staff/reports/new" className="rounded-2xl bg-red-600 px-5 py-3 hover:bg-red-500">
            New Report
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-black/20">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-7 gap-4 border-b border-white/10 p-4 text-sm text-slate-300">
              <div>Run #</div>
              <div>Patient #</div>
              <div>Date</div>
              <div>Nature</div>
              <div>Status</div>
              <div>Created By</div>
              <div>Actions</div>
            </div>

            {reports.map((report) => (
              <div key={report.id} className="grid grid-cols-7 gap-4 border-b border-white/5 p-4 text-sm">
                <div>{report.runNumber || "—"}</div>
                <div>{report.patientNumber || "—"}</div>
                <div>{report.dateOfIncident ? new Date(report.dateOfIncident).toLocaleDateString() : "—"}</div>
                <div>{report.natureOfRun || "—"}</div>
                <div>{report.status}</div>
                <div>{report.createdBy.firstName} {report.createdBy.lastName}</div>
                <div>
                  <Link href={`/staff/reports/${report.id}`} className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20">
                    View / Edit
                  </Link>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="p-5 text-slate-300">No reports found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}