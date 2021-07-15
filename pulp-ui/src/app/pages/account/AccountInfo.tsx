import { Link } from 'app/components/Link';
import { selectCatalogue, selectIdentity, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

export function AccountInfo() {
  const { t } = useTranslation();
  const { actions } = useAdminSlice();
  const identity = useSelector(selectIdentity);
  const catalogue = useSelector(selectCatalogue);
  const dispatch = useDispatch();
  const history = useHistory();
  let { url } = useRouteMatch();

  return (
    <>
      <Container>
        <Row className="my-5">
          <Col>
            <Card className="text-left">
              <Card.Header className="title">Identity</Card.Header>
              <Card.Body>
                <div>
                  <p className="bold">Ethereum</p>
                  <p className="text-muted">{identity.state?.ethereum_address || 'N/A'}</p>
                </div>
                <div>
                  <p className="bold">IPNS</p>
                  <p className="text-muted"> {identity.state?.ipns_key.toString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="bold">ENS</p>
                  <p className="text-muted"> {identity.ens_alias || 'N/A'}</p>
                </div>
              </Card.Body>
              <Card.Footer className="text-left small">
                <Link to="/docs">What are these?</Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
