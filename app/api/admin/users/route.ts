import bcrypt from "bcryptjs";
import { StaffRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

function canManageUsers(role: string) {
  return role === "ADMIN" || role === "CHIEF";
}

const validRoles = [
  "ADMIN",
  "CHIEF",
  "ASSISTANT_CHIEF",
  "CAPTAIN",
  "LIEUTENANT",
  "OFFICER",
  "FIREFIGHTER",
  "EMT",
  "EMR",
  "SCENE_SUPPORT",
];

export async function GET() {
  const session = await getSession();

  if (!session || !canManageUsers(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.staffUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  return Response.json(users);
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session || !canManageUsers(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const email = String(body.email || "").toLowerCase().trim();
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const password = String(body.password || "");
  const role = String(body.role || "FIREFIGHTER") as StaffRole;

  if (!email || !firstName || !lastName || !password) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!validRoles.includes(role)) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  const existing = await prisma.staffUser.findUnique({
    where: { email },
  });

  if (existing) {
    return Response.json(
      { error: "A user with that email already exists" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.staffUser.create({
    data: {
      email,
      firstName,
      lastName,
      passwordHash,
      role,
      createdBy: session.id,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
      createdAt: true,
      lastLogin: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "STAFF_USER_CREATED",
      targetId: user.id,
      details: { email: user.email, role: user.role },
    },
  });

  return Response.json(user);
}

export async function PATCH(req: Request) {
  const session = await getSession();

  if (!session || !canManageUsers(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const id = String(body.id || "");
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = String(body.email || "").toLowerCase().trim();
  const role = String(body.role || "") as StaffRole;
  const active = Boolean(body.active);
  const password = String(body.password || "");

  if (!id || !firstName || !lastName || !email || !role) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!validRoles.includes(role)) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  const duplicate = await prisma.staffUser.findFirst({
    where: {
      email,
      NOT: { id },
    },
  });

  if (duplicate) {
    return Response.json(
      { error: "Another user already has that email" },
      { status: 400 }
    );
  }

  const data: {
    firstName: string;
    lastName: string;
    email: string;
    role: StaffRole;
    active: boolean;
    passwordHash?: string;
  } = {
    firstName,
    lastName,
    email,
    role,
    active,
  };

  if (password) {
    data.passwordHash = await bcrypt.hash(password, 12);
  }

  const user = await prisma.staffUser.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
      createdAt: true,
      lastLogin: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "STAFF_USER_UPDATED",
      targetId: user.id,
      details: { email: user.email, role: user.role, active: user.active },
    },
  });

  return Response.json(user);
}

export async function DELETE(req: Request) {
  const session = await getSession();

  if (!session || !canManageUsers(session.role)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const id = String(body.id || "");

  if (!id) {
    return Response.json({ error: "Missing user id" }, { status: 400 });
  }

  if (id === session.id) {
    return Response.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  const reportCount = await prisma.runReport.count({
    where: {
      OR: [{ createdById: id }, { approvedById: id }],
    },
  });

  if (reportCount > 0) {
    const user = await prisma.staffUser.update({
      where: { id },
      data: { active: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        active: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "STAFF_USER_DISABLED_HAS_REPORTS",
        targetId: id,
        details: { reportCount },
      },
    });

    return Response.json({
      user,
      message:
        "This user has reports attached, so they were disabled instead of deleted.",
    });
  }

  await prisma.staffUser.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "STAFF_USER_DELETED_NO_REPORTS",
      targetId: id,
      details: {},
    },
  });

  return Response.json({ ok: true });
}
