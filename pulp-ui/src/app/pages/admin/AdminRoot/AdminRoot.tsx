import { PageWrapper } from 'app/components/PageWrapper';
import { AdminNavBar } from 'app/pages/admin/AdminNavBar';
import { NewArticle } from 'app/pages/admin/NewArticle/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";

export function AdminRoot() {
  const { t } = useTranslation();
  let { url } = useRouteMatch();
  let { p_slug } = useParams<{p_slug?: string}>();

  return (
    <>
      <Helmet>
        <title>Sign In</title>
        <meta
          name="description"
          content="Sign in to use Pulp"
        />
      </Helmet>
      <AdminNavBar />
      <PageWrapper>
        <Switch>
          <Route exact path={`${url}/write`} component={NewArticle} />
          <Route path={`${url}/settings`}>
            <div>
              Settings
            </div>
          </Route>
          <Route path={`${url}/history`}>
            <div>
              History Page
            </div>
          </Route>
          <Route path={`${url}/subscribers`}>
            <div>
              Subscribers Page
            </div>
          </Route>
        </Switch>
      </PageWrapper>
    </>
  );
}
