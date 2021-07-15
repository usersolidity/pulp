/**
 * Asynchronously loads the component for AdminRoot
 */

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { LoadingWrapper } from 'app/components/LoadingWrapper';
import * as React from 'react';
import { lazyLoad } from 'utils/loadable';

export const LoadableAdminRoot = lazyLoad(
  () => import('./AdminRoot'),
  module => module.AdminRoot,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
