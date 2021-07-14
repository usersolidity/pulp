import { A } from 'app/components/A';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components/macro';
import { Lead } from './components/Lead';
import { Title } from './components/Title';

export function Masthead() {
  return (
    <Wrapper>
      {/* <Logos /> */}
      <Title>Publish on Web 3</Title>
      <Lead>
        Pulp is a distributed publishing platform built on{' '}
        <A href="https://ethereum.org/" target="_blank" rel="noopener noreferrer">
          Ethereum
        </A>{' '}
        and{' '}
        <A href="https://ipfs.io/" target="_blank" rel="noopener noreferrer">
          IPFS
        </A>
        .
      </Lead>
      <div>
        <LinkContainer to="/new" className="mr-3">
          <Button size="lg" variant="primary">
            Get Started
          </Button>
        </LinkContainer>
        <LinkContainer to="/auth/login">
          <Button size="lg" variant="light">
            Sign In
          </Button>
        </LinkContainer>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  min-height: 320px;
`;
