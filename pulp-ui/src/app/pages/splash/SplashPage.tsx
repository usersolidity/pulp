import { Footer } from 'app/components/Footer';
import { NavBar } from 'app/components/NavBar/Navbar';
import { PageWrapper } from 'app/components/PageWrapper';
import * as React from 'react';
import Fade from 'react-bootstrap/Fade';
import { Features } from './Features';
import { Masthead } from './Masthead';

export function SplashPage() {
  const [fade, setFade] = React.useState<boolean | undefined>(false);
  setTimeout(async () => {
    await setFade(true);
  }, 100);

  return (
    <>
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
