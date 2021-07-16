import { Footer } from 'app/components/Footer';
import { NavBar } from 'app/components/NavBar/Navbar';
import { PageWrapper } from 'app/components/PageWrapper';
import * as React from 'react';
import Fade from 'react-bootstrap/Fade';
import { Helmet } from 'react-helmet-async';
import { Features } from './Features';
import { Masthead } from './Masthead';

export function SplashPage() {
  const [fade, setFade] = React.useState<boolean | undefined>(false);
  setTimeout(async () => {
    await setFade(true);
  }, 100);

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A React Boilerplate application homepage" />
      </Helmet>
      <NavBar />
      <Fade in={fade}>
        <PageWrapper>
          <Masthead />
          <Features />
        </PageWrapper>
      </Fade>
      <Footer />
    </>
  );
}
