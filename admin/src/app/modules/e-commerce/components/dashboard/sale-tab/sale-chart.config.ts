import { chunk, pickBy } from 'lodash';
import { formatNumber, formatCurrency } from '@angular/common';
import { AdminConfig } from '@app/core';

const config = (type, labels, datasets) => {
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
      maintainAspectRatio: false,
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
          ticks: {
            lineHeight: 1.5,
            callback: (label, index, labels) => {
              if (!label) {
                return;
              }

              let chunkNumber = 1;
              if (labels.length <= 5) {
                chunkNumber = 3;
              }

              if (labels.length > 5 && labels.length <= 10) {
                chunkNumber = 1;
              }

              if (labels.length > 10 && labels.length <= 20) {
                chunkNumber = 1;
              }
              const nameComponents = label.split('|');
              const code = nameComponents.pop();
              const name = nameComponents.join(' ');
              const labelLines = chunk(name.split(' ').filter(i => i), chunkNumber).map(item => item.join(' '));
              labelLines.push(code);

              return labelLines;
            }
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const currentItem = data.datasets[tooltipItem.datasetIndex];
            const currentItemTooltip = currentItem.data[tooltipItem.index];

            const revenueMoney = new Intl.NumberFormat([], {
              minimumFractionDigits: 0
            }).format(Number(currentItemTooltip.Revenue) / 1e3) + 'K VNĐ';
            const quantity = new Intl.NumberFormat([], {
              minimumFractionDigits: 0
            }).format(Number(currentItemTooltip.Quantity));

            return [`Revenue: ${revenueMoney}`, `Quantity: ${quantity}`];
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
          align: 'top',
          anchor: 'end',
          color: '#ff851b',
          formatter: function (value) {
            return new Intl.NumberFormat([], {
              minimumFractionDigits: 0
            }).format(Number(value.Revenue) / 1e3) + 'K VNĐ';
          }
        }
      },
    }
  }
}

export default config;
