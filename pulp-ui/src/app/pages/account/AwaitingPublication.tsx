import { Link } from 'app/components/Link';
import { Subscribe } from 'app/components/Subscribe';
import { ReactComponent as EthLogo } from 'app/pages/admin/assets/eth-grey.svg';
import ipfs_logo from 'app/pages/admin/assets/ipfs-grey-64-wikimedia.png';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Fade from 'react-bootstrap/Fade';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { BsCheckCircle } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { selectPublication } from 'store/app-state';
import styled from 'styled-components/macro';

export function AwaitingPublication() {
  const publication = useSelector(selectPublication);

  const [fade, setFade] = React.useState<boolean | undefined>(false);
  setTimeout(async () => {
    await setFade(true);
  }, 100);

  return (
    <Fade in={fade}>
      <Container>
        <Row>
          <Col xs={0} md={2}></Col>
          <Col xs={12} md={8}>
            <div className="mt-5">
              <Media className="mt-5">
                <div style={{ width: '38px', height: '38px' }} className="mr-3">
                  {publication?.awaiting_tx ? (
                    <Spinner animation="grow" variant="secondary" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  ) : (
                    <BsCheckCircle className="text-primary h1" />
                  )}
                </div>
                <Media.Body>
                  <h5 className="lead">Publishing to the Distributed Web</h5>
                  <p className="text-muted">This may take a little longer than you're used to on Web 2.</p>
                </Media.Body>
              </Media>
              {/* TODO: add incrementing timeout, feed messages until transaction closes */}
              <Media className="mt-5">
                <img width={38} height={38} className="mr-3" src={ipfs_logo} alt="ipfs-logo" />
                <Media.Body>
                  <h5 className="lead">Broadcasting to IPFS...</h5>
                  <p className="text-muted">so you can commoditize your publishing house.</p>
                </Media.Body>
              </Media>
              <Media className="mt-5">
                <EthLogo style={{ width: '38px', height: '38px' }} className="mr-3" />
                <Media.Body>
                  <h5 className="lead">Transacting on the Ethereum network...</h5>
                  <p className="text-muted">so you can monetize like it's 2021.</p>
                </Media.Body>
              </Media>
              <Media className="mt-5">
                <div style={{ width: '38px', height: '38px' }} className="h1 mr-3">
                  🙂
                </div>
                <Media.Body>
                  <h5 className="lead">Content Creators Love Pulp</h5>
                  <p className="text-muted">
                    Because{' '}
                    <Link to={{ pathname: 'https://linktr.ee/pulp_network' }} target="_blank">
                      Disintermediation
                    </Link>
                  </p>
                </Media.Body>
              </Media>
              <div>
                <div className="mt-5">
                  <h5 className="lead">We're In Alpha, Follow Along in our Newsletter</h5>
                  <Subscribe />
                </div>
              </div>
              <div className="text-center mt-5">
                {publication?.awaiting_tx ? (
                  <Spinner animation="grow" variant="secondary" role="status" size="sm">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                ) : (
                  <div className="text-center">
                    <h5 className="lead text-muted">Your Publication is Ready</h5>
                    <div className="mt-3">
                      <LinkContainer to={'/admin/' + publication.entity.slug + '/write'} className="mr-3">
                        <Button variant="primary" size="lg">
                          Write Now
                        </Button>
                      </LinkContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Fade>
  );
}

const BottomWrapper = styled.div`
  padding-top: 50px;
  padding-bottom: 200px;
`;
