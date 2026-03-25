import { SheriffConfig } from '@softarc/sheriff-core';

export const sheriffConfig: SheriffConfig = {
  version: 1,

  tagging: {
    'src/app': ['root'],
    'src/app/core': ['type:core'],
    'src/app/core/transloco': ['type:core'],
    'src/app/core/layout': ['type:core'],
    'src/app/core/auth': ['type:core'],
    'src/app/core/interceptors': ['type:core'],
    'src/app/shared': ['type:shared'],
    'src/app/shared/ui': ['type:shared'],
    'src/app/shared/utils': ['type:shared'],
    'src/app/domains/<domain>': ['domain:<domain>'],
    'src/app/domains/<domain>/feature': ['domain:<domain>', 'type:feature'],
    'src/app/domains/<domain>/ui': ['domain:<domain>', 'type:ui'],
    'src/app/domains/<domain>/data-access': ['domain:<domain>', 'type:data-access'],
    'src/app/domains/<domain>/model': ['domain:<domain>', 'type:model'],
  },

  depRules: {
    // Root app can access everything
    root: [
      'type:core',
      'type:shared',
      'type:feature',
      'type:ui',
      'type:data-access',
      'type:model',
      'domain:*',
    ],
    // Domain root (routes, barrel exports) can access its own layers
    'domain:*': ['type:feature', 'type:ui', 'type:data-access', 'type:model', 'type:shared', 'type:core'],
    // Feature components can access everything within their domain
    'type:feature': ['type:ui', 'type:data-access', 'type:model', 'type:shared', 'type:core'],
    // UI components should only access models and shared
    'type:ui': ['type:model', 'type:shared'],
    // Data-access can access models and shared
    'type:data-access': ['type:model', 'type:shared', 'type:core'],
    // Models should be self-contained
    'type:model': ['type:shared'],
    // Shared can only depend on core
    'type:shared': ['type:core'],
    // Core has no internal dependencies
    'type:core': [],
  },
};
