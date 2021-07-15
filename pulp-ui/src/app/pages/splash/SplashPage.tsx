import { NavBar } from 'app/components/NavBar/Navbar';
import { PageWrapper } from 'app/components/PageWrapper';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Features } from './Features';
import { Masthead } from './Masthead';

export function SplashPage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A React Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Masthead />
        <Features />
      </PageWrapper>
    </>
  );
}
