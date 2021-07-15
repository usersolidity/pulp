/**
 * Asynchronously loads the component for NotFoundPage
 */

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import * as React from 'react';
import { lazyLoad } from 'utils/loadable';

export const LoadableNotFoundPage = lazyLoad(
  () => import('./NotFoundPage'),
  module => module.NotFoundPage,
  {
    fallback: <LoadingIndicator />,
  },
);
