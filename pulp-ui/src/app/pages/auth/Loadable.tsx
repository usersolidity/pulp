/**
 * Asynchronously loads the component for AuthRoot
 */

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import * as React from 'react';
import styled from 'styled-components/macro';
import { lazyLoad } from 'utils/loadable';

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AuthRoot = lazyLoad(
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
