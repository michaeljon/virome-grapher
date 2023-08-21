import { OrganismType } from './Region';

export type Sequence = {
  sequenceid: string;
  sample: string;
  sortkey: string;
  organisms: OrganismType[];
};

export type SequenceSet = Sequence[];
