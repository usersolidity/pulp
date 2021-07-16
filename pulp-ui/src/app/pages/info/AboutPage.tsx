import { ExternalLink } from 'app/components/ExternalLink';
import { Footer } from 'app/components/Footer';
import { Lead } from 'app/components/Lead';
import { NavBar } from 'app/components/NavBar/Navbar';
import { P } from 'app/components/P';
import { PageWrapper } from 'app/components/PageWrapper';
import { Subscribe } from 'app/components/Subscribe';
import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components/macro';
import { ReactComponent as CSSIcon } from './assets/cra-logo.svg';

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About</title>
        <meta name="description" content="Information about Pulp" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Wrapper>
          <Title>The Future of Publishing Awaits (Nobody)</Title>
          <Lead className="mt-4">Already familiar with decentralized apps?</Lead>
          <Lead className="mt-3">
            <LinkContainer to="/auth/login" className="mr-3">
              <Button variant="outline-secondary">Sign In</Button>
            </LinkContainer>
          </Lead>
        </Wrapper>
        <Lead className="mt-4 text-center">Otherwise, here's a quick rundown:</Lead>
        <List>
          <Feature>
            <CSSIcon className="feature-icon" />
            <Content>
              <SubTitle>TLDR</SubTitle>
              <P>You control your destiny by cryptographically owning your data, your payment channel, and your content history.</P>
              <P>
                You need to install a crypto identity service like{' '}
                <ExternalLink href="https://metamask.io/" target="_blank">
                  Metamask
                </ExternalLink>
                .
              </P>
              <P>
                <LinkContainer to="/auth/login" className="mr-3">
                  <Button size="sm" variant="outline-secondary">
                    Sign In
                  </Button>
                </LinkContainer>
              </P>
            </Content>
          </Feature>
          <Feature>
            <CSSIcon className="feature-icon" />
            <Content>
              <SubTitle>A Fat Protocol</SubTitle>
              <P>
                Recent advances in smart contract platforms like <strong>Ethereum</strong> and distributed storage protocols like <strong>IPFS</strong> have paved the way for a
                new, architecturally unique class of applications that puts content creators in control of their own destiny.
              </P>
              <P>
                We've composed these protocols and others into a new publishing model: <strong>pnlp</strong>.
              </P>
              <P>
                The website you're using, <span className="text-primary">pulp</span>, is the "reference client" of the <strong>pnlp</strong> protocol. This means that{' '}
                <span className="text-primary">https://pulp.network</span> is less a middleman than it is one of many potential access points to the fat protocol.
              </P>
              <P>
                The result is that <strong>your</strong> data is cryptographically owned by <strong>you</strong>, while the programmatic functionality of the application lives
                entirely in the public domain as a smart contract!
              </P>
            </Content>
          </Feature>
          <Feature>
            <CSSIcon className="feature-icon" />
            <Content>
              <SubTitle>Identity</SubTitle>
              <P>
                The biggest change in user experience from the traditional web is the "login flow". Rather than authenticating with a centralized server in traditional terms, you
                use a public/private keypair to interact with the <strong>pnlp</strong> protocol.
              </P>
              <P>Metamask is a browser plugin that makes this straightforward.</P>
              <P>
                So before using <span className="text-primary">pulp</span>, you'll need to install{' '}
                <ExternalLink href="https://metamask.io/" target="_blank">
                  Metamask
                </ExternalLink>
                . Be sure to closely follow their security instructions to make sure your data stays secure and accessible.
              </P>
              <P>
                <strong>Pulp cannot recover your data if you lose access to your Metamask key!</strong>
              </P>
            </Content>
          </Feature>
          <Feature>
            <CSSIcon className="feature-icon" />
            <Content>
              <SubTitle>Pre-Release Alpha</SubTitle>
              <P>
                Note that <strong>pnlp</strong> is still under active development.
              </P>
              <P>
                <strong>Our smart contracts have not been audited and data may be permanently lost!!!</strong>
              </P>
              <P>Subscribe to our newsletter for project updates:</P>
              <Subscribe />
            </Content>
          </Feature>
          <Lead className="mt-4 text-center">So Get Started!</Lead>
          <div className="text-center">
            <LinkContainer to="/auth/login" className="mb-5">
              <Button size="lg" variant="outline-secondary">
                Sign In
              </Button>
            </LinkContainer>
          </div>
        </List>
      </PageWrapper>
      <Footer />
    </>
  );
}

const Wrapper = styled.main`
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
`;

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
