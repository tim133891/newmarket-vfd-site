import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import StaffNav from "@/components/staff/StaffNav";
import Link from "next/link";

export default async function ReportViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/staff/login");

  const { id } = await params;

  const report = await prisma.runReport.findUnique({
    where: { id },
    include: {
      createdBy: { select: { firstName: true, lastName: true, role: true } },
    },
  });

  if (!report) redirect("/staff/reports");

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <StaffNav user={user} />

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl font-semibold">Run Report</div>
          <div className="mt-2 text-slate-300">
            Status: {report.status} • Created by {report.createdBy.firstName} {report.createdBy.lastName}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Info title="Incident Information" items={[
            ["Run Number", report.runNumber],
            ["Patient Number", report.patientNumber],
            ["Date", report.dateOfIncident ? new Date(report.dateOfIncident).toLocaleDateString() : null],
            ["Location", report.incidentLocation],
            ["Nature", report.natureOfRun],
            ["Chief Complaint", report.chiefComplaint],
          ]} />

          <Info title="Patient Information" items={[
            ["Patient Name", report.patientName],
            ["Address", report.patientAddress],
            ["City/State/Zip", report.cityStateZip],
            ["DOB", report.dateOfBirth ? new Date(report.dateOfBirth).toLocaleDateString() : null],
            ["Age", report.age],
            ["Sex", report.sex],
          ]} />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Narrative</div>
          <div className="mt-4 whitespace-pre-wrap text-slate-200">
            {report.narrative || "No narrative entered."}
          </div>
        </div>

        <div className="mt-6">
          <Link href="/staff/reports" className="rounded-2xl bg-white/10 px-5 py-3 hover:bg-white/20">
            Back to Reports
          </Link>
        </div>
      </div>
    </div>
  );
}

function Info({
  title,
  items,
}: {
  title: string;
  items: [string, string | null | undefined][];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <div className="text-xl font-semibold">{title}</div>
      <div className="mt-5 space-y-3 text-sm">
        {items.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[150px_1fr] gap-3 border-b border-white/5 pb-2">
            <div className="text-slate-400">{label}</div>
            <div>{value || "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}