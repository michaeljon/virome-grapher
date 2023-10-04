import React, { useEffect, useState } from 'react';

import { regions } from '../data/hcov-regions';

import OrganismChooser from './OrganismChooser';
import { OrganismType } from '../Shared/Region';
import { Container, Skeleton, Stack } from '@mui/material';
import { Sequence, SequenceSet } from '../Shared/SequenceSet';
import SequenceList from './SequenceList';
import GraphWidget from './GraphWidget';
import { gene_type } from '../Shared/FeatureList';
import MainNavigation from '../Shared/MainNavigation';

const Compare: React.FC<{ sequenceList: SequenceSet }> = ({ sequenceList }) => {
  const [organisms] = useState<OrganismType[]>(['hcov-229e', 'hcov-nl63', 'hcov-oc43', 'hcov-hku1', 'sars-cov-2']);
  const [organism, setOrganism] = useState<OrganismType | ''>('');
  const [comparables, setComparables] = useState<Sequence[]>();
  const [sequenceData, setSequenceData] = useState<[][]>();

  const [genes, setGenes] = useState<gene_type>();
  const [feature, setFeature] = useState<string>('organism');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organism !== '') {
      setGenes(regions[organism].genes);
    }
  }, [organism, sequenceList]);

  useEffect(() => {
    setSequenceData(undefined);

    if (comparables === undefined) {
      return;
    }

    const jobs: Promise<[]>[] = [];
    for (let comparable of comparables) {
      const job = fetch(`/server/depths/${comparable.sequenceid}_${organism}.json`).then(v => v.json());
      jobs.push(job);
    }

    Promise.all(jobs).then(r => {
      setSequenceData(r);
      setLoading(false);
    });
  }, [comparables, organism]);

  const onOrganismChange = (o: OrganismType | '') => {
    setComparables(undefined);
    setOrganism(o);
  };

  const onCompare = (sequences: Sequence[]) => {
    setLoading(true);
    setComparables(sequences);
  };

  return (
    <Container maxWidth={false}>
      <Stack spacing={2} direction='column'>
        <MainNavigation />
        {organisms && <OrganismChooser organism={organism} organisms={organisms} onOrganismChange={onOrganismChange} />}
        {organism && sequenceList && (
          <SequenceList organism={organism} unfilteredSequences={sequenceList} onCompare={onCompare} />
        )}
        {loading === false && (
          <GraphWidget
            organism={organism}
            feature={feature}
            onFeatureChanged={setFeature}
            comparables={comparables}
            sampleData={sequenceData}
            genes={genes}
          />
        )}
      </Stack>
    </Container>
  );
};

export default Compare;
