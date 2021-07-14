import { selectIdentity } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components/macro';

export function AccountDropdown() {
  const identity = useSelector(selectIdentity);

  return (
    <>
      <LinkContainer to="/account">
        <Button size="sm" variant="outline-secondary">
          {identity?.state?.ethereum_address.slice(0, 4) + '...' + identity?.state?.ethereum_address.slice(-4)}
        </Button>
      </LinkContainer>{' '}
    </>
  );
}

const Wrapper = styled.nav`
  display: flex;
  margin-right: -1rem;
`;
