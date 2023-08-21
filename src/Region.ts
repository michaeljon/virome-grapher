export type OrganismType =
  | 'hev-a'
  | 'hev-b'
  | 'hev-d'
  | 'hrv-a'
  | 'hrv-b'
  | 'hrv-c'
  | 'hcov-229e'
  | 'hcov-nl63'
  | 'hcov-oc43'
  | 'hcov-hku1'
  | 'sars-cov-2';

export type RegionRange = {
  start: number;
  stop: number;
};

export type Region = {
  sequence: string;
  name: string;
  region: RegionRange;

  genes: { [key: string]: RegionRange };
};

export type Regions = {
  [key in OrganismType]: Region;
};
