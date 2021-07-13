import { selectIdentity, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components/macro';

export function Nav() {
  const { actions } = useAdminSlice();
  const identity = useSelector(selectIdentity);

  return (
    <Wrapper>
      {identity?.state && (
        <Item>
          <LinkContainer to="/new">
            <Button variant="primary">{identity?.state?.ethereum_address.slice(0, 4) + '...' + identity?.state?.ethereum_address.slice(-4)}</Button>
          </LinkContainer>
        </Item>
      )}
      {!identity?.state && (
        <Item>
          <LinkContainer to="/new">
            <Button variant="primary">Get Started</Button>
          </LinkContainer>
        </Item>
      )}
      {!identity?.state && (
        <Item>
          <LinkContainer to="/login">
            <Button variant="light">Sign In</Button>
          </LinkContainer>
        </Item>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  margin-right: -1rem;
`;

const Item = styled.div`
  color: ${p => p.theme.primary};
  cursor: pointer;
  margin: 0px;
  text-decoration: none;
  display: flex;
  margin: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }

  .icon {
    margin-right: 0.25rem;
  }
`;
