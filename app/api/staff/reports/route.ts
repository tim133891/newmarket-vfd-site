import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

function parseDate(value: unknown) {
  if (!value || typeof value !== "string") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await prisma.runReport.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  return Response.json(reports);
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const action = String(body.action || "draft");

  const report = await prisma.runReport.create({
    data: {
      status: action === "submit" ? "SUBMITTED" : "DRAFT",

      runNumber: body.runNumber || null,
      patientNumber: body.patientNumber || null,
      dateOfIncident: parseDate(body.dateOfIncident),

      dispatchTime: body.dispatchTime || null,
      enrouteTime: body.enrouteTime || null,
      onSceneTime: body.onSceneTime || null,
      inServiceTime: body.inServiceTime || null,

      transportAgency: body.transportAgency || null,
      incidentLocation: body.incidentLocation || null,
      natureOfRun: body.natureOfRun || null,
      chiefComplaint: body.chiefComplaint || null,

      patientName: body.patientName || null,
      patientAddress: body.patientAddress || null,
      cityStateZip: body.cityStateZip || null,
      dateOfBirth: parseDate(body.dateOfBirth),
      age: body.age || null,
      sex: body.sex || null,
      race: body.race || null,
      primaryPhysician: body.primaryPhysician || null,

      medications: body.medications || null,
      allergies: body.allergies || null,
      patientHistory: body.patientHistory || null,

      vitalSigns: body.vitalSigns || {},
      assessment: body.assessment || {},
      treatment: body.treatment || {},
      narrative: body.narrative || null,
      crew: body.crew || {},

      createdById: session.id,
      submittedAt: action === "submit" ? new Date() : null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: action === "submit" ? "RUN_REPORT_SUBMITTED" : "RUN_REPORT_DRAFT_CREATED",
      targetId: report.id,
      details: {
        runNumber: report.runNumber,
      },
    },
  });

  return Response.json(report);
}