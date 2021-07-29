import { Widget } from '@typeform/embed-react';
import '@typeform/embed/build/css/widget.css';
import { Link } from 'app/components/Link';
import { selectIdentity, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { ReactComponent as CoinbaseWalletLogo } from './assets/login-coinbase-wallet.svg';
import { ReactComponent as MetamaskLogo } from './assets/login-metamask.svg';
import { content } from './content';

export function LoginPage() {
  const { t } = useTranslation();
  const { actions } = useAdminSlice();
  const identity = useSelector(selectIdentity);
  const dispatch = useDispatch();
  const history = useHistory();
  let { url } = useRouteMatch();

  const onLoginMetamask = () => {
    dispatch(actions.loadIdentity());
    // TODO:NEXT: redirect to landing page that lists publications (if more than one) and that auto-redirects to the one publication's admin page if there is only one.
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Widget id="XLkNLWgO" style={{ width: '100%', height: '600px' }} className="my-form" tooltip="Hi there! Pulp is in alpha." buttonColor="#007bff" />
          </Col>
        </Row>
        <Row className="my-5" hidden>
          <Col></Col>
          <Col xs={12} md={6}>
            <Card className="text-center">
              <Card.Header className="title">{t(content.signIn())}</Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <Button block size="lg" variant="outline-secondary" onClick={onLoginMetamask} disabled>
                    <MetamaskLogo style={{ width: '1.25rem', height: '1.25rem' }} /> Metamask
                  </Button>
                </div>
                <div className="mb-3">
                  <Button block size="lg" variant="light" disabled>
                    <CoinbaseWalletLogo style={{ width: '1.25rem', height: '1.25rem' }} /> Coinbase Wallet
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer className="text-left small">
                <Link to="/docs">What are these?</Link>
              </Card.Footer>
            </Card>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col className="text-error small text-center">{identity?.load_error?.message}</Col>
        </Row>
      </Container>
    </>
  );
}
