import React, { useEffect, useRef, useState } from 'react';

import { regions } from '../data/hcov-regions';

import Highcharts from 'highcharts';
import HighchartsReact, { HighchartsReactRefObject } from 'highcharts-react-official';

import FeatureList, { gene_type } from '../Shared/FeatureList';
import GapTable from './GapTable';

import { OrganismType } from '../Shared/Region';
import { Skeleton, Stack, useMediaQuery } from '@mui/material';
import { movingAvg } from '../Shared/math';
import DefaultChartOptions from '../themes/DefaultChartOptions';

const GraphWidget: React.FC<{
  sequenceid: string | '';
  sampleName: string | '';
  organism: OrganismType | '';
  feature: string | undefined;
  onFeatureChanged: (f: string) => void;
  sampleData: [] | undefined;
  genes: gene_type;
}> = ({ sequenceid, sampleName, organism, feature, onFeatureChanged, sampleData, genes }) => {
  const isDarkModeEnabled = useMediaQuery('(prefers-color-scheme: dark)');

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>(DefaultChartOptions);
  const chartComponentRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
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

      xplotlines =
        feature === 'organism' && genes
          ? Object.keys(genes).map(g => ({
              color: 'orange',
              width: 1,
              value: (genes as any)[g].start,
              label: {
                text: g,
                style: {
                  color: isDarkModeEnabled ? 'white' : 'orange',
                },
              },
            }))
          : undefined;

      if (feature === 'organism' && organism !== '' && regions[organism]?.region?.stop) {
        // add the tail
        xplotlines?.push({
          color: 'orange',
          width: 1,
          value: regions[organism]?.region?.stop || 0,
          label: {
            text: 'end',
            style: {
              color: isDarkModeEnabled ? 'white' : 'orange',
            },
          },
        });
      }

      const series_data: number[] =
        feature === 'organism'
          ? (sampleData || []).map(g => g[1])
          : (sampleData || []).slice((genes as any)[feature].start, (genes as any)[feature].stop).map(g => g[1]);

      series.push({
        id: 'primary',
        name: sampleName,
        type: 'line',
        data: series_data,
        marker: { enabled: false },
      });

      if (feature === 'organism') {
        series.push({
          type: 'spline',
          name: 'Rolling average',
          lineWidth: 2,
          data: movingAvg(series_data, 200),
          marker: { enabled: false },
          // color: 'darkblue',
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
              text: `<span>${feature}</span><small>&nbsp;&nbsp;(relative to full genome)</small>`,
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
  }, [isDarkModeEnabled, feature, genes, sampleName, organism, sampleData]);

  if (genes === undefined || feature === undefined) {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  if (sequenceid === '' || organism === '') {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  return (
    <Stack spacing={2} direction='column'>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartComponentRef} />
      {genes && <FeatureList feature={feature} setFeature={onFeatureChanged} features={genes} />}
      <GapTable sequenceid={sequenceid} organism={organism} setFeature={onFeatureChanged} />
    </Stack>
  );
};

export default GraphWidget;
