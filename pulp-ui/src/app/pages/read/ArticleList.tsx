import { selectIdentity, selectPublication } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export function ArticleList() {
  const identity = useSelector(selectIdentity);
  const publication = useSelector(selectPublication);
  const history = useHistory();

  const onSelect = (p_slug: string, a_slug: string) => {
    history.push(`/read/${p_slug}/${a_slug}`);
  };

  return (
    <>
      {/* TODO:NEXT add loading and error messages */}
      <div className="mt-5 text-center">
        <div className="mb-5 text-muted">
          Publications by <b>{identity?.ens_alias || identity?.state?.ethereum_address}</b>
        </div>
        <div>{publication.loading ? 'Loading...' : ''}</div>
        <div>{publication.load_error ? 'Error loading publications: ' + publication.load_error.message : ''}</div>
        <div>{!publication.loading && !publication.entity ? 'This publication does not exist' : ''}</div>
        <ListGroup variant="flush" className="mt-4 mb-4">
          {Object.entries(publication.entity.articles).map(([slug, a], i) => (
            <ListGroup.Item action onClick={e => onSelect(publication.entity.slug, slug)} className="text-muted lead" key={slug}>
              {a.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
}
