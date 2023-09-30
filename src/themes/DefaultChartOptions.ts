import { Options } from 'highcharts';

const DefaultChartOptions: Options = {
  accessibility: { enabled: false },
  title: undefined,

  yAxis: {
    title: {
      useHTML: true,
      text: '<span>Depth</span><small>&nbsp;&nbsp;(log 10)</small>',
    },
    type: 'logarithmic',
  },

  xAxis: {
    title: {
      text: 'Position in genome',
    },
  },

  tooltip: {
    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
    valueDecimals: 0,
    split: true,
  },

  legend: { enabled: false },

  credits: {
    enabled: false,
  },
};

export default DefaultChartOptions;
