/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { AdminRoot } from 'app/pages/admin/AdminRoot/Loadable';
import { NewPublicationRoot } from 'app/pages/admin/NewPublication/Loadable';
import { LoginPage } from 'app/pages/LoginPage/Loadable';
import { ReadRoot } from 'app/pages/read/ReadRoot/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GlobalStyle } from '../styles/global-styles';
import { AboutPage } from './pages/AboutPage/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet titleTemplate="%s - Pulp" defaultTitle="Publish on Web 3" htmlAttributes={{ lang: i18n.language }}>
        <meta name="description" content="Pulp: Publish on Web 3" />
      </Helmet>

      <Switch>
        <Route exact path={process.env.PUBLIC_URL + '/'} component={HomePage} />
        <Route exact path={process.env.PUBLIC_URL + '/about'} component={AboutPage} />
        <Route exact path={process.env.PUBLIC_URL + '/login'} component={LoginPage} />
        <Route path={process.env.PUBLIC_URL + '/new'} component={NewPublicationRoot} />
        <Route path={process.env.PUBLIC_URL + '/admin/:p_slug'} component={AdminRoot} />
        <Route path={process.env.PUBLIC_URL + '/read/:p_slug'} component={ReadRoot} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
