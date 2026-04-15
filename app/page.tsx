"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Flame,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Users,
  Building2,
  ChevronRight,
  Siren,
  BadgeAlert
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const eventsSeed = [
  {
    id: 1,
    title: "Spring Pancake Breakfast",
    date: "April 27, 2026",
    time: "7:00 AM – 11:00 AM",
    type: "Community",
    desc: "A family-friendly fundraiser with breakfast, raffle baskets, and station tours."
  },
  {
    id: 2,
    title: "Summer Safety Open House",
    date: "June 14, 2026",
    time: "1:00 PM – 4:00 PM",
    type: "Education",
    desc: "Meet firefighters, explore the trucks, and learn summer fire safety tips."
  },
  {
    id: 3,
    title: "Annual Fish Fry",
    date: "August 22, 2026",
    time: "4:00 PM – 8:00 PM",
    type: "Fundraiser",
    desc: "A department tradition with carryout meals, desserts, and community support."
  },
  {
    id: 4,
    title: "Holiday Craft & Vendor Fair",
    date: "November 21, 2026",
    time: "10:00 AM – 3:00 PM",
    type: "Rental",
    desc: "Local vendors, holiday gifts, concessions, and rental booth opportunities."
  }
];

const monthGrid = [
  { day: 1, status: "open" },
  { day: 2, status: "open" },
  { day: 3, status: "event" },
  { day: 4, status: "open" },
  { day: 5, status: "booked" },
  { day: 6, status: "booked" },
  { day: 7, status: "open" },
  { day: 8, status: "open" },
  { day: 9, status: "open" },
  { day: 10, status: "event" },
  { day: 11, status: "open" },
  { day: 12, status: "booked" },
  { day: 13, status: "open" },
  { day: 14, status: "open" },
  { day: 15, status: "open" },
  { day: 16, status: "booked" },
  { day: 17, status: "open" },
  { day: 18, status: "open" },
  { day: 19, status: "open" },
  { day: 20, status: "event" },
  { day: 21, status: "open" },
  { day: 22, status: "booked" },
  { day: 23, status: "open" },
  { day: 24, status: "open" },
  { day: 25, status: "open" },
  { day: 26, status: "open" },
  { day: 27, status: "event" },
  { day: 28, status: "open" },
  { day: 29, status: "booked" },
  { day: 30, status: "open" }
] as const;

const statusTone: Record<string, string> = {
  open: "bg-white/10 text-white border-white/10",
  booked: "bg-red-500/20 text-red-100 border-red-400/20",
  event: "bg-amber-400/20 text-amber-100 border-amber-300/20"
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  details: string;
};

