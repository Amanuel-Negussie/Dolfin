import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, getISOWeek } from 'date-fns';

interface Transaction {
  date: string;
  amount: number;
}

export const preprocessDailyData = (data: Transaction[]) => {
  const processedData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString(), // Adjust format if needed
    amount: item.amount
  }));

  // Sort the data in ascending order by date
  return processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const preprocessWeeklyData = (data: Transaction[]) => {
  const minDate = new Date(Math.min(...data.map(d => new Date(d.date).getTime())));
  const maxDate = new Date(Math.max(...data.map(d => new Date(d.date).getTime())));

  const weeks = eachWeekOfInterval({
    start: startOfWeek(minDate),
    end: endOfWeek(maxDate)
  });

  const weeklyData = weeks.map(week => {
    const weekData = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfWeek(week) && itemDate <= endOfWeek(week);
    });

    if (weekData.length === 0) {
      return { date: `Week ${getISOWeek(week)} - ${format(startOfWeek(week), 'MMM dd')} to ${format(endOfWeek(week), 'MMM dd')}`, amount: 0 };
    }

    const latestTransaction = weekData.reduce((latest, current) => 
      new Date(current.date) > new Date(latest.date) ? current : latest
    );

    const weekLabel = `Week ${getISOWeek(week)} - ${format(startOfWeek(week), 'MMM dd')} to ${format(endOfWeek(week), 'MMM dd')}`;
    return { date: weekLabel, amount: latestTransaction.amount };
  });

  // Sort the weekly data in ascending order by date
  return weeklyData.sort((a, b) => new Date(a.date.split(' - ')[1].split(' to ')[0]).getTime() - new Date(b.date.split(' - ')[1].split(' to ')[0]).getTime());
};

export const preprocessMonthlyData = (data: Transaction[]) => {
  const minDate = new Date(Math.min(...data.map(d => new Date(d.date).getTime())));
  const maxDate = new Date(Math.max(...data.map(d => new Date(d.date).getTime())));

  const months = eachMonthOfInterval({
    start: startOfMonth(minDate),
    end: endOfMonth(maxDate)
  });

  const monthlyData = months.map(month => {
    const monthData = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfMonth(month) && itemDate <= endOfMonth(month);
    });

    if (monthData.length === 0) {
      return { date: format(month, 'MMM yyyy'), amount: 0 };
    }

    const latestTransaction = monthData.reduce((latest, current) => 
      new Date(current.date) > new Date(latest.date) ? current : latest
    );

    return { date: format(month, 'MMM yyyy'), amount: latestTransaction.amount };
  });

  // Sort the monthly data in ascending order by date
  return monthlyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
