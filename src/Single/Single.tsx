import React, { useState, useEffect } from 'react';

import { regions } from '../data/hcov-regions';

import { LicenseInfo } from '@mui/x-license-pro';

import { Stack } from '@mui/material';
import Container from '@mui/system/Container/Container';

import { OrganismType } from '../Shared/Region';
import { SequenceSet } from '../Shared/SequenceSet';

import SequenceChooser from './SequenceChooser';
import { gene_type } from '../Shared/FeatureList';
import OrganismChooser from './OrganismChooser';
import BatchChooser from './BatchChooser';
import GraphWidget from './GraphWidget';

LicenseInfo.setLicenseKey(
  'd5b1af81ba5a5af69badc2110cda5c02Tz02MjU4NCxFPTE3MTExMjI2NjM5MTYsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
);

const Single: React.FC<{ sequenceList: SequenceSet }> = ({ sequenceList }) => {
  const [filteredSequenceList, setFilteredSequenceList] = useState<SequenceSet>();
  const [organisms, setOrganisms] = useState<string[]>();
  const [genes, setGenes] = useState<gene_type>();

  const [batch, setBatch] = useState<string>('');

  const [sampleName, setSampleName] = useState<string | ''>('');
  const [sequenceid, setSequenceId] = useState<string | ''>('');
  const [organism, setOrganism] = useState<OrganismType | ''>('');
  const [feature, setFeature] = useState<string>('organism');

  const [sampleData, setSampleData] = useState<[]>();

  // get the sequence list
  useEffect(() => {
    setFilteredSequenceList(sequenceList || []);
  }, [sequenceList]);

  useEffect(() => {
    setSampleName('');
    setSequenceId('');
    resetState();

    if (batch === '') {
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

    let o: OrganismType | '' = '';

    for (let s = 0; s < sequenceList.length; s++) {
      if (sequenceList[s].sequenceid === sequenceid) {
        setOrganisms(sequenceList[s].organisms);
        if (sequenceList[s].organisms.length === 1) {
          o = sequenceList[s].organisms[0];
        }
        break;
      }
    }

    setOrganism(o);
  }, [sequenceList, sequenceid]);

  // picked an organism, get the data
  useEffect(() => {
    if (sequenceid === '' || organism === '') {
      return;
    }

    const filename = `${sequenceid}_${organism}.json`;

    fetch(`/server/depths/${filename}`)
      .then(v => v.json())
      .then(j => {
        setGenes(regions[organism].genes);
        setSampleData(j);
      });
  }, [sequenceid, organism]);

  const resetState = () => {
    setFeature('organism');
    setGenes(undefined);
    setOrganisms([]);
    setOrganism('');
    setSampleData(undefined);
  };

  const onBatchChange = (b: string) => {
    setBatch(b);

    setSampleName('');
    setSequenceId('');
    resetState();

    setFilteredSequenceList([]);
  };

  const onSequenceChange = (s: string) => {
    if (s === '') {
      setOrganism('');
    }

    setSampleName(filteredSequenceList?.filter(sq => sq.sequenceid === s)[0].sample || '');
    setSequenceId(s);
    resetState();
  };

  const onOrganismChange = (o: OrganismType) => {
    setFeature('organism');
    setGenes(undefined);
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

      <GraphWidget
        sequenceid={sequenceid}
        sampleName={sampleName}
        organism={organism}
        feature={feature}
        onFeatureChanged={setFeature}
        genes={genes}
        sampleData={sampleData}
      />
    </Container>
  );
};

export default Single;