export default function VolunteerFireDepartmentWebsite() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    date: "",
    details: ""
  });

  const stats = useMemo(
    () => [
      { icon: ShieldCheck, label: "Serving Since", value: "1954" },
      { icon: Users, label: "Volunteer Members", value: "32" },
      { icon: CalendarDays, label: "Community Events", value: "12+ / Year" },
      { icon: Building2, label: "Hall Rental Space", value: "Available" }
    ],
    []
  );

  const onChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.24),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_24%)]" />

      <div className="relative z-10">
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-950/70">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-wide">New Market Volunteer Fire Department</div>
                <div className="text-sm text-slate-100">Public Service • Emergency Response • Community Support</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-white/90 md:flex-nowrap md:gap-6">
              <a href="#events" className="transition hover:text-white">Events</a>
              <a href="#rental" className="transition hover:text-white">Rent Our Hall</a>
              <a href="#calendar" className="transition hover:text-white">Calendar</a>
              <a href="#contact" className="transition hover:text-white">Contact</a>
            </div>
          </div>
        </div>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="rounded-full border border-red-400/20 bg-red-500/15 px-4 py-1 text-red-100">
                Proudly Serving Our Community
              </Badge>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }} className="space-y-5">
              <div className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                Serving the New Market community with pride, professionalism, and dedication.
              </div>
              <div className="max-w-2xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">
                Stay up to date with department events, fundraisers, and hall rentals. We make it easy for the New Market community to stay connected and get involved.
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }} className="flex flex-col gap-4 sm:flex-row">
              <Button className="h-12 rounded-2xl bg-red-600 px-6 text-base hover:bg-red-500">
                View Events <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-12 rounded-2xl border-white/15 bg-white/5 px-6 text-base text-white hover:bg-white/10">
                Request Rental
              </Button>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 + index * 0.05 }}
                  >
                    <Card className="rounded-3xl border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                      <CardContent className="p-5">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-sm text-slate-100">{item.label}</div>
                        <div className="mt-1 text-2xl font-semibold text-white">{item.value}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="border-b border-white/10 bg-gradient-to-r from-red-700/50 via-red-600/30 to-amber-400/20 p-6">
                  <div className="flex items-start justify-between gap-4 sm:items-center">
                    <div>
                      <div className="text-xl font-semibold text-white">Upcoming in New Market</div>
                      <div className="mt-1 text-sm text-white/90">Events, hall rentals, and local community activities</div>
                    </div>
                    <div className="rounded-2xl bg-black/20 p-3">
                      <Siren className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 sm:p-6">
                  {eventsSeed.slice(0, 3).map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-medium text-white">{item.title}</div>
                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-100">
                            <span className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              {item.date}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {item.time}
                            </span>
                          </div>
                        </div>
                        <Badge className="rounded-full border border-white/10 bg-white/10">{item.type}</Badge>
                      </div>
                      <div className="mt-3 text-sm leading-7 text-slate-100">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section id="events" className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.24em] text-red-300">Annual Schedule</div>
              <div className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                Events serving New Market and surrounding communities
              </div>
            </div>
            <div className="max-w-2xl text-slate-100">
              Stay informed about local fundraisers, department events, and community gatherings hosted by the New Market Volunteer Fire Department.
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {eventsSeed.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <Card className="h-full rounded-[2rem] border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur-xl">
                  <CardContent className="p-5 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-2xl font-semibold text-white">{item.title}</div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-100">
                          <span className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {item.date}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {item.time}
                          </span>
                        </div>
                      </div>
                      <Badge className="rounded-full border border-white/10 bg-red-500/15 text-red-100">{item.type}</Badge>
                    </div>
                    <div className="mt-5 text-base leading-8 text-slate-100">{item.desc}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="rental" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <Card className="rounded-[2rem] border-white/10 bg-gradient-to-br from-red-700/20 via-white/5 to-amber-400/10 shadow-xl shadow-black/20 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-8">
              <div className="text-sm uppercase tracking-[0.24em] text-amber-200">Facility Rental</div>
              <div className="mt-4 text-3xl font-semibold text-white">Rent the New Market Fire Department Hall</div>
              <div className="mt-5 text-base leading-8 text-slate-100">
                Check availability, view rental details, and submit a request for our hall all in one place.
              </div>

              <div className="mt-8 space-y-4">
                {[
                  "Live availability calendar",
                  "Rental request form",
                  "Pricing, rules, and capacity",
                  "Automatic inquiry collection for your team"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <ShieldCheck className="h-5 w-5 text-red-200" />
                    <span className="text-slate-100">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5">
                <div className="flex items-start gap-3">
                  <BadgeAlert className="mt-0.5 h-5 w-5 text-amber-200" />
                  <div className="text-sm leading-7 text-amber-50">
                    Our calendar shows current availability. For booking confirmation, a department member will follow up after your request is submitted.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-8">
              <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="text-2xl font-semibold text-white">Rental Request</div>
                  <div className="mt-1 text-sm text-slate-100">Submit a hall rental request</div>
                </div>
                <Badge className="rounded-full border border-white/10 bg-white/10">Fast Intake</Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="Full name"
                  className="h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-slate-200"
                />
                <Input
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="Email address"
                  className="h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-slate-200"
                />
                <Input
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  placeholder="Phone number"
                  className="h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-slate-200"
                />
                <Input
                  value={form.date}
                  onChange={(e) => onChange("date", e.target.value)}
                  placeholder="Requested date"
                  className="h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-slate-200"
                />
              </div>

              <Textarea
                value={form.details}
                onChange={(e) => onChange("details", e.target.value)}
                placeholder="Tell us about your event, guest count, and setup needs"
                className="mt-4 min-h-[140px] rounded-3xl border-white/10 bg-black/20 text-white placeholder:text-slate-200"
              />
              <Button className="mt-5 h-12 rounded-2xl bg-red-600 px-6 text-base hover:bg-red-500">Submit Rental Request</Button>
            </CardContent>
          </Card>
        </section>

        <section id="calendar" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.24em] text-red-300">Availability</div>
              <div className="mt-3 text-3xl font-semibold text-white md:text-4xl">Hall Availability Calendar</div>
            </div>
            <div className="text-slate-100">Easily view available, booked, and event dates for hall rentals.</div>
          </div>

          <Card className="rounded-[2rem] border-white/10 bg-white/5 shadow-xl shadow-black/20 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-2xl font-semibold text-white">June 2026</div>
                  <div className="mt-1 text-sm text-slate-100">Sample visual availability calendar</div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge className="rounded-full border border-white/10 bg-white/10">Open</Badge>
                  <Badge className="rounded-full border border-red-400/20 bg-red-500/15 text-red-100">Booked</Badge>
                  <Badge className="rounded-full border border-amber-300/20 bg-amber-400/15 text-amber-100">Department Event</Badge>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-7 gap-3 text-center text-sm text-slate-100">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="pb-2 font-medium">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {Array.from({ length: 2 }).map((_, idx) => (
                      <div key={`blank-${idx}`} className="h-20 rounded-3xl border border-dashed border-white/5 bg-black/10" />
                    ))}
                    {monthGrid.map((item) => (
                      <div
                        key={item.day}
                        className={`flex h-20 flex-col justify-between rounded-3xl border p-3 ${statusTone[item.status]}`}
                      >
                        <div className="text-sm font-medium">{item.day}</div>
                        <div className="text-[11px] uppercase tracking-[0.18em] opacity-80">{item.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <Card className="rounded-[2rem] border-white/10 bg-gradient-to-r from-white/5 via-white/[0.04] to-red-500/10 shadow-xl shadow-black/20 backdrop-blur-xl">
            <CardContent className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-red-300">Get in Touch</div>
                <div className="mt-4 text-3xl font-semibold text-white">Proudly Serving New Market, Indiana</div>
                <div className="mt-5 max-w-2xl text-base leading-8 text-slate-100">
                  The New Market Volunteer Fire Department is committed to protecting lives, property, and serving our community through emergency response, education, and local events.
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 sm:items-center">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-100">Address</div>
                    <div className="font-medium text-white">201 W Main St, New Market, IN 47965</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 sm:items-center">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-100">Phone</div>
                    <div className="font-medium text-white">(765) 866-1346</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 sm:items-center">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-100">Email</div>
                    <div className="font-medium text-white">info@newmarketvfd.org</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}