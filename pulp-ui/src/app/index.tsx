/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { AccountRoot } from 'app/pages/account/Loadable';
import { AdminRoot } from 'app/pages/admin/AdminRoot/Loadable';
import { NewPublicationRoot } from 'app/pages/admin/NewPublication/Loadable';
import { AuthRoot } from 'app/pages/auth/Loadable';
import { ReadRoot } from 'app/pages/read/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Route, Router, Switch } from 'react-router-dom';
import history from 'utils/history';
import { GlobalStyle } from '../styles/global-styles';
import { AboutPage } from './pages/AboutPage/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';

export function App() {
  const { i18n } = useTranslation();
  return (
    <Router history={history}>
      <Helmet titleTemplate="%s - Pulp" defaultTitle="Publish on Web 3" htmlAttributes={{ lang: i18n.language }}>
        <meta name="description" content="Pulp: Publish on Web 3" />
      </Helmet>

      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={HomePage} />
        <Route exact path={`${process.env.PUBLIC_URL}/about`} component={AboutPage} />
        <Route path={`${process.env.PUBLIC_URL}/new`} component={NewPublicationRoot} />
        <Route path={`${process.env.PUBLIC_URL}/auth`} component={AuthRoot} />
        <Route path={`${process.env.PUBLIC_URL}/account`} component={AccountRoot} />
        <Route path={`${process.env.PUBLIC_URL}/admin/:p_slug`} component={AdminRoot} />
        <Route path={`${process.env.PUBLIC_URL}/read/:p_slug`} component={ReadRoot} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </Router>
  );
}
