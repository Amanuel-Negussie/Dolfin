import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, getISOWeek } from 'date-fns';

interface Transaction {
  date: string;
  amount: number;
}

export const preprocessDailyData = (data: Transaction[]) => {
  return data.map(item => ({
    date: new Date(item.date).toLocaleDateString(), // Adjust format if needed
    amount: item.amount
  }));
};

export const preprocessWeeklyData = (data: Transaction[]) => {
  const minDate = new Date(Math.min(...data.map(d => new Date(d.date).getTime())));
  const maxDate = new Date(Math.max(...data.map(d => new Date(d.date).getTime())));

  const weeks = eachWeekOfInterval({
    start: startOfWeek(minDate),
    end: endOfWeek(maxDate)
  });

  return weeks.map(week => {
    const weekData = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek(week) && itemDate <= endOfWeek(week);
    });

    const weekLabel = `Week ${getISOWeek(week)} - ${format(startOfWeek(week), 'MMM dd')} to ${format(endOfWeek(week), 'MMM dd')}`;
    const amount = weekData.reduce((acc, cur) => acc + cur.amount, 0);

    return { date: weekLabel, amount };
  });
};

export const preprocessMonthlyData = (data: Transaction[]) => {
  const minDate = new Date(Math.min(...data.map(d => new Date(d.date).getTime())));
  const maxDate = new Date(Math.max(...data.map(d => new Date(d.date).getTime())));

  const months = eachMonthOfInterval({
    start: startOfMonth(minDate),
    end: endOfMonth(maxDate)
  });

  return months.map(month => {
    const monthData = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfMonth(month) && itemDate <= endOfMonth(month);
    });

    const monthLabel = format(month, 'MMM yyyy');
    const amount = monthData.reduce((acc, cur) => acc + cur.amount, 0);

    return { date: monthLabel, amount };
  });
};
