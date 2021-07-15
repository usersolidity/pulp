/**
 * Asynchronously loads the component for HomePage
 */

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { LoadingWrapper } from 'app/components/LoadingWrapper';
import * as React from 'react';
import { lazyLoad } from 'utils/loadable';

export const LoadableSplashPage = lazyLoad(
  () => import('./SplashPage'),
  module => module.SplashPage,
  {
    fallback: (
      <LoadingWrapper>
        <LoadingIndicator />
      </LoadingWrapper>
    ),
  },
);
