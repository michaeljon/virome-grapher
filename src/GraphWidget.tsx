import React, { useRef, useState } from 'react';

import { regions } from './data/hcov-regions';

import Highcharts from 'highcharts';
import HighchartsReact, { HighchartsReactRefObject, HighchartsReactProps } from 'highcharts-react-official';

import FeatureList, { gene_type } from './FeatureList';
import GapTable from './GapTable';

import { OrganismType } from './Region';
import { Skeleton, Stack } from '@mui/material';

Highcharts.setOptions({
  chart: {
    style: {
      fontFamily: 'Roboto',
    },
  },
});

/**
 * returns an array with moving average of the input array
 * @param array - the input array
 * @param count - the number of elements to include in the moving average calculation
 * @param qualifier - an optional function that will be called on each
 *  value to determine whether it should be used
 */
function movingAvg(array: number[], count: number, qualifier?: (val: number) => boolean) {
  // calculate average for subarray
  const avg = function (array: number[], qualifier?: (val: number) => boolean) {
    let sum = 0,
      count = 0,
      val;
    for (var i in array) {
      val = array[i];

      if (!qualifier || qualifier(val)) {
        sum += val;
        count++;
      }
    }

    return sum / count;
  };

  const result = [];

  // pad beginning of result with null values
  for (let i = 0; i < count - 1; i++) result.push(null);

  // calculate average for each subarray and add to result
  for (let i = 0, len = array.length - count; i <= len; i++) {
    const val = avg(array.slice(i, i + count), qualifier);
    if (isNaN(val)) {
      result.push(null);
    } else {
      result.push(val);
    }
  }

  return result;
}

const GraphWidget: React.FC<{
  sequenceid: string | undefined;
  organism: OrganismType | undefined;
  sampleData: [] | undefined;
  genes: gene_type;
}> = ({ sequenceid, organism, sampleData, genes }) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: undefined,

    yAxis: {
      title: {
        useHTML: true,
        text: 'Depth<br/><small>(log 10)</small>',
      },
      type: 'logarithmic',
    },

    xAxis: {
      title: {
        text: 'Position in genome',
      },
    },

    legend: { enabled: false },

    credits: {
      enabled: false,
    },
  });
  const [feature, setFeature] = useState<string>('organism');
  const chartComponentRef = useRef<HighchartsReactRefObject>(null);

  const onFeatureChange = (f: string) => {
    console.log('Feature changing to ' + f);
    const new_series_data: number[] = [];
    const genome_data = sampleData?.map(d => d[1]) as number[];
    let xplotlines: Highcharts.XAxisPlotLinesOptions[] | undefined = undefined;
    let xtitle: Highcharts.XAxisTitleOptions | undefined = undefined;

    const series: Highcharts.SeriesOptionsType[] = [];

    setFeature(f);

    if (f) {
      if (f === 'organism') {
        for (let i = 0; i < genome_data.length; i++) {
          new_series_data.push(genome_data[i]);
        }
      } else {
        const start = (genes as any)[f].start;
        const stop = (genes as any)[f].stop;

        for (let i = start; i < stop; i++) {
          new_series_data.push(genome_data[i]);
        }
      }

      xplotlines =
        f === 'organism' && genes
          ? Object.keys(genes).map(g => ({
              color: 'orange',
              width: 1,
              value: (genes as any)[g].start,
              label: {
                text: g,
              },
            }))
          : undefined;

      if (f === 'organism' && genes && organism && regions[organism]?.region?.stop) {
        // add the tail
        xplotlines?.push({
          color: 'orange',
          width: 1,
          value: regions[organism]?.region?.stop || 0,
          label: {
            text: 'end',
          },
        });
      }

      series.push({
        id: 'primary',
        type: 'line',
        data: new_series_data,
        marker: { enabled: false },
      });

      if (f === 'organism') {
        series.push({
          type: 'spline',
          lineWidth: 2,
          data: movingAvg(new_series_data, 200),
          marker: { enabled: false },
          color: 'darkblue',
        });
      }

      xtitle =
        f === 'organism'
          ? {
              useHTML: true,
              text: 'Position in genome',
            }
          : {
              useHTML: true,
              text: `${f}<br/><small>(relative to full genome)</small>`,
            };
    }

    setChartOptions(prevOptions => {
      const xAxis: Highcharts.XAxisOptions = {
        ...prevOptions.xAxis,
        plotLines: xplotlines,
        title: xtitle,
        labels: {
          enabled: true,
          formatter: (ctx: Highcharts.AxisLabelsFormatterContextObject) => {
            const value = typeof ctx.value === 'string' ? parseInt(ctx.value, 10) + 1 : (ctx.value as number) + 1;
            return f === 'organism' ? `${value}` : `${(genes as any)[f].start + value}`;
          },
        },
      };
      return { ...prevOptions, xAxis, series };
    });
  };

  if (sequenceid === undefined || organism === undefined) {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  return (
    <Stack spacing={2} direction='column'>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartComponentRef} />
      {genes && <FeatureList feature={feature} setFeature={onFeatureChange} features={genes} />}
      {sequenceid && organism && <GapTable sequenceid={sequenceid} organism={organism} setFeature={onFeatureChange} />}
    </Stack>
  );
};

export default GraphWidget;
