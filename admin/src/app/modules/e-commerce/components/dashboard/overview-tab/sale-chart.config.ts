

import * as moment from 'moment';
import { AdminConfig } from '@core/configs';
import { formatCurrency, formatNumber } from '@angular/common';

const config = (type, labels, datasets) => {
  let timeUnit = 'day';
  let timeUnitStepSize = 3;
  const first = datasets[0];
  const last = datasets[datasets.length - 1];

  if (first && last) {
    const rangeInDays = moment(last.t).diff(moment(first.t), 'days');
    const rangeInWeeks = moment(last.t).diff(moment(first.t), 'weeks');
    timeUnit = 'day';

    switch (true) {
      case rangeInWeeks === 0 && rangeInDays < 1:
      case rangeInWeeks === 0 && rangeInDays >= 1:
        timeUnitStepSize = 1;
        break;
      case rangeInWeeks <= 12:
        timeUnitStepSize = rangeInWeeks;
        break;
      case rangeInWeeks > 12 && rangeInWeeks < 30:
        timeUnitStepSize = rangeInWeeks + 2;
        break;
      case rangeInWeeks >= 30 && rangeInWeeks <= 52:
        timeUnitStepSize = rangeInWeeks + 4;
        break;
      case rangeInWeeks > 52 && rangeInWeeks <= 104:
        timeUnitStepSize = rangeInWeeks + 8;
        break;
      case rangeInWeeks > 104:
        timeUnitStepSize = rangeInWeeks + 10;
        break;
    }
  }

  return {
    type: type,
    labels: labels,
    datasets: [{
      data: datasets,
      scaleStartValue: 0,
      scaleSteps: 0,
      scaleOverride: false,
      scaleStepWidth: 0.5,
      backgroundColor: "rgba(255, 133, 27, 0.2)",
      pointBackgroundColor: '#fff',
      borderColor: '#ff851b',
      borderWidth: 1,
      pointBorderColor: '#ff851b',
    }],
    options: {
      spanGaps: false,
      steppedLine: 'middle',
      scaleStartValue: 0,
      responsive: true,
      legend: false,
      hover: {
        intersect: false,
      },
      ticks: {
        autoSkip: true,
        beginAtZero: true,
        major: {
          enabled: true,
        },
        mirror: true,
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            // Include a dollar sign in the ticks
            callback: (value, index, values) => {
              const money = new Intl.NumberFormat([], {
                minimumFractionDigits: 0
              }).format(Number(value) / 1e3);

              return `${money}K VNĐ`;
            }
          }
        }],
        xAxes: [{
          beginAtZero: true,
          autoSkip: true,
          type: 'time',
          time: {
            unit: timeUnit,
            minUnit: 'hour',
            stepSize: timeUnitStepSize,
            round: timeUnit,
            displayFormats: {
              'hour': 'HH:mm',
              'day': timeUnitStepSize < 10 ? 'MMM DD' : 'MMM DD, YYYY',
            },
            adapters: {
              date: moment,
            },
          },
        }]
      },
      tooltips: {
        mode: 'label',
        backgroundColor: 'rgba(74, 74, 74, .6)',
        titleMarginBottom: 10,
        callbacks: {
          title: (tooltipItems) => {
            const currentItem = tooltipItems[0];
            return moment(currentItem.label).format('MM/DD/YYYY');
          },
          label: (tooltipItem, data) => {
            const currentItem = data.datasets[tooltipItem.datasetIndex];
            const saleMoney = new Intl.NumberFormat([], {
              minimumFractionDigits: 0
            }).format(Number(currentItem.data[tooltipItem.index].y) / 1e3) + 'K VNĐ';
            const orders = new Intl.NumberFormat([], {
              minimumFractionDigits: 0
            }).format(Number(currentItem.data[tooltipItem.index].TotalOrder));
            
            return [`Sales: ${saleMoney}`, `Orders: ${orders}`];
          },
          labelColor: () => {
            return {
              borderColor: 'rgba(255, 133, 27, 0.5)',
              backgroundColor: 'rgba(255, 133, 27, 0.5)',
            }
          },
        },
      },
      plugins: {
        datalabels: {
          display: false,
        }
      }
    }
  }
}

export default config;
