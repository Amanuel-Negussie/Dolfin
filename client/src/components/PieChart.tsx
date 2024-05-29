import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieChart = ({ spendingByCategory }: { spendingByCategory: { name: string, y: number }[] }) => {
  const totalSpent = spendingByCategory.reduce((total, category) => total + category.y, 0);

  const options: Highcharts.Options = {
    chart: { type: 'pie' },
    title: { text: `Total Spending by Category` },
    subtitle: { text: `Total Spent: $${totalSpent.toFixed(2)}` },
    tooltip: {
      pointFormatter: function () {
        return `<b>${(this.name as string)}</b>: $${(this.y as number).toFixed(2)}`;
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: ${point.y:.2f}',
        },
        showInLegend: true
      }
    },
    series: [{
      type: 'pie',
      name: 'Amount',
      data: spendingByCategory
    }]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
