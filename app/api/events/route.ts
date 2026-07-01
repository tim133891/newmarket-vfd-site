export const runtime = "nodejs";

function unfoldIcs(text: string) {
  return text.replace(/\r?\n[ \t]/g, "");
}

function cleanIcsText(value: string) {
  return value
    .replace(/\\,/g, ",")
    .replace(/\\n/g, " ")
    .replace(/\\\\/g, "\\")
    .trim();
}

function getIcsValue(block: string, key: string) {
  const line = block
    .split(/\r?\n/)
    .find((item) => item.startsWith(`${key}:`) || item.startsWith(`${key};`));

  if (!line) return "";

  return cleanIcsText(line.substring(line.indexOf(":") + 1));
}

function parseIcsDate(value: string) {
  if (!value) return "";

  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }

  if (/^\d{8}T\d{6}Z$/.test(value)) {
    return new Date(
      `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}Z`
    ).toISOString();
  }

  if (/^\d{8}T\d{6}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}`;
  }

  return value;
}

function getCategory(title: string) {
  const lower = title.toLowerCase();

  if (lower.startsWith("event -")) return "event";
  if (lower.startsWith("rental -")) return "rental";
  if (lower.startsWith("blocked -")) return "blocked";

  return "other";
}

export async function GET() {
  try {
    const calendarUrl =
      "https://calendar.google.com/calendar/ical/kmclayburn%40gmail.com/public/basic.ics";

    const response = await fetch(calendarUrl, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch calendar" },
        { status: 500 }
      );
    }

    const text = unfoldIcs(await response.text());

    const events = text
      .split("BEGIN:VEVENT")
      .slice(1)
      .map((block) => {
        const title = getIcsValue(block, "SUMMARY");

        return {
          title,
          category: getCategory(title),
          start: parseIcsDate(getIcsValue(block, "DTSTART")),
          end: parseIcsDate(getIcsValue(block, "DTEND")),
          description: getIcsValue(block, "DESCRIPTION"),
          location: getIcsValue(block, "LOCATION"),
        };
      });

    return Response.json(events);
  } catch {
    return Response.json(
      { error: "Failed to load calendar events" },
      { status: 500 }
    );
  }
}