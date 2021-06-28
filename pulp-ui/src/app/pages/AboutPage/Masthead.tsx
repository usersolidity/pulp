import { A } from 'app/components/A';
import * as React from 'react';
import styled from 'styled-components/macro';
import { Lead } from './components/Lead';
import { Title } from './components/Title';
import { Logos } from './Logos';

export function Masthead() {
  return (
    <Wrapper>
      <Logos />
      <Title>What is Pulp?</Title>
      <Lead>
        The publishing protocol{' '}
        <A
          href="https://www.reactboilerplate.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Boilerplate
        </A>{' '}
        as a{' '}
        <A
          href="https://github.com/facebook/create-react-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create React App
        </A>{' '}
        template.
      </Lead>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
`;
