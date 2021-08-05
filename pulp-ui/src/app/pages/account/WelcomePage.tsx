import { ExternalLink } from 'app/components/ExternalLink';
import { Lead } from 'app/components/Lead';
import { Title } from 'app/components/Title';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectCatalogue, selectIdentity, selectUserFriendlyName, useAppSlice } from 'store/app-state';
import styled from 'styled-components/macro';

export function WelcomePage() {
  const { t } = useTranslation();
  const { actions } = useAppSlice();
  const identity = useSelector(selectIdentity);
  const me = useSelector(selectUserFriendlyName);
  const catalogue = useSelector(selectCatalogue);
  const isNewAccount = false; // useSelector(selectNewAccount);
  const dispatch = useDispatch();
  const history = useHistory();
  let { url } = useRouteMatch();
  const [fade, setFade] = React.useState<boolean | undefined>(false);

  setTimeout(async () => {
    await setFade(true);
  }, 100);

  return (
    <>
      <Fade in={fade}>
        <Wrapper>
          <Title></Title>
          <Lead className="mt-4">
            Welcome to You-Space, <ExternalLink href={'https://etherscan.io/address/' + identity.state?.ethereum_address}>{me}</ExternalLink>!
          </Lead>
          <Lead className="mt-3">
            <LinkContainer to="/account/new">
              <Button size="lg" variant="outline-primary">
                Start a Publication
              </Button>
            </LinkContainer>{' '}
          </Lead>
          <div className="text-muted lead">your keys, your subscribers</div>
        </Wrapper>
      </Fade>
    </>
  );
}

const Wrapper = styled.main`
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
`;
