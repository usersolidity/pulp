import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { LoginPage } from 'app/pages/auth/LoginPage';
import { LogoutPage } from 'app/pages/auth/LogoutPage';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

export function AuthRoot() {
  let { url } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Pulp Auth</title>
        <meta name="description" content="Pulp Auth" />
      </Helmet>
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
