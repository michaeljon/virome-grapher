import React, { useEffect, useRef, useState } from 'react';

import { regions } from '../data/hcov-regions';

import Highcharts, { Options } from 'highcharts';
import HighchartsReact, { HighchartsReactRefObject } from 'highcharts-react-official';

import FeatureList, { gene_type } from '../Shared/FeatureList';

import { OrganismType } from '../Shared/Region';
import { Skeleton, Stack, useMediaQuery } from '@mui/material';
import { Sequence } from '../Shared/SequenceSet';
import DefaultChartOptions from '../themes/DefaultChartOptions';

const GraphWidget: React.FC<{
  organism: OrganismType | '';
  feature: string | undefined;
  onFeatureChanged: (f: string) => void;
  comparables: Sequence[] | undefined;
  sampleData: [][] | undefined;
  genes: gene_type;
}> = ({ organism, feature, onFeatureChanged, comparables, sampleData, genes }) => {
  const isDarkModeEnabled = useMediaQuery('(prefers-color-scheme: dark)');

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>(DefaultChartOptions);
  const chartComponentRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    let xplotlines: Highcharts.XAxisPlotLinesOptions[] | undefined = undefined;
    let xtitle: Highcharts.XAxisTitleOptions | undefined = undefined;
    const series: Highcharts.SeriesOptionsType[] = [];

    let featureStart = 0;

    if (organism !== '' && comparables && sampleData && genes && feature) {
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

      if (feature === 'organism' && regions[organism]?.region?.stop) {
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

      const dataItems = sampleData?.length || 0;

      for (let data = 0; data < dataItems; data++) {
        const genome_data: number[][] = sampleData[data];

        series.push({
          id: comparables[data].sequenceid,
          name: comparables[data].sample,
          type: 'line',
          data:
            feature === 'organism'
              ? genome_data.map(g => g[1])
              : genome_data.slice((genes as any)[feature].start, (genes as any)[feature].stop).map(g => g[1]),
          marker: { enabled: false },
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
  }, [isDarkModeEnabled, feature, genes, organism, comparables, sampleData]);

  if (sampleData === undefined || comparables === undefined) {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  if (genes === undefined || feature === undefined) {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  if (organism === '') {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  return (
    <Stack spacing={2} direction='column'>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartComponentRef} />
      {genes && <FeatureList feature={feature} setFeature={onFeatureChanged} features={genes} />}
    </Stack>
  );
};

export default GraphWidget;
