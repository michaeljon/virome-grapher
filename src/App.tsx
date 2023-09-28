import React, { useState, useEffect } from 'react';

import { regions } from './data/hcov-regions';

import HighchartsReact, { HighchartsReactProps } from 'highcharts-react-official';

import { LicenseInfo } from '@mui/x-license-pro';

import { Stack } from '@mui/material';
import Container from '@mui/system/Container/Container';

import { OrganismType } from './Region';
import { SequenceSet } from './SequenceSet';

import SequenceChooser from './SequenceChooser';
import { gene_type } from './FeatureList';
import OrganismChooser from './OrganismChooser';
import BatchChooser from './BatchChooser';
import GraphWidget from './GraphWidget';

LicenseInfo.setLicenseKey(
  'd5b1af81ba5a5af69badc2110cda5c02Tz02MjU4NCxFPTE3MTExMjI2NjM5MTYsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
);

const App = () => {
  const [sequenceList, setSequenceList] = useState<SequenceSet>();
  const [filteredSequenceList, setFilteredSequenceList] = useState<SequenceSet>();
  const [batch, setBatch] = useState<string>();
  const [sequenceid, setSequenceId] = useState<string | undefined>();
  const [organisms, setOrganisms] = useState<string[]>();
  const [organism, setOrganism] = useState<OrganismType | undefined>();
  const [sampleData, setSampleData] = useState<[]>();
  const [genes, setGenes] = useState<gene_type>();

  // get the sequence list
  useEffect(() => {
    fetch('http://127.0.0.1:8080/all-samples.json')
      .then(response => response.json())
      .then(json => {
        setSequenceList(json);
        setFilteredSequenceList([]);
      });
  }, []);

  useEffect(() => {
    setSequenceId(undefined);
    resetState();

    if (batch === undefined || batch === '') {
      setFilteredSequenceList([]);
    } else {
      setFilteredSequenceList(sequenceList?.filter(s => s.batch === batch));
    }
  }, [sequenceList, batch]);

  // selected a sample, fill the organism list
  useEffect(() => {
    resetState();

    if (sequenceList === undefined || sequenceid === undefined) {
      return;
    }

    let o = undefined;

    for (let s = 0; s < sequenceList.length; s++) {
      if (sequenceList[s].sequenceid === sequenceid) {
        setOrganisms(sequenceList[s].organisms);
        if (sequenceList[s].organisms.length === 1) {
          o = sequenceList[s].organisms[0];
        }
        break;
      }
    }

    console.log('in the sequenceid effect setting organism to ' + o);
    setOrganism(o);
  }, [sequenceList, sequenceid]);

  // picked an organism, get the data
  useEffect(() => {
    if (sequenceid === undefined || organism === undefined) {
      return;
    }

    // stupid
    if ((organism as any) === '') {
      return;
    }

    const filename = `${sequenceid}_${organism}.json`;

    console.log('i am in the effect ' + filename);

    fetch(`http://127.0.0.1:8080/depths/${filename}`)
      .then(v => v.json())
      .then(j => {
        setGenes(regions[organism].genes);
        setSampleData(j);
      });
  }, [sequenceid, organism]);

  const resetState = () => {
    setGenes(undefined);
    setOrganisms([]);
    setOrganism(undefined);
    setSampleData(undefined);
  };

  const onBatchChange = (b: string) => {
    setBatch(b);
    setFilteredSequenceList([]);
    console.log('reset batch to ' + b);
  };

  const onSequenceChange = (s: string) => {
    if (s === undefined) {
      setOrganism(undefined);
    }

    setSequenceId(s);
    resetState();
  };

  const onOrganismChange = (o: OrganismType) => {
    setOrganism(o);
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

      <GraphWidget sequenceid={sequenceid} organism={organism} genes={genes} sampleData={sampleData} />
    </Container>
  );
};

export default App;
