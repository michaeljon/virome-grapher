import React, { useEffect, useRef, useState } from 'react';

import { regions } from './data/hcov-regions';

import Highcharts from 'highcharts';
import HighchartsReact, { HighchartsReactRefObject } from 'highcharts-react-official';

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
  feature: string | undefined;
  onFeatureChanged: (f: string) => void;
  sampleData: [] | undefined;
  genes: gene_type;
}> = ({ sequenceid, organism, feature, onFeatureChanged, sampleData, genes }) => {
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
  const chartComponentRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    const new_series_data: number[] = [];
    const genome_data = (sampleData?.map(d => d[1]) as number[]) || [];
    let xplotlines: Highcharts.XAxisPlotLinesOptions[] | undefined = undefined;
    let xtitle: Highcharts.XAxisTitleOptions | undefined = undefined;
    const series: Highcharts.SeriesOptionsType[] = [];

    let featureStart = 0;

    if (genes && feature) {
      if (feature === 'organism') {
        featureStart = 0;
      } else {
        featureStart = (genes as any)[feature].start;
      }

      if (feature === 'organism') {
        for (let i = 0; i < genome_data.length; i++) {
          new_series_data.push(genome_data[i]);
        }
      } else {
        const start = (genes as any)[feature].start;
        const stop = (genes as any)[feature].stop;

        for (let i = start; i < stop; i++) {
          new_series_data.push(genome_data[i]);
        }
      }

      xplotlines =
        feature === 'organism' && genes
          ? Object.keys(genes).map(g => ({
              color: 'orange',
              width: 1,
              value: (genes as any)[g].start,
              label: {
                text: g,
              },
            }))
          : undefined;

      if (feature === 'organism' && genes && organism && regions[organism]?.region?.stop) {
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

      if (feature === 'organism') {
        series.push({
          type: 'spline',
          lineWidth: 2,
          data: movingAvg(new_series_data, 200),
          marker: { enabled: false },
          color: 'darkblue',
        });
      }

      xtitle =
        feature === 'organism'
          ? {
              useHTML: true,
              text: 'Position in genome',
            }
          : {
              useHTML: true,
              text: `${feature}<br/><small>(relative to full genome)</small>`,
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
            return feature === 'organism' ? `${value}` : `${featureStart + value}`;
          },
        },
      };
      return { ...prevOptions, xAxis, series };
    });
  }, [feature, genes, organism, sampleData]);

  if (genes === undefined || feature === undefined) {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  if (sequenceid === undefined || organism === undefined) {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  return (
    <Stack spacing={2} direction='column'>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartComponentRef} />
      {genes && <FeatureList feature={feature} setFeature={onFeatureChanged} features={genes} />}
      {sequenceid && organism && <GapTable sequenceid={sequenceid} organism={organism} setFeature={onFeatureChanged} />}
    </Stack>
  );
};

export default GraphWidget;
