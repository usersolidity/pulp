import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { AwaitingPublication } from 'app/pages/admin/NewPublication/AwaitingPublication';
import { NewPublication } from 'app/pages/admin/NewPublication/NewPublication';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

export function NewPublicationRoot() {
  let { url } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>New Publication</title>
        <meta name="description" content="Start a new publication" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Switch>
          <Route exact path={`${url}/publishing`} component={AwaitingPublication} />
          <Route component={NewPublication} />
        </Switch>
      </PageWrapper>
    </>
  );
}
