export function normalizeDbDate(
  dateInput: Date | string | null | undefined
): Date | null {
  if (!dateInput) return null;

  if (typeof dateInput === "string") {
    // Parse string as local time
    const normalized = dateInput.replace("T", " ").split(".")[0];
    const [datePart, timePart] = normalized.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes, seconds] = (timePart || "00:00:00")
      .split(":")
      .map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  }

  // Date object from database - use UTC values as local values
  const year = dateInput.getUTCFullYear();
  const month = dateInput.getUTCMonth();
  const day = dateInput.getUTCDate();
  const hours = dateInput.getUTCHours();
  const minutes = dateInput.getUTCMinutes();
  const seconds = dateInput.getUTCSeconds();

  return new Date(year, month, day, hours, minutes, seconds);
}
