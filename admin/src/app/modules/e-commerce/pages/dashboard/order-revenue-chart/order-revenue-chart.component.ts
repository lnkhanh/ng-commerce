import {
  Component, OnInit, Input, AfterViewInit,
  OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewEncapsulation
} from '@angular/core';

import { orderBy, union, map, max } from 'lodash';
import * as moment from 'moment';
import { CurrencyPipe, formatNumber } from '@angular/common';
// Chart
import { Chart } from 'chart.js/dist/Chart.js';

import { OrderRevenueSummaryModel } from '@app/modules/e-commerce/_models/dashboard.model';
import { AdminConfig } from '@app/core';

@Component({
  selector: 'order-revenue-chart',
  templateUrl: './order-revenue-chart.component.html',
  styleUrls: ['./order-revenue-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrderRevenueChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('data') orderRevenueSummary: OrderRevenueSummaryModel[];
  @Input() loading: boolean;

  public dataChart = {
    labels: [],
    datasets: []
  };
  maxTotal: number;
  minTotal: number = 0;


  /**
   * Directive Constructor
   *
   * @param el: ElementRef
   * @param _layoutConfigService: LayoutConfigService
   */
  constructor(
    private _currencyPipe: CurrencyPipe,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  getBarItem(): any {
    return {
      type: 'bar',
      label: '',
      scaleStartValue: 0,
      scaleSteps: 0,
      scaleOverride: false,
      scaleStepWidth: 0.5,
      pointBackgroundColor: '#fff',
      borderWidth: 1,
      pointBorderColor: '',
      backgroundColor: '',
      borderColor: '',
      data: [],
      index: 0,
      yAxisID: "y-bar-1",
    };
  }
  getLineItem(): any {
    return {
      type: 'line',
      label: '',
      scaleStartValue: 0,
      scaleSteps: 0,
      scaleOverride: false,
      scaleStepWidth: 0.5,
      pointBackgroundColor: '#fff',
      borderColor: '#ff851b',
      borderWidth: 1,
      pointBorderColor: '#ff851b',
      backgroundColor: '',
      fill: false,
      data: [],
      index: 0,
      yAxisID: "y-line-1",
    };
  }

  generateLable(data: OrderRevenueSummaryModel[]): any[] {
    return data.map(x => this.convertStringToDate(x.OrderDate));
  }

  generateDataSet(data: OrderRevenueSummaryModel[]): { dataSets: any[], statusMap: string[] } {
    let columnMap: string[] = [];
    let lineMap: string[] = ['Total Revenue', 'Total Freight', 'Total Tax'];

    let colorColumn: string[] = [
      'rgb(54, 162, 235)',
      'rgb(75, 192, 192)',
      'rgb(255, 159, 64)',
      'rgb(153, 102, 255)',
      'rgb(255, 99, 132)',
      'rgb(255, 205, 86)',
      'rgb(201, 203, 207)',
    ];
    let colorLine: string[] = [];
    colorLine.push(Chart.helpers.color('black').alpha(0).hexString());
    colorLine.push(Chart.helpers.color('gold').alpha(0).hexString());
    colorLine.push(Chart.helpers.color('#f67019').alpha(0).hexString());

    // map array string Status
    data.forEach(item => {
      columnMap.push(...item.Status);
    })
    columnMap = union(columnMap);

    // return dataSet
    let dataSets = [];

    columnMap.forEach((name, index) => {
      let barItem = this.getBarItem();
      barItem.label = name;
      barItem.backgroundColor = Chart.helpers.color(colorColumn[index]).alpha(0.5).rgbString();
      barItem.borderColor = colorColumn[index];
      barItem.pointBorderColor = colorColumn[index];
      barItem.index = 10 - index;
      dataSets.push(barItem);
    });

    lineMap.forEach((name, index) => {
      let lineItem = this.getLineItem();
      lineItem.label = name;
      lineItem.borderColor = colorLine[index];
      lineItem.backgroundColor = colorLine[index];
      lineItem.index = 20 - index;
      dataSets.push(lineItem);
    });

    return {
      dataSets: dataSets,
      statusMap: columnMap
    };
  }

  exportChartData(data: OrderRevenueSummaryModel[]): any[] {
    const { dataSets, statusMap } = this.generateDataSet(data);
    let statusLength = statusMap.length;
    let statusKeys = {};
    statusMap.forEach(status => {
      statusKeys[status] = [];
    });

    let totalRevenue = [],
      totalFreight = [],
      totalTax = [],
      labelTime = [];
    data.forEach((item: OrderRevenueSummaryModel, index: number) => {
      let itemStatus = item.Status;
      // export Total Order
      let xData = this.convertStringToDate(item.OrderDate);
      // const xData = item.OrderDate;
      labelTime.push(xData);
      totalRevenue.push({
        x: xData,
        y: item.TotalRevenue,
        qty: item.TotalOrder
      });
      totalFreight.push({
        x: xData,
        y: item.TotalShippingCost
      });
      totalTax.push({
        x: xData,
        y: item.TotalTax
      });

      itemStatus.forEach((status, sIndex) => {
        statusKeys[status].push({
          x: xData,
          y: item.Revenues[sIndex],
          qty: item.Orders[sIndex]
        })
      });
    });
    map(statusKeys, (value: any, key: string) => {
      const valueTime: string[] = value.map((i: any) => i.x);
      const missTime = labelTime.filter(o => valueTime.indexOf(o) < 0);
      missTime.forEach(value => {
        statusKeys[key].push({
          x: value,
          y: 0, qty: 0
        });
      });
      statusKeys[key] = orderBy(statusKeys[key], 'x', 'asc');
    })
    dataSets.forEach((item) => {
      if (item.type === 'bar') {
        item.data = statusKeys[item.label];
      }
    });

    dataSets[statusLength].data = totalRevenue;
    dataSets[statusLength + 1].data = totalFreight;
    dataSets[statusLength + 2].data = totalTax;

    this.maxTotal = max(data.map(item => item.Revenues.length > 0 ? item.Revenues.reduce((a, b) => a + b) : 0));
    return dataSets;
  }

  renderChart(): any {
    if (!this.orderRevenueSummary || this.orderRevenueSummary.length === 0) return null;

    const labels = this.generateLable(this.orderRevenueSummary);
    const datasets = this.exportChartData(this.orderRevenueSummary).sort((a, b) => b.index - a.index);

    let timeUnit = 'day';
    let timeUnitStepSize = 3;
    const first = labels[0];
    const last = labels[labels.length - 1];

    if (first && last) {
      const rangeInDays = moment(last).diff(moment(first), 'days');
      const rangeInWeeks = moment(last).diff(moment(first), 'weeks');

      switch (true) {
        case rangeInWeeks === 0 && rangeInDays === 0:
          timeUnit = 'day';
          timeUnitStepSize = 1;
          break;
        case rangeInWeeks === 0 && rangeInDays >= 1:
          timeUnit = 'day';
          timeUnitStepSize = 1;
          break;
        case rangeInWeeks <= 12:
          timeUnit = 'day';
          timeUnitStepSize = rangeInWeeks;
          break;
        case rangeInWeeks > 12 && rangeInWeeks < 30:
          timeUnit = 'day';
          timeUnitStepSize = rangeInWeeks + 2;
          break;
        case rangeInWeeks >= 30 && rangeInWeeks <= 52:
          timeUnit = 'day';
          timeUnitStepSize = rangeInWeeks + 4;
          break;
        case rangeInWeeks > 52 && rangeInWeeks <= 104:
          timeUnit = 'day';
          timeUnitStepSize = rangeInWeeks + 8;
          break;
        case rangeInWeeks > 104:
          timeUnit = 'day';
          timeUnitStepSize = rangeInWeeks + 10;
          break;
      }
    }

    const config = {
      type: 'bar',
      labels: labels,
      datasets: datasets,
      options: {
        title: { display: false, },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: false
          },
          onHover: function (e) {
            e.target.style.cursor = 'pointer';
          },
          onLeave: function (e) {
            e.target.style.cursor = 'auto';
          }
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: 'index',
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10,
          backgroundColor: 'rgba(74, 74, 74, 0.9)',
          titleMarginBottom: 10,
          callbacks: {
            title: (tooltipItem, data) => {
              const xLabel = tooltipItem[0].xLabel;
              return moment(xLabel).format(AdminConfig.format.date);
            },
            labelColor: (tooltipItem, chart) => {
              const itemDataset = chart.config.data.datasets[tooltipItem.datasetIndex];
              return {
                borderColor: itemDataset.backgroundColor,
                backgroundColor: itemDataset.backgroundColor
              };
            },
            label: (tooltipItem, data) => {
              const itemData = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              let label = `${data.datasets[tooltipItem.datasetIndex].label}` || '';

              if (label) label += ': ';
              label += this._currencyPipe.transform(tooltipItem.yLabel);
              if (itemData.qty) {
                label += ' - Qty: ' + (itemData.qty ? formatNumber(itemData.qty, AdminConfig.locale) : '--');
              }

              if (tooltipItem.datasetIndex > 2) {
                return tooltipItem.yLabel > 0 ? label : '';
              }

              return label;
            }
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 10,
            top: 5,
            bottom: 0
          }
        },
        elements: {
          point: {
            radius: 4,
            borderWidth: 12
          },
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            stacked: true,
            autoSkip: true,
            type: 'time',
            time: {
              unit: timeUnit,
              minUnit: 'day',
              stepSize: timeUnitStepSize,
              round: 'day',
              displayFormats: {
                'hour': 'HH:mm',
                'day': timeUnitStepSize < 10 ? 'MMM DD' : 'MMM DD, YYYY',
              },
              adapters: {
                date: moment,
              },
            },
          }],
          yAxes: [{
            type: 'linear',
            display: true,
            stacked: true,
            position: 'left',
            id: 'y-bar-1',
            ticks: {
              beginAtZero: true,
              min: 0,
              suggestedMax: this.maxTotal,
              // Include a dollar sign in the ticks
              callback: (value, index, values) => {
                return this._currencyPipe.transform(value);
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Revenue'
            },
          }, {
            display: false,
            id: 'y-line-1',
            ticks: {
              beginAtZero: true,
              min: 0,
              suggestedMax: this.maxTotal
            },
            scaleLabel: {
              display: false
            },
          }]
        },
        plugins: {
          datalabels: {
            display: false,
          }
        }
      },
    };
    return config;
  }

  convertStringToDate(date: string): any {
    return moment(date, 'YYYY-MM-DD').format();
  }
  convertDateToTimestamp(date: string): string {
    return moment(date, 'YYYY-MM-DD').hour(0).minute(0).unix().toString();
  }
}
