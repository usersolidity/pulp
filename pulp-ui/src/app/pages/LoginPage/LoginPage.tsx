import { Link } from 'app/components/Link';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { selectIdentity, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as CoinbaseWalletLogo } from './assets/login-coinbase-wallet.svg';
import { ReactComponent as MetamaskLogo } from './assets/login-metamask.svg';
import { content } from './content';

export function LoginPage() {
  const { t } = useTranslation();
  const { actions } = useAdminSlice();
  const identity = useSelector(selectIdentity);
  const dispatch = useDispatch();

  const onLoginMetamask = () => {
    dispatch(actions.loadIdentity());
  };

  return (
    <>
      <Helmet>
        <title>Sign In</title>
        <meta name="description" content="Sign in to use Pulp" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Container>
          <Row className="my-5">
            <Col></Col>
            <Col xs={12} md={6}>
              <Card className="text-center">
                <Card.Header className="title">{t(content.signIn())}</Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <Button block size="lg" variant="light" onClick={onLoginMetamask}>
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
                  <Link to="/login-help">What are these?</Link>
                </Card.Footer>
              </Card>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col className="text-error small text-center">{identity?.load_error?.message}</Col>
          </Row>
        </Container>
      </PageWrapper>
    </>
  );
}
