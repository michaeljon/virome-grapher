import React, { useEffect, useRef, useState } from 'react';

import { regions } from '../data/hcov-regions';

import Highcharts from 'highcharts';
import HighchartsReact, { HighchartsReactRefObject } from 'highcharts-react-official';

import FeatureList, { gene_type } from '../Shared/FeatureList';

import { OrganismType } from '../Shared/Region';
import { Skeleton, Stack } from '@mui/material';
import { Sequence } from '../Shared/SequenceSet';

Highcharts.setOptions({
  chart: {
    style: {
      fontFamily: 'Roboto',
    },
  },
});

const GraphWidget: React.FC<{
  organism: OrganismType | undefined;
  feature: string | undefined;
  onFeatureChanged: (f: string) => void;
  comparables: Sequence[] | undefined;
  sampleData: [][] | undefined;
  genes: gene_type;
}> = ({ organism, feature, onFeatureChanged, comparables, sampleData, genes }) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
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

    legend: { enabled: true },

    credits: {
      enabled: false,
    },
  });
  const chartComponentRef = useRef<HighchartsReactRefObject>(null);

  useEffect(() => {
    let xplotlines: Highcharts.XAxisPlotLinesOptions[] | undefined = undefined;
    let xtitle: Highcharts.XAxisTitleOptions | undefined = undefined;
    const series: Highcharts.SeriesOptionsType[] = [];

    let featureStart = 0;

    if (organism && comparables && sampleData && genes && feature) {
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
          },
        });
      }

      const dataItems = sampleData?.length || 0;

      console.log({
        where: 'right before computing the series data',
        comparables,
        sampleData,
      });

      for (let data = 0; data < dataItems; data++) {
        const genome_data: number[][] = sampleData[data];

        console.log({
          where: 'creating a series element',
          element: data,
        });

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

    console.log({
      where: 'before setting chart options',
      xplotlines,
      xtitle,
      feature,
      organism,
      series,
    });

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
  }, [feature, genes, organism, comparables, sampleData]);

  if (sampleData === undefined || comparables === undefined) {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  if (genes === undefined || feature === undefined) {
    return <Skeleton animation='wave' variant='rounded' height={480} />;
  }

  if (organism === undefined) {
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
