import { Regions } from '../Region';

export const regions: Regions = {
  'hev-a': {
    sequence: 'NC_001612.1',
    name: 'hev-a',
    region: {
      start: 1,
      stop: 7413,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 750,
      },

      HEVAgp1: { start: 751, stop: 7332 },

      'VP4 (1A)': { start: 751, stop: 957 },
      'VP2 (1B)': { start: 958, stop: 1719 },
      'VP3 (1C)': { start: 1720, stop: 2445 },
      'VP1 (1D)': { start: 2446, stop: 3336 },

      '2A': { start: 3337, stop: 3786 },
      '2B': { start: 3787, stop: 4083 },
      '2C': { start: 4084, stop: 5070 },

      '3A': { start: 5071, stop: 5328 },
      '3B': { start: 5329, stop: 5394 },
      '3C': { start: 5395, stop: 5943 },
      '3D': { start: 5944, stop: 7329 },

      '3-prime-utr': {
        start: 7333,
        stop: 7413,
      },
    },
  },

  'hev-b': {
    sequence: 'NC_001472.1',
    name: 'hev-b',
    region: {
      start: 1,
      stop: 7389,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 741,
      },

      HEVBgp1: { start: 742, stop: 7290 },

      '1A (VP4)': { start: 742, stop: 948 },
      '1B (VP2)': { start: 949, stop: 1737 },
      '1C (VP3)': { start: 1738, stop: 2451 },
      '1D (VP1)': { start: 2452, stop: 3285 },

      '2A': { start: 3286, stop: 3735 },
      '2B': { start: 3786, stop: 4032 },
      '2C': { start: 4033, stop: 5019 },

      '3A': { start: 5020, stop: 5286 },
      '3B(VPg)': { start: 5287, stop: 5352 },
      '3C': { start: 5353, stop: 5901 },
      '3D': { start: 5902, stop: 7287 },

      '3-prime-utr': {
        start: 7288,
        stop: 7389,
      },
    },
  },

  'hev-d': {
    sequence: 'NC_001430.1',
    name: 'hev-d',
    region: {
      start: 1,
      stop: 7390,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 726,
      },

      HEVDgp1: { start: 727, stop: 7311 },

      '1A': { start: 727, stop: 983 },
      '1B': { start: 984, stop: 1683 },
      '1C': { start: 1684, stop: 2409 },
      '1D': { start: 2410, stop: 3339 },

      '2A': { start: 3340, stop: 3768 },
      '2B': { start: 3769, stop: 4065 },
      '2C': { start: 4066, stop: 5055 },

      '3A': { start: 5056, stop: 5322 },
      'VPg 3B': { start: 5323, stop: 5388 },
      '3C': { start: 5389, stop: 5937 },
      '3D-POL': { start: 5938, stop: 7308 },

      '3-prime-utr': {
        start: 7309,
        stop: 7390,
      },
    },
  },

  'hcov-229e': {
    sequence: 'AF304460.1',
    name: 'hcov-229e',
    region: {
      start: 1,
      stop: 27317,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 292,
      },

      HCoV229Egp1: { start: 293, stop: 20568 },
      S: { start: 20570, stop: 24091 },
      '4a': { start: 24091, stop: 24492 },
      '4b': { start: 24482, stop: 24748 },
      E: { start: 24750, stop: 24983 },
      M: { start: 24995, stop: 25672 },
      N: { start: 25686, stop: 26855 },

      '3-prime-utr': {
        start: 26858,
        stop: 27317,
      },
    },
  },

  'hcov-hku1': {
    sequence: 'AY597011.2',
    name: 'hcov-hku1',
    region: {
      start: 1,
      stop: 29926,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 205,
      },

      orf1ab: { start: 206, stop: 21753 },
      HE: { start: 21773, stop: 22933 },
      S: { start: 22942, stop: 27012 },
      orf4: { start: 27051, stop: 27380 },
      E: { start: 27373, stop: 27621 },
      M: { start: 27633, stop: 28304 },
      N: { start: 28320, stop: 29645 },
      N2: { start: 28342, stop: 28959 },

      '3-prime-utr': {
        start: 28960,
        stop: 29926,
      },
    },
  },

  'hcov-nl63': {
    sequence: 'AY567487.2',
    name: 'hcov-nl63',
    region: {
      start: 1,
      stop: 27553,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 286,
      },

      'ORF1a/1b': { start: 287, stop: 20475 },
      'spike protein': { start: 20472, stop: 24542 },
      ORF3: { start: 24542, stop: 25219 },
      E: { start: 25200, stop: 25433 },
      M: { start: 25442, stop: 26122 },
      N: { start: 26133, stop: 27266 },

      '3-prime-utr': {
        start: 27267,
        stop: 27553,
      },
    },
  },

  'hcov-oc43': {
    sequence: 'AY585228.1',
    name: 'hcov-oc43',
    region: {
      start: 1,
      stop: 30741,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 209,
      },

      ORF1ab: { start: 210, stop: 21496 },
      ns2: { start: 21506, stop: 22342 },
      HE: { start: 22354, stop: 23628 },
      S: { start: 23643, stop: 27704 },
      'ns12.9': { start: 27792, stop: 28121 },
      E: { start: 28108, stop: 28362 },
      M: { start: 28377, stop: 29069 },
      N: { start: 29079, stop: 30425 },

      '3-prime-utr': {
        start: 30425,
        stop: 30741,
      },
    },
  },

  'sars-cov-2': {
    sequence: 'MN908947.3',
    name: 'sars-cov-2',
    region: {
      start: 1,
      stop: 29903,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 265,
      },
      orf1ab: {
        start: 266,
        stop: 21555,
      },
      S: {
        start: 21563,
        stop: 25384,
      },
      ORF3a: {
        start: 25393,
        stop: 26220,
      },
      E: {
        start: 26245,
        stop: 26472,
      },
      M: {
        start: 26523,
        stop: 27191,
      },
      ORF6: {
        start: 27202,
        stop: 27387,
      },
      ORF7a: {
        start: 27394,
        stop: 27759,
      },
      ORF8: {
        start: 27894,
        stop: 28259,
      },
      N: {
        start: 28274,
        stop: 29533,
      },
      ORF10: {
        start: 29558,
        stop: 29674,
      },
      '3-prime-utr': {
        start: 29675,
        stop: 29903,
      },
    },
  },

  'hrv-a': {
    sequence: 'NC_001617.1',
    name: 'hrv-a',
    region: {
      start: 1,
      stop: 7152,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 618,
      },

      HRV89gp1: { start: 619, stop: 7113 },

      VP4: { start: 619, stop: 825 },
      VP2: { start: 826, stop: 1626 },
      VP3: { start: 1627, stop: 2340 },
      VP1: { start: 2341, stop: 3234 },

      'P-2A': { start: 3235, stop: 3624 },
      'P-2B': { start: 3643, stop: 3927 },
      'P-2C': { start: 3928, stop: 4890 },

      'P-3A': { start: 4891, stop: 5118 },
      VPg: { start: 5119, stop: 5181 },
      '3C': { start: 5182, stop: 5730 },

      'RNA polymerase': { start: 5731, stop: 7110 },

      '3-prime-utr': {
        start: 7113,
        stop: 7152,
      },
    },
  },

  'hrv-b': {
    sequence: 'NC_001490.1',
    name: 'hrv-b',
    region: {
      start: 1,
      stop: 7212,
    },

    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 628,
      },

      HRVBgp1: { start: 629, stop: 7168 },

      '1A (VP4)': { start: 629, stop: 835 },
      '1B (VP2)': { start: 836, stop: 1621 },
      '1C (VP3)': { start: 1622, stop: 2329 },
      '1D (VP1)': { start: 2330, stop: 3196 },

      '2A (P-2A)': { start: 3197, stop: 3634 },
      '2B (P-2B)': { start: 3635, stop: 3925 },
      '2C (P-2C)': { start: 3926, stop: 4915 },

      '3A (P-3A)': { start: 4916, stop: 5170 },
      '3B (VPg)': { start: 5171, stop: 5239 },
      'pro-3C': { start: 5240, stop: 5785 },
      '3D': { start: 5786, stop: 7165 },

      '3-prime-utr': {
        start: 7169,
        stop: 7212,
      },
    },
  },

  'hrv-c': {
    sequence: 'NC_009996.1',
    name: 'hrv-c',
    region: {
      start: 1,
      stop: 7099,
    },
    genes: {
      '5-prime-utr': {
        start: 1,
        stop: 615,
      },

      HRVC_gp1: { start: 616, stop: 7050 },

      VP4: { start: 616, stop: 816 },
      VP2: { start: 817, stop: 1599 },
      VP3: { start: 1600, stop: 2304 },
      VP1: { start: 2305, stop: 3126 },

      '2A': { start: 3127, stop: 3552 },
      '2B': { start: 3553, stop: 3849 },
      '2C': { start: 3850, stop: 4827 },

      '3A': { start: 4828, stop: 5052 },
      '3B': { start: 5053, stop: 5118 },
      '3C': { start: 5119, stop: 5667 },
      '3D': { start: 5668, stop: 7047 },

      '3-prime-utr': {
        start: 7051,
        stop: 7099,
      },
    },
  },
};
