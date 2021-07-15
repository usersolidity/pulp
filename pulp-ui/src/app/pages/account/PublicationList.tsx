import { selectCatalogue, selectIdentity, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';

export function PublicationList() {
  const { t } = useTranslation();
  const { actions } = useAdminSlice();
  const identity = useSelector(selectIdentity);
  const catalogue = useSelector(selectCatalogue);
  const dispatch = useDispatch();
  const history = useHistory();
  let { url } = useRouteMatch();

  const onSelect = (slug: string) => {
    history.push(`/admin/${slug}/write`);
  };

  return (
    <>
      <div className="mt-5 text-center">
        <div className="mb-5 text-muted">
          Publications by <b>{identity?.ens_alias || identity?.state?.ethereum_address}</b>
        </div>
        <div>{catalogue.loading ? 'Loading...' : ''}</div>
        <div>{catalogue.load_error ? 'Error loading publications: ' + catalogue.load_error.message : ''}</div>
        <div>{!catalogue.loading && !catalogue.entities?.length ? 'No publications exist yet' : ''}</div>
        <ListGroup variant="flush" className="mt-4 mb-4">
          {catalogue.entities.map((s, i) => (
            <ListGroup.Item action onClick={e => onSelect(s)} className="text-muted lead" key={i}>
              {s}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <LinkContainer className="mb-5" to="/new">
          <Button size="sm" variant="outline-secondary">
            New Publication
          </Button>
        </LinkContainer>{' '}
      </div>
    </>
  );
}
