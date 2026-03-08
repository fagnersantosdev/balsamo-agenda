export function generateTimeSlots(
  openHour: number,
  closeHour: number,
  duration: number
) {
  const slots: string[] = [];

  for (let h = openHour; h + duration / 60 <= closeHour; h++) {
    const hour = String(h).padStart(2, "0");
    slots.push(`${hour}:00`);
  }

  return slots;
}
