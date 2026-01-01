"use client";

import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type Availability = {
  dayOfWeek: number;
  active: boolean;
};

type BookingCalendarProps = {
  selected: Date | null;
  availability: Availability[];
  onSelect: (date: Date | undefined) => void;
};

export default function BookingCalendar({
  selected,
  availability,
  onSelect,
}: BookingCalendarProps) {
  function isDisabled(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = date.getDay();
    const rule = availability.find(a => a.dayOfWeek === day);

    return !rule || !rule.active || date < today;
  }

  return (
    <div className="bg-white rounded-xl border border-[#D6A77A]/40 p-4">
      <DayPicker
        mode="single"
        selected={selected ?? undefined}
        onSelect={onSelect}
        disabled={isDisabled}
        locale={ptBR}
        weekStartsOn={1}
        className="balsamo-calendar"
      />
    </div>
  );
}
