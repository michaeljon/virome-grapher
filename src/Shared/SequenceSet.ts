import { OrganismType } from './Region';

export type Sequence = {
  sequenceid: string;
  batch: string;
  sample: string;
  sortkey: string;
  organisms: OrganismType[];
};

export type SequenceSet = Sequence[];
