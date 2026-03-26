import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const sheriffConfig: SheriffConfig = {
  enableBarrelLess: true,
  modules: {
    'src/app': {
      'core/feat-<name>': ['core', 'type:feature'],
      'core/<type>': ['core', 'type:core'],
      'shared/<type>': ['shared', 'type:shared'],
      domains: {
        '<domain>/feat-<name>': ['domain:<domain>', 'type:feature'],
        '<domain>/<type>': ['domain:<domain>', 'type:<type>'],
      },
    },
  },

  depRules: {
    root: [
      'type:core',
      'type:shared',
      'type:feature',
      'type:ui',
      'type:data-access',
      'type:model',
      'domain:*',
    ],
    'domain:*': [sameTag, 'type:shared', 'type:core'],
    'type:feature': ['type:ui', 'type:data-access', 'type:model', 'type:shared', 'type:core'],
    'type:ui': ['type:model', 'type:shared'],
    'type:data-access': ['type:model', 'type:shared', 'type:core'],
    'type:model': ['type:shared'],
    'type:shared': ['type:shared', 'type:core'],
    core: [sameTag],
    'type:core': [sameTag],
  },
};
