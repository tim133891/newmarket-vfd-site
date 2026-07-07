"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReportActions({
  reportId,
  status,
  canApprove,
}: {
  reportId: string;
  status: string;
  canApprove: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function runAction(action: string) {
    setLoading(action);
    setError("");

    const res = await fetch(`/api/staff/reports/${reportId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    });

    const data = await res.json();

    setLoading("");

    if (!res.ok) {
      setError(data.error || "Could not update report.");
      return;
    }

    router.refresh();
  }

  if (status === "LOCKED") {
    return (
      <div className="rounded-3xl border border-green-400/20 bg-green-400/10 p-5 text-green-100">
        This report is locked and cannot be edited.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="text-xl font-semibold">Report Workflow</div>
      <div className="mt-2 text-sm text-slate-300">Current status: {status}</div>

      {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

      <div className="mt-5 flex flex-wrap gap-3">
        {(status === "DRAFT" || status === "NEEDS_CHANGES") && (
          <button
            onClick={() => runAction("submit")}
            disabled={!!loading}
            className="rounded-2xl bg-red-600 px-5 py-3 hover:bg-red-500 disabled:opacity-60"
          >
            {loading === "submit" ? "Submitting..." : "Submit Report"}
          </button>
        )}

        {canApprove && status === "SUBMITTED" && (
          <>
            <button
              onClick={() => runAction("needs_changes")}
              disabled={!!loading}
              className="rounded-2xl bg-amber-500 px-5 py-3 text-black hover:bg-amber-400 disabled:opacity-60"
            >
              {loading === "needs_changes" ? "Saving..." : "Needs Changes"}
            </button>

            <button
              onClick={() => runAction("approve")}
              disabled={!!loading}
              className="rounded-2xl bg-green-600 px-5 py-3 hover:bg-green-500 disabled:opacity-60"
            >
              {loading === "approve" ? "Approving..." : "Approve"}
            </button>
          </>
        )}

        {canApprove && status === "APPROVED" && (
          <button
            onClick={() => runAction("lock")}
            disabled={!!loading}
            className="rounded-2xl bg-blue-600 px-5 py-3 hover:bg-blue-500 disabled:opacity-60"
          >
            {loading === "lock" ? "Locking..." : "Lock Report"}
          </button>
        )}
      </div>
    </div>
  );
}