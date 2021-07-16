import { selectMe } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

export function AccountDropdown() {
  const me = useSelector(selectMe);

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
