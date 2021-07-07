import { Footer } from 'app/components/Footer';
import { Link } from 'app/components/Link';
import { Subscribe } from 'app/components/Subscribe';
import { selectPublication } from 'app/pages/admin/admin-redux';
import { ReactComponent as EthLogo } from 'app/pages/admin/assets/eth-grey.svg';
import ipfs_logo from 'app/pages/admin/assets/ipfs-grey-64-wikimedia.png';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Fade from 'react-bootstrap/Fade';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components/macro';

export function AwaitingPublication() {
  const [open, setOpen] = React.useState(10);
  const publication = useSelector(selectPublication);

  var interval = setInterval(function () {
    setOpen(open + 1);
    if (open > 3) {
      clearInterval(interval);
    }
  }, 2000);

  return (
    <div className="mt-5">
      <Fade in={open > 0}>
        <div>
          <h5 className="lead">Publishing to the Distributed Web</h5>
          <p className="text-muted">This may take a little longer than you're used to on Web 2, but you didn't come for the speed.</p>
        </div>
      </Fade>
      {/* TODO: add incrementing timeout, feed messages until transaction closes */}
      <Fade in={open > 1}>
        <div>
          <Media className="mt-5 text-right">
            <Media.Body>
              <h5 className="lead">Broadcasting to IPFS</h5>
              <p className="text-muted">So you can commoditize your publishing house</p>
            </Media.Body>
            <img width={52} height={52} className="ml-3" src={ipfs_logo} alt="ipfs-logo" />
          </Media>
          <Media className="mt-5">
            <EthLogo style={{ width: '52px', height: '52px' }} />
            <Media.Body>
              <h5 className="lead">Transacting on the Ethereum Distributed Computer</h5>
              <p className="text-muted">So you can monetize like its 2021</p>
            </Media.Body>
          </Media>
        </div>
      </Fade>
      <Fade in={open > 2}>
        <div>
          <div className="mt-5 text-right">
            <h5 className="lead">Awaiting Ethereum Transaction</h5>
            <p className="text-muted">So you can own your authorship</p>
          </div>
          <div className="mt-5">
            <h5 className="lead">While we have you</h5>
            <p className="text-muted">
              If we may be so <b>bold</b>
            </p>
          </div>
        </div>
      </Fade>
      <Fade in={open > 3}>
        <div>
          <div className="mt-5 text-right">
            <h5 className="lead">Content Creators Love Pulp</h5>
            <p className="text-muted">
              Because{' '}
              <Link to={{ pathname: 'https://linktr.ee/pulp_network' }} target="_blank">
                Disintermediation
              </Link>
            </p>
          </div>
          <div className="mt-5">
            <h5 className="lead">We're In Alpha, For Updates Follow Along in our Newsletter</h5>
            <p className="text-muted">(yes, we publish on Pulp too)</p>
          </div>
          <Row className="mt-5 text-center">
            <Col xs={12} md={{ span: 3, offset: 3 }}>
              <Subscribe />
            </Col>
          </Row>
        </div>
      </Fade>
      <Fade in={open > 4}>
        <div>
          <div className="mt-5 text-right">
            <h5 className="lead">That Ethereum Transaction finished by the way</h5>
            <p className="text-muted">
              See it on a block explorer{' '}
              <Link to={{ pathname: 'https://etherscan.io/tx/' + publication?.metadata?.tx }} target="_blank">
                here
              </Link>
            </p>
          </div>
          <div className="mt-5 text-left">
            <h5 className="lead">Time to Publish on Web 3</h5>
            <p className="text-muted">Leave the internet of the twentyteens behind</p>
          </div>
          <BottomWrapper className="mb-5 mt-5 text-center">
            <p className="text-muted">
              <LinkContainer to={'/admin/' + publication.entity.slug + '/write'} className="mr-3">
                <Button variant="primary" size="lg">
                  Write Now
                </Button>
              </LinkContainer>
            </p>
            <p className="text-muted"></p>
          </BottomWrapper>
        </div>
      </Fade>
      <Footer />
    </div>
  );
}

const BottomWrapper = styled.div`
  padding-top: 50px;
  padding-bottom: 200px;
`;
