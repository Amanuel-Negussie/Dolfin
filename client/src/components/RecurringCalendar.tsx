import React from "react";
import { Calendar } from "@/components/ui/calendar";

export const RecurringCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Define the hardcoded dates to be highlighted
  const highlightedDates = [
    new Date(2024, 6, 15), // July 15, 2024
    new Date(2024, 6, 22), // July 22, 2024
    new Date(2024, 7, 1),  // August 1, 2024
  ];

  return (
    <div className="w-full h-full">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        highlightedDates={highlightedDates} // Pass the highlighted dates
        className="w-full h-full rounded-md border shadow"
      />
    </div>
  );
};