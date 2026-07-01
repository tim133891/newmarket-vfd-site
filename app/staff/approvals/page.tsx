import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ApprovalsPage() {
  const user = await getSession();

  if (!user) redirect("/staff/login");

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl font-semibold">Report Approvals</div>
          <div className="mt-2 text-slate-300">
            Officers and chiefs can review submitted reports here.
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6 text-slate-300">
          No reports are waiting for approval yet.
        </div>
      </div>
    </div>
  );
}