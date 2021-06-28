import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Features } from './Features';
import { Masthead } from './Masthead';

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About</title>
        <meta
          name="description"
          content="Information about Pulp"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Masthead />
        <Features />
      </PageWrapper>
    </>
  );
}
