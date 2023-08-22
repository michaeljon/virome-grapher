import React, { useRef, useState, useEffect } from 'react';

import { regions } from './data/hcov-regions';

import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Stack } from '@mui/material';

import Container from '@mui/system/Container/Container';
import SequenceChooser from './SequenceChooser';
import FeatureList, { gene_type } from './FeatureList';
import OrganismChooser from './OrganismChooser';
import { OrganismType } from './Region';
import { SequenceSet } from './SequenceSet';
import BatchChooser from './BatchChooser';

Highcharts.setOptions({
  chart: {
    style: {
      fontFamily: 'Roboto',
    },
  },
});

const options: Highcharts.Options = {
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
};

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

const App = (props: HighchartsReact.Props) => {
  const [sequenceList, setSequenceList] = useState<SequenceSet>();
  const [filteredSequenceList, setFilteredSequenceList] = useState<SequenceSet>();
  const [batch, setBatch] = useState<string>();
  const [sequenceid, setSequenceId] = useState<string | undefined>();
  const [organisms, setOrganisms] = useState<string[]>();
  const [organism, setOrganism] = useState<OrganismType>();
  const [sampleData, setSampleData] = useState<[]>();

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>(options);
  const [genes, setGenes] = useState<gene_type>();
  const [feature, setFeature] = useState<string | undefined>();

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  // get the sequence list
  useEffect(() => {
    fetch('http://127.0.0.1:8080/all-samples.json')
      .then(response => response.json())
      .then(json => {
        setSequenceList(json);
        setFilteredSequenceList(json);
      });
  }, []);

  const resetState = () => {
    setGenes(undefined);
    setOrganisms([]);
    setOrganism(undefined);
    setFeature('organism');
    setSampleData(undefined);
  };

  useEffect(() => {
    setSequenceId(undefined);
    resetState();

    if (batch === undefined || batch === '') {
      setFilteredSequenceList([]);
    } else {
      setFilteredSequenceList(sequenceList?.filter(s => s.batch === batch));
    }
  }, [batch]);

  // selected a sample, fill the organism list
  useEffect(() => {
    if (sequenceList === undefined || sequenceid === undefined) {
      return;
    }

    for (let s = 0; s < sequenceList.length; s++) {
      if (sequenceList[s].sequenceid === sequenceid) {
        setOrganisms(sequenceList[s].organisms);
        break;
      }
    }
  }, [sequenceList, sequenceid]);

  // picked an organism, get the data
  useEffect(() => {
    if (sequenceid === undefined || organism === undefined) {
      return;
    }

    const filename = `${sequenceid}_${organism}.json`;

    fetch(`http://127.0.0.1:8080/${filename}`)
      .then(v => v.json())
      .then(j => {
        setGenes(regions[organism].genes);
        setFeature(undefined);
        setSampleData(j);
      });
  }, [sequenceid, organism]);

  const onBatchChange = (b: string) => {
    setBatch(b);
    setFilteredSequenceList([]);
    console.log('reset batch to ' + b);
  };

  const onSequenceChange = (s: string) => {
    const series: Highcharts.SeriesOptionsType[] = [
      {
        id: 'primary',
        type: 'line',
        data: [],
        marker: { enabled: false },
      },
    ];

    setSequenceId(s);
    resetState();

    setChartOptions(prevOptions => {
      const xAxis: Highcharts.XAxisOptions = {
        ...prevOptions.xAxis,
        plotLines: undefined,
        title: undefined,
        labels: {
          enabled: true,
        },
      };
      return { ...prevOptions, xAxis, series };
    });
  };

  const onOrganismChange = (o: OrganismType) => {
    const series: Highcharts.SeriesOptionsType[] = [
      {
        id: 'primary',
        type: 'line',
        data: [],
        marker: { enabled: false },
      },
    ];

    setOrganism(o);
    setChartOptions(prevOptions => {
      const xAxis: Highcharts.XAxisOptions = {
        ...prevOptions.xAxis,
        plotLines: undefined,
        title: undefined,
        labels: {
          enabled: true,
        },
      };
      return { ...prevOptions, xAxis, series };
    });
  };

  const onFeatureChange = (f: string) => {
    const new_series_data: number[] = [];
    const genome_data = sampleData?.map(d => d[1]) as number[];
    let xplotlines: Highcharts.XAxisPlotLinesOptions[] | undefined = undefined;
    let xtitle: Highcharts.XAxisTitleOptions | undefined = undefined;

    const series: Highcharts.SeriesOptionsType[] = [];

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

    setFeature(f);
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

  return (
    <Container maxWidth={false} style={{ marginTop: '2em' }}>
      <Stack spacing={2} direction='column'>
        <BatchChooser onBatchChange={onBatchChange} />
        <SequenceChooser
          sequenceList={filteredSequenceList}
          sequenceid={sequenceid}
          onSequenceChange={onSequenceChange}
        />
        {organisms && <OrganismChooser organism={organism} organisms={organisms} onOrganismChange={onOrganismChange} />}
        <div></div>
      </Stack>

      <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartComponentRef} {...props} />

      {genes && <FeatureList feature={feature} setFeature={onFeatureChange} features={genes} />}
    </Container>
  );
};

export default App;
