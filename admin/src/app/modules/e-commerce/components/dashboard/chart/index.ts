import { Component, OnChanges, Input, ViewChild, ElementRef, SimpleChanges, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import * as Chart from 'chart.js/dist/Chart.min.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js';

@Component({
  selector: 'dashboard-chart',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ChartComponent implements OnChanges {
  @Input() chartName: string;
  @Input() config: any = {};
  @Input() loading: boolean = false;
  @ViewChild('chart', { static: true }) chart: ElementRef;
  private _chart: Chart;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('loading') && changes.loading.currentValue === false) {
      if (this._chart) {
        this._chart.destroy();
      }
      this.initChart();
    }
  }

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    if (!this.config) {
      return;
    }

    if (this._chart) {
      this._chart.destroy();
    }

    const { type, labels, datasets, options } = this.config;
    const chartOptions: Chart.ChartOptions = {
      ...options,
    }

    this._chart = new Chart(this.chart.nativeElement, {
      type,
      data: { labels, datasets },
      options: chartOptions,
      plugins: [
        ChartDataLabels
      ]
    });
  }
}
