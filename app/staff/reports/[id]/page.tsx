import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import StaffNav from "@/components/staff/StaffNav";
import ReportActions from "./ReportActions";

function canApprove(role: string) {
  return [
    "ADMIN",
    "CHIEF",
    "ASSISTANT_CHIEF",
    "CAPTAIN",
    "LIEUTENANT",
    "OFFICER",
  ].includes(role);
}

function asObj(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function show(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

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
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          role: true,
        },
      },
      approvedBy: {
        select: {
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  if (!report) redirect("/staff/reports");

  const vitalSigns = asObj(report.vitalSigns);
  const assessment = asObj(report.assessment);
  const treatment = asObj(report.treatment);
  const refusal = asObj(report.refusal);
  const crew = asObj(report.crew);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <StaffNav user={user} />

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl font-semibold">Run Report</div>
          <div className="mt-2 text-slate-300">
            Status: {report.status} • Created by {report.createdBy.firstName}{" "}
            {report.createdBy.lastName}
          </div>
          <div className="mt-1 text-sm text-slate-400">
            Updated: {new Date(report.updatedAt).toLocaleString()}
          </div>
        </div>

        <div className="mt-6">
          <ReportActions
            reportId={report.id}
            status={report.status}
            canApprove={canApprove(user.role)}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Info
            title="Incident Information"
            items={[
              ["Run Number", report.runNumber],
              ["Patient Number", report.patientNumber],
              [
                "Date",
                report.dateOfIncident
                  ? new Date(report.dateOfIncident).toLocaleDateString()
                  : null,
              ],
              ["Transport Agency", report.transportAgency],
              ["Location", report.incidentLocation],
              ["Nature of Run", report.natureOfRun],
              ["Chief Complaint", report.chiefComplaint],
            ]}
          />

          <Info
            title="Times"
            items={[
              ["Dispatch", report.dispatchTime],
              ["Enroute", report.enrouteTime],
              ["On Scene", report.onSceneTime],
              ["In Service", report.inServiceTime],
            ]}
          />

          <Info
            title="Patient Information"
            items={[
              ["Patient Name", report.patientName],
              ["Address", report.patientAddress],
              ["City/State/Zip", report.cityStateZip],
              [
                "DOB",
                report.dateOfBirth
                  ? new Date(report.dateOfBirth).toLocaleDateString()
                  : null,
              ],
              ["Age", report.age],
              ["Sex", report.sex],
              ["Race", report.race],
              ["Primary Physician", report.primaryPhysician],
            ]}
          />

          <Info
            title="Medical Information"
            items={[
              ["Patient History", report.patientHistory],
              ["Medications", report.medications],
              ["Allergies", report.allergies],
            ]}
          />

          <Info
            title="Vital Signs"
            items={[
              ["BP", vitalSigns.bp],
              ["Pulse", vitalSigns.pulse],
              ["Respirations", vitalSigns.respirations],
              ["SpO2", vitalSigns.spo2],
              ["Glucose", vitalSigns.glucose],
            ]}
          />

          <Info
            title="GCS"
            items={[
              ["Eye Opening", assessment.gcsEye],
              ["Verbal Response", assessment.gcsVerbal],
              ["Motor Response", assessment.gcsMotor],
            ]}
          />

          <Info
            title="Airway / Breathing / Circulation"
            items={[
              ["Airway", assessment.airway],
              ["Breathing", assessment.breathing],
              ["Circulation", assessment.circulation],
              ["Treatment", treatment.treatmentGiven],
            ]}
          />

          <Info
            title="Patient Refusal / Release"
            items={[
              ["Refusal", refusal.refusedTreatment],
              ["Name", refusal.name],
              ["Typed Signature", refusal.signature],
              ["Witness", refusal.witness],
              ["Date", refusal.date],
              ["Time", refusal.time],
            ]}
          />

          <Info
            title="Crew"
            items={[
              ["Lead Provider", crew.lead],
              ["Driver", crew.driver],
              ["Crew Member 1", crew.memberOne],
              ["Crew Member 2", crew.memberTwo],
            ]}
          />

          <Info
            title="Approval"
            items={[
              [
                "Approved By",
                report.approvedBy
                  ? `${report.approvedBy.firstName} ${report.approvedBy.lastName}`
                  : null,
              ],
              [
                "Approved At",
                report.approvedAt
                  ? new Date(report.approvedAt).toLocaleString()
                  : null,
              ],
              [
                "Locked At",
                report.lockedAt ? new Date(report.lockedAt).toLocaleString() : null,
              ],
            ]}
          />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Narrative</div>
          <div className="mt-4 whitespace-pre-wrap text-slate-200">
            {report.narrative || "No narrative entered."}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/staff/reports"
            className="rounded-2xl bg-white/10 px-5 py-3 hover:bg-white/20"
          >
            Back to Reports
          </Link>

          {report.status !== "LOCKED" && (
            <Link
              href={`/staff/reports/${report.id}/edit`}
              className="rounded-2xl bg-red-600 px-5 py-3 hover:bg-red-500"
            >
              Edit Report
            </Link>
          )}
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
  items: [string, unknown][];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <div className="text-xl font-semibold">{title}</div>
      <div className="mt-5 space-y-3 text-sm">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[150px_1fr] gap-3 border-b border-white/5 pb-2"
          >
            <div className="text-slate-400">{label}</div>
            <div>{show(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}