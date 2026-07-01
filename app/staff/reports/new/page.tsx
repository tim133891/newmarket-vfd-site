"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const blankForm = {
  runNumber: "",
  patientNumber: "",
  dateOfIncident: "",
  dispatchTime: "",
  enrouteTime: "",
  onSceneTime: "",
  inServiceTime: "",

  transportAgency: "",
  incidentLocation: "",
  natureOfRun: "",
  chiefComplaint: "",

  patientName: "",
  patientAddress: "",
  cityStateZip: "",
  dateOfBirth: "",
  age: "",
  sex: "",
  race: "",
  primaryPhysician: "",

  medications: "",
  allergies: "",
  patientHistory: "",

  bp: "",
  pulse: "",
  respirations: "",
  spo2: "",
  glucose: "",

  gcsEye: "",
  gcsVerbal: "",
  gcsMotor: "",

  airway: "",
  breathing: "",
  circulation: "",
  treatmentGiven: "",

  narrative: "",

  crewLead: "",
  crewDriver: "",
  crewMemberOne: "",
  crewMemberTwo: "",
};

export default function NewRunReportPage() {
  const router = useRouter();
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(key: keyof typeof blankForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveReport(action: "draft" | "submit") {
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      action,
      vitalSigns: {
        bp: form.bp,
        pulse: form.pulse,
        respirations: form.respirations,
        spo2: form.spo2,
        glucose: form.glucose,
      },
      assessment: {
        gcsEye: form.gcsEye,
        gcsVerbal: form.gcsVerbal,
        gcsMotor: form.gcsMotor,
        airway: form.airway,
        breathing: form.breathing,
        circulation: form.circulation,
      },
      treatment: {
        treatmentGiven: form.treatmentGiven,
      },
      crew: {
        lead: form.crewLead,
        driver: form.crewDriver,
        memberOne: form.crewMemberOne,
        memberTwo: form.crewMemberTwo,
      },
    };

    const res = await fetch("/api/staff/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Could not save report.");
      return;
    }

    router.push("/staff/reports");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-3xl font-semibold">New Run Report</div>
          <div className="mt-2 text-slate-300">
            Digital prehospital care report.
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Incident Information</div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input className="field" placeholder="Run Number" value={form.runNumber} onChange={(e) => update("runNumber", e.target.value)} />
            <input className="field" placeholder="Patient Number" value={form.patientNumber} onChange={(e) => update("patientNumber", e.target.value)} />
            <input className="field" type="date" value={form.dateOfIncident} onChange={(e) => update("dateOfIncident", e.target.value)} />
            <input className="field" placeholder="Transport Agency" value={form.transportAgency} onChange={(e) => update("transportAgency", e.target.value)} />
            <input className="field" placeholder="Incident Location" value={form.incidentLocation} onChange={(e) => update("incidentLocation", e.target.value)} />
            <input className="field" placeholder="Nature of Run" value={form.natureOfRun} onChange={(e) => update("natureOfRun", e.target.value)} />
            <input className="field" placeholder="Chief Complaint" value={form.chiefComplaint} onChange={(e) => update("chiefComplaint", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Times</div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <input className="field" placeholder="Dispatch Time" value={form.dispatchTime} onChange={(e) => update("dispatchTime", e.target.value)} />
            <input className="field" placeholder="Enroute Time" value={form.enrouteTime} onChange={(e) => update("enrouteTime", e.target.value)} />
            <input className="field" placeholder="On Scene Time" value={form.onSceneTime} onChange={(e) => update("onSceneTime", e.target.value)} />
            <input className="field" placeholder="In Service Time" value={form.inServiceTime} onChange={(e) => update("inServiceTime", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Patient Information</div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input className="field" placeholder="Patient Name" value={form.patientName} onChange={(e) => update("patientName", e.target.value)} />
            <input className="field" placeholder="Patient Address" value={form.patientAddress} onChange={(e) => update("patientAddress", e.target.value)} />
            <input className="field" placeholder="City, State, Zip" value={form.cityStateZip} onChange={(e) => update("cityStateZip", e.target.value)} />
            <input className="field" type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
            <input className="field" placeholder="Age" value={form.age} onChange={(e) => update("age", e.target.value)} />
            <select className="field" value={form.sex} onChange={(e) => update("sex", e.target.value)}>
              <option value="">Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input className="field" placeholder="Race" value={form.race} onChange={(e) => update("race", e.target.value)} />
            <input className="field" placeholder="Primary Physician" value={form.primaryPhysician} onChange={(e) => update("primaryPhysician", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Medical Information</div>

          <div className="mt-5 grid gap-4">
            <textarea className="area" placeholder="Patient History" value={form.patientHistory} onChange={(e) => update("patientHistory", e.target.value)} />
            <textarea className="area" placeholder="Medications" value={form.medications} onChange={(e) => update("medications", e.target.value)} />
            <textarea className="area" placeholder="Allergies" value={form.allergies} onChange={(e) => update("allergies", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Vital Signs</div>

          <div className="mt-5 grid gap-4 md:grid-cols-5">
            <input className="field" placeholder="BP" value={form.bp} onChange={(e) => update("bp", e.target.value)} />
            <input className="field" placeholder="Pulse" value={form.pulse} onChange={(e) => update("pulse", e.target.value)} />
            <input className="field" placeholder="Resp." value={form.respirations} onChange={(e) => update("respirations", e.target.value)} />
            <input className="field" placeholder="SpO2" value={form.spo2} onChange={(e) => update("spo2", e.target.value)} />
            <input className="field" placeholder="Glucose" value={form.glucose} onChange={(e) => update("glucose", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">GCS</div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <select className="field" value={form.gcsEye} onChange={(e) => update("gcsEye", e.target.value)}>
              <option value="">Eye Opening</option>
              <option value="4 - Spontaneous">4 - Spontaneous</option>
              <option value="3 - To voice">3 - To voice</option>
              <option value="2 - To pain">2 - To pain</option>
              <option value="1 - None">1 - None</option>
            </select>

            <select className="field" value={form.gcsVerbal} onChange={(e) => update("gcsVerbal", e.target.value)}>
              <option value="">Verbal Response</option>
              <option value="5 - Oriented">5 - Oriented</option>
              <option value="4 - Confused">4 - Confused</option>
              <option value="3 - Inappropriate words">3 - Inappropriate words</option>
              <option value="2 - Incomprehensible sounds">2 - Incomprehensible sounds</option>
              <option value="1 - None">1 - None</option>
            </select>

            <select className="field" value={form.gcsMotor} onChange={(e) => update("gcsMotor", e.target.value)}>
              <option value="">Motor Response</option>
              <option value="6 - Obeys commands">6 - Obeys commands</option>
              <option value="5 - Localizes pain">5 - Localizes pain</option>
              <option value="4 - Withdraws from pain">4 - Withdraws from pain</option>
              <option value="3 - Flexion to pain">3 - Flexion to pain</option>
              <option value="2 - Extension to pain">2 - Extension to pain</option>
              <option value="1 - None">1 - None</option>
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Airway / Breathing / Circulation</div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <select className="field" value={form.airway} onChange={(e) => update("airway", e.target.value)}>
              <option value="">Airway</option>
              <option value="Patent">Patent</option>
              <option value="Obstructed">Obstructed</option>
              <option value="Snoring respirations">Snoring respirations</option>
              <option value="Gurgling">Gurgling</option>
              <option value="Stridor">Stridor</option>
              <option value="Wheezing">Wheezing</option>
              <option value="Apnea">Apnea</option>
              <option value="Assisted ventilations">Assisted ventilations</option>
              <option value="OPA inserted">OPA inserted</option>
              <option value="NPA inserted">NPA inserted</option>
              <option value="Suctioned">Suctioned</option>
              <option value="Oxygen applied">Oxygen applied</option>
            </select>

            <select className="field" value={form.breathing} onChange={(e) => update("breathing", e.target.value)}>
              <option value="">Breathing</option>
              <option value="Normal">Normal</option>
              <option value="Labored">Labored</option>
              <option value="Shallow">Shallow</option>
              <option value="Rapid">Rapid</option>
              <option value="Slow">Slow</option>
              <option value="Absent">Absent</option>
              <option value="Assisted">Assisted</option>
            </select>

            <select className="field" value={form.circulation} onChange={(e) => update("circulation", e.target.value)}>
              <option value="">Circulation</option>
              <option value="Pulse present">Pulse present</option>
              <option value="No pulse">No pulse</option>
              <option value="Strong radial pulse">Strong radial pulse</option>
              <option value="Weak radial pulse">Weak radial pulse</option>
              <option value="Skin warm/dry">Skin warm/dry</option>
              <option value="Skin cool/clammy">Skin cool/clammy</option>
              <option value="Bleeding controlled">Bleeding controlled</option>
              <option value="Uncontrolled bleeding">Uncontrolled bleeding</option>
            </select>

            <select className="field" value={form.treatmentGiven} onChange={(e) => update("treatmentGiven", e.target.value)}>
              <option value="">Treatment Given</option>
              <option value="None">None</option>
              <option value="Oxygen">Oxygen</option>
              <option value="Suction">Suction</option>
              <option value="Airway adjunct">Airway adjunct</option>
              <option value="Bleeding control">Bleeding control</option>
              <option value="Splinting">Splinting</option>
              <option value="CPR">CPR</option>
              <option value="AED applied">AED applied</option>
              <option value="Narcan administered">Narcan administered</option>
              <option value="Aspirin administered">Aspirin administered</option>
              <option value="Patient refused treatment">Patient refused treatment</option>
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Narrative</div>
          <textarea className="area mt-5 min-h-56" placeholder="Enter report narrative..." value={form.narrative} onChange={(e) => update("narrative", e.target.value)} />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="text-xl font-semibold">Crew</div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input className="field" placeholder="Lead Provider" value={form.crewLead} onChange={(e) => update("crewLead", e.target.value)} />
            <input className="field" placeholder="Driver" value={form.crewDriver} onChange={(e) => update("crewDriver", e.target.value)} />
            <input className="field" placeholder="Crew Member 1" value={form.crewMemberOne} onChange={(e) => update("crewMemberOne", e.target.value)} />
            <input className="field" placeholder="Crew Member 2" value={form.crewMemberTwo} onChange={(e) => update("crewMemberTwo", e.target.value)} />
          </div>
        </div>

        {error && <div className="mt-5 text-red-300">{error}</div>}

        <div className="mt-6 flex flex-wrap gap-3">
          <button disabled={saving} onClick={() => saveReport("draft")} className="h-12 rounded-2xl bg-white/10 px-6 hover:bg-white/20 disabled:opacity-60">
            Save Draft
          </button>
          <button disabled={saving} onClick={() => saveReport("submit")} className="h-12 rounded-2xl bg-red-600 px-6 hover:bg-red-500 disabled:opacity-60">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}