/**
 * Asynchronously loads the component for SubscriptionRoot
 */

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { LoadingWrapper } from 'app/components/LoadingWrapper';
import * as React from 'react';
import { lazyLoad } from 'utils/loadable';

export const LoadableSubscriptionRoot = lazyLoad(
  () => import('./SubscriptionRoot'),
  module => module.SubscriptionRoot,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
