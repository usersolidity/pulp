import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { Lead } from '../components/Lead';
import { P } from '../components/P';
import { SubTitle } from '../components/SubTitle';
import { Title } from '../components/Title';
import { ReactComponent as CSSIcon } from './assets/css.svg';
import { ReactComponent as INTLIcon } from './assets/intl.svg';
import { ReactComponent as RouteIcon } from './assets/route.svg';
import { ReactComponent as StateIcon } from './assets/state.svg';

export function Features() {
  const { t } = useTranslation();

  return (
    <>
      <Title className="h3 text-muted text-center mb-5">Not your keys? Not your Subscriber.</Title>
      <Lead className="pt-5">
        Built on an <strong>Open Protocol</strong>,
      </Lead>
      <Lead className="text-center">
        <span className="text-primary">pulp</span> puts <strong>Content Creators</strong>
      </Lead>
      <Lead className="text-right">
        in <strong>Mathematical Control</strong>.
      </Lead>
      <List>
        <Feature>
          <StateIcon className="feature-icon" />
          <Content>
            <SubTitle>Commoditize Your Inputs</SubTitle>
            <P>
              Your payment service, your subscriber list, your content history: existential inputs to all future revenue. Content creators achieve independence through
              commoditizing the format and access to their critical inputs.
            </P>
            <P>
              The <strong>pnlp</strong> protocol commoditizes your most precious inputs through the composition of well-travelled protocols like <strong>Ethereum</strong>,{' '}
              <strong>IPFS</strong>, <strong>SMTP</strong>, <strong>RSS</strong>, and <strong>SMS</strong>.
            </P>
          </Content>
        </Feature>
        <Feature>
          <CSSIcon className="feature-icon" />
          <Content>
            <SubTitle>Monetize like it's 2021</SubTitle>
            <P>
              Did we mention <strong>pnlp</strong> interoperates with the <strong>Ethereum</strong> blockchain? With a smart contract platform as your native payment channel, your
              billing model options just got a whole lot... richer.
            </P>
          </Content>
        </Feature>
        <Feature>
          <INTLIcon className="feature-icon" />
          <Content>
            <SubTitle>Direct to Subscriber</SubTitle>
            <P>
              With subscriber list in hand, interact with <strong>your customers</strong> on <strong>your terms</strong>, forever.
            </P>
            <P>
              We know. That's what <i>Medium</i> said...
            </P>
            <P>
              But <strong>pnlp</strong> promises are <strong>cryptographic</strong>.
            </P>
          </Content>
        </Feature>
        <Feature>
          <RouteIcon className="feature-icon" />
          <Content>
            <SubTitle>Participate in the Constitution of Knowledge</SubTitle>
            <P>
              <strong>pnlp</strong> grants access to a competitive pool of Editorial Boards with a Many-to-Many review pattern.
            </P>
            <P>Pluralism ensues.</P>
          </Content>
        </Feature>
      </List>
    </>
  );
}

const Feature = styled.li`
  display: flex;
  margin: 6.25rem 0 6.25rem 2.25rem;

  .feature-icon {
    width: 6.25rem;
    height: 6.25rem;
    margin-right: 2.25rem;
    flex-shrink: 0;
  }
`;
const Content = styled.div`
  flex: 1;
`;

const List = styled.ul`
  padding: 0;
  margin: 6.25rem 0 0 0;
`;
