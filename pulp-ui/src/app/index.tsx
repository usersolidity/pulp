/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { LoadableAccountRoot } from 'app/pages/account/LoadableAccountRoot';
import { LoadableAdminRoot } from 'app/pages/admin/LoadableAdminRoot';
import { LoadableAuthRoot } from 'app/pages/auth/LoadableAuthRoot';
import { LoadableReadRoot } from 'app/pages/read/LoadableReadRoot';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Route, Router, Switch } from 'react-router-dom';
import history from 'utils/history';
import { GlobalStyle } from '../styles/global-styles';
import { LoadableAboutPage } from './pages/info/LoadableAboutPage';
import { LoadableNotFoundPage } from './pages/misc/NotFoundPage/LoadableNotFoundPage';
import { LoadableSplashPage } from './pages/splash/LoadableSplashPage';

export function App() {
  const { i18n } = useTranslation();
  return (
    <Router history={history}>
      <Helmet titleTemplate="%s - Pulp" defaultTitle="Publish on Web 3" htmlAttributes={{ lang: i18n.language }}>
        <meta name="description" content="Pulp: Publish on Web 3" />
      </Helmet>

      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={LoadableSplashPage} />
        <Route exact path={`${process.env.PUBLIC_URL}/about`} component={LoadableAboutPage} />
        <Route path={`${process.env.PUBLIC_URL}/auth`} component={LoadableAuthRoot} />
        <Route path={`${process.env.PUBLIC_URL}/account`} component={LoadableAccountRoot} />
        <Route path={`${process.env.PUBLIC_URL}/admin/:p_slug`} component={LoadableAdminRoot} />
        <Route path={`${process.env.PUBLIC_URL}/read/:p_slug`} component={LoadableReadRoot} />
        <Route component={LoadableNotFoundPage} />
      </Switch>
      <GlobalStyle />
    </Router>
  );
}
