/**
 * Asynchronously loads the component for AuthRoot
 */

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { LoadingWrapper } from 'app/components/LoadingWrapper';
import * as React from 'react';
import { lazyLoad } from 'utils/loadable';

export const LoadableAuthRoot = lazyLoad(
  () => import('./AuthRoot'),
  module => module.AuthRoot,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
