"use client";

import { useEffect, useState } from "react";

const roles = [
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

type StaffUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string | null;
};

const blankForm = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "FIREFIGHTER",
  password: "",
  active: true,
};

export default function StaffUsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function resetForm() {
    setForm(blankForm);
    setEditing(false);
    setError("");
    setMessage("");
  }

  function editUser(user: StaffUser) {
    setForm({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: "",
      active: user.active,
    });
    setEditing(true);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/admin/users", {
      method: editing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not save user");
      return;
    }

    setMessage(editing ? "User updated." : "User created.");
    resetForm();
    loadUsers();
  }

  async function deleteUser(user: StaffUser) {
    const confirmed = confirm(
      `Delete ${user.firstName} ${user.lastName}? If they have reports, they will be disabled instead.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.id }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not delete user");
      return;
    }

    setMessage(data.message || "User deleted.");
    loadUsers();
  }

  async function toggleActive(user: StaffUser) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        active: !user.active,
        password: "",
      }),
    });

    if (res.ok) loadUsers();
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl font-semibold">Staff Users</div>
          <div className="mt-2 text-slate-300">
            Create, edit, disable, and remove department staff accounts.
          </div>
        </div>

        <form onSubmit={submitUser} className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-semibold">
                {editing ? "Edit Staff User" : "Create Staff User"}
              </div>
              <div className="mt-1 text-sm text-slate-300">
                {editing
                  ? "Leave password blank to keep the current password."
                  : "Create a login for a staff member."}
              </div>
            </div>

            {editing && (
              <button type="button" onClick={resetForm} className="rounded-2xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
                Cancel Edit
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input className="field" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input className="field" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <input className="field" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="field" placeholder={editing ? "New password optional" : "Temporary password"} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

            <select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select className="field" value={form.active ? "active" : "disabled"} onChange={(e) => setForm({ ...form, active: e.target.value === "active" })}>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {error && <div className="mt-4 text-sm text-red-300">{error}</div>}
          {message && <div className="mt-4 text-sm text-green-300">{message}</div>}

          <button className="mt-5 h-12 rounded-2xl bg-red-600 px-6 font-medium hover:bg-red-500">
            {editing ? "Save Changes" : "Create User"}
          </button>
        </form>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-black/20">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-7 gap-4 border-b border-white/10 p-4 text-sm text-slate-300">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
              <div>Created</div>
              <div>Last Login</div>
              <div>Actions</div>
            </div>

            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-7 gap-4 border-b border-white/5 p-4 text-sm">
                <div>{user.firstName} {user.lastName}</div>
                <div>{user.email}</div>
                <div>{user.role}</div>
                <div>{user.active ? "Active" : "Disabled"}</div>
                <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                <div>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => editUser(user)} className="rounded-xl bg-white/10 px-3 py-1 hover:bg-white/20">
                    Edit
                  </button>
                  <button onClick={() => toggleActive(user)} className="rounded-xl bg-amber-500/20 px-3 py-1 text-amber-100 hover:bg-amber-500/30">
                    {user.active ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => deleteUser(user)} className="rounded-xl bg-red-500/20 px-3 py-1 text-red-100 hover:bg-red-500/30">
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="p-5 text-slate-300">No users found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}