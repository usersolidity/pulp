import { NavBar } from 'app/components/NavBar/Navbar';
import { PageWrapper } from 'app/components/PageWrapper';
import { LoginPage } from 'app/pages/auth/LoginPage';
import { LogoutPage } from 'app/pages/auth/LogoutPage';
import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

export function AuthRoot() {
  let { url } = useRouteMatch();

  return (
    <>
      <NavBar />
      <PageWrapper>
        <Switch>
          <Route exact path={`${url}/login`} component={LoginPage} />
          <Route exact path={`${url}/logout`} component={LogoutPage} />
        </Switch>
      </PageWrapper>
    </>
  );
}
