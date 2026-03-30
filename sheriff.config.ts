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
    'domain:dashboard': [sameTag, 'domain:user', 'domain:location', 'domain:equipment', 'domain:exercise', 'type:shared', 'type:core'],
    'domain:my-location': [sameTag, 'domain:location', 'domain:equipment', 'domain:user', 'type:shared', 'type:core'],
    'domain:user': [sameTag, 'domain:location', 'type:shared', 'type:core'],
    'domain:exercise': [sameTag, 'domain:equipment', 'type:shared', 'type:core'],
    'domain:exercise-combo': [sameTag, 'domain:exercise', 'type:shared', 'type:core'],
    'domain:location': [sameTag, 'domain:equipment', 'domain:user', 'type:shared', 'type:core'],
    'type:feature': ['type:ui', 'type:data-access', 'type:model', 'type:shared', 'type:core'],
    'type:ui': ['type:model', 'type:data-access', 'type:shared'],
    'type:data-access': ['type:model', 'type:shared', 'type:core'],
    'type:model': ['type:shared'],
    'type:shared': ['type:shared', 'type:core'],
    shared: [sameTag, 'type:core'],
    core: [sameTag, 'domain:user', 'domain:location', 'type:shared'],
    'type:core': [sameTag, 'domain:user', 'domain:location', 'type:shared'],
  },
};
