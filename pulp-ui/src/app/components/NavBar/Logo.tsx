import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components/macro';

export function Logo() {
  return (
    <Wrapper>
      <LinkContainer to="/">
        <Title>pulp</Title>
      </LinkContainer>
      <Description>Publish on Web 3</Description>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.a`
  font-size: 1.25rem;
  color: ${p => p.theme.primary};
  font-weight: bold;
  margin-right: 1rem;
  cursor: pointer;

  &:hover {
    text-decoration: none;
    color: ${p => p.theme.primary};
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }
`;

const Description = styled.div`
  font-size: 0.875rem;
  color: ${p => p.theme.textSecondary};
  font-weight: normal;
`;
