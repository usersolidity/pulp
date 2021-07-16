import { ExternalLink } from 'app/components/ExternalLink';
import { selectCatalogue, selectIdentity, selectMe, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';

export function PublicationList() {
  const { t } = useTranslation();
  const { actions } = useAdminSlice();
  const identity = useSelector(selectIdentity);
  const me = useSelector(selectMe);
  const catalogue = useSelector(selectCatalogue);
  const dispatch = useDispatch();
  const history = useHistory();
  let { url } = useRouteMatch();

  const onSelect = (slug: string) => {
    history.push(`/admin/${slug}/write`);
  };

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col xs={0} md={2}></Col>
          <Col xs={6} md={4}>
            <div className="text-muted lead">
              By: <ExternalLink href={'https://etherscan.io/address/' + identity.state?.ethereum_address}>{me}</ExternalLink>
            </div>
          </Col>
          <Col xs={0} md={1}></Col>
          <Col xs={6} md={3} className="text-right">
            <LinkContainer className="mb-5" to="/account/new">
              <Button size="sm" variant="outline-primary">
                New Publication
              </Button>
            </LinkContainer>{' '}
          </Col>
        </Row>
        <Row>
          <Col xs={0} md={2}></Col>
          <Col xs={0} md={8} className="text-center">
            {catalogue?.loading && !catalogue?.entities?.length && (
              <Spinner animation="grow" variant="secondary" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            <div>{catalogue.load_error ? 'Error loading publications: ' + catalogue.load_error.message : ''}</div>
            <ListGroup variant="flush" className="mt-4 mb-4">
              {catalogue.entities.map((s, i) => (
                <ListGroup.Item action onClick={e => onSelect(s)} className="text-muted lead" key={i}>
                  {s}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
}
