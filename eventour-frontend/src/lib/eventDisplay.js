const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

const parseDateValue = (value) => {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    const match = trimmed.match(DATE_ONLY_RE);
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const toISODate = (value) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    const match = trimmed.match(DATE_ONLY_RE);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }

  const date = parseDateValue(value);
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (value) => {
  const iso = toISODate(value);
  if (!iso) return "";

  const match = iso.match(DATE_ONLY_RE);
  if (!match) return iso;

  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
};

export const normalizeTicketUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return null;

  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
};

export const getTicketUrl = (event) =>
  normalizeTicketUrl(
    event?.linkEntradas ??
      event?.link_entradas ??
      event?.ticketUrl ??
      event?.ticket_url ??
      null
  );
