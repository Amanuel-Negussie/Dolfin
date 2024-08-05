import React from "react";
import { Calendar } from "@/components/ui/calendar";

interface RecurringCalendarProps {
  highlightedDates: Date[];
}

export const RecurringCalendar: React.FC<RecurringCalendarProps> = ({ highlightedDates }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="w-full h-full max-w-sm max-h-screen overflow-auto">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        modifiers={{
          highlighted: highlightedDates,
        }}
        modifiersClassNames={{
          highlighted: 'highlighted',
        }}
        className="w-full h-full rounded-md border shadow"
      />
    </div>
  );
};

