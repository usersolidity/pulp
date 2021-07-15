/**
 * Asynchronously loads the component for AccountRoot
 */

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { LoadingWrapper } from 'app/components/LoadingWrapper';
import * as React from 'react';
import { lazyLoad } from 'utils/loadable';

export const LoadableAccountRoot = lazyLoad(
  () => import('./AccountRoot'),
  module => module.AccountRoot,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
