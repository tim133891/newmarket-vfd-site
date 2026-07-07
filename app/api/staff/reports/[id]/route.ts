import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

function parseDate(value: unknown) {
  if (!value || typeof value !== "string") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  if (!report) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(report);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const action = String(body.action || "save");

  const existing = await prisma.runReport.findUnique({
    where: { id },
  });

  if (!existing) {
    return Response.json({ error: "Report not found" }, { status: 404 });
  }

  if (existing.status === "LOCKED") {
    return Response.json(
      { error: "Locked reports cannot be changed." },
      { status: 400 }
    );
  }

  if (["approve", "needs_changes", "lock"].includes(action)) {
    if (!canApprove(session.role)) {
      return Response.json(
        { error: "You do not have permission to review reports." },
        { status: 403 }
      );
    }
  }

  if (action === "submit") {
    const report = await prisma.runReport.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "RUN_REPORT_SUBMITTED",
        targetId: id,
        details: {},
      },
    });

    return Response.json(report);
  }

  if (action === "needs_changes") {
    const report = await prisma.runReport.update({
      where: { id },
      data: {
        status: "NEEDS_CHANGES",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "RUN_REPORT_NEEDS_CHANGES",
        targetId: id,
        details: {},
      },
    });

    return Response.json(report);
  }

  if (action === "approve") {
    const report = await prisma.runReport.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: session.id,
        approvedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "RUN_REPORT_APPROVED",
        targetId: id,
        details: {},
      },
    });

    return Response.json(report);
  }

  if (action === "lock") {
    if (existing.status !== "APPROVED") {
      return Response.json(
        { error: "Only approved reports can be locked." },
        { status: 400 }
      );
    }

    const report = await prisma.runReport.update({
      where: { id },
      data: {
        status: "LOCKED",
        lockedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "RUN_REPORT_LOCKED",
        targetId: id,
        details: {},
      },
    });

    return Response.json(report);
  }

  const report = await prisma.runReport.update({
    where: { id },
    data: {
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
      refusal: body.refusal || {},
      narrative: body.narrative || null,
      crew: body.crew || {},
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "RUN_REPORT_UPDATED",
      targetId: id,
      details: {},
    },
  });

  return Response.json(report);
}