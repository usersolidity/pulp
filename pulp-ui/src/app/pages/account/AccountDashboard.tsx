import { selectCatalogue, selectIdentity, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

export function AccountDashboard() {
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
      {/* TODO:NEXT add loading and error messages */}
      <div>{catalogue.loading ? 'Loading...' : ''}</div>
      <div>{catalogue.load_error ? 'Error loading publications: ' + catalogue.load_error.message : ''}</div>
      <div>{!catalogue.loading && !catalogue.entities?.length ? 'No publications exist yet' : ''}</div>
      <div className="mt-5 text-center">
        <div className="mb-5 text-muted">
          Publications by <b>{identity?.ens_alias || identity?.state?.ethereum_address}</b>
        </div>
        <ListGroup variant="flush">
          {catalogue.entities.map((s, i) => (
            <ListGroup.Item action onClick={e => onSelect(s)} className="text-muted lead" key={i}>
              {s}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
}
