import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { selectUserFriendlyName } from 'store/app-state';

export function AccountDropdown() {
  const me = useSelector(selectUserFriendlyName);

  return (
    <>
      <LinkContainer to="/account">
        <Button size="sm" variant="outline-secondary">
          {me}
        </Button>
      </LinkContainer>{' '}
    </>
  );
}
