import { PageWrapper } from 'app/components/PageWrapper';
import { selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import { AdminNavBar } from 'app/pages/admin/AdminNavBar';
import { NewArticle } from 'app/pages/admin/NewArticle/Loadable';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';

export function AdminRoot() {
  let { url } = useRouteMatch();
  let { p_slug } = useParams<{ p_slug?: string }>();
  const { actions } = useAdminSlice();
  const publication = useSelector(selectPublication);
  const dispatch = useDispatch();

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(effect, []);
  };

  useEffectOnMount(() => {
    if (p_slug && (!publication?.entity?.slug || publication.entity.slug !== p_slug)) {
      dispatch(actions.loadPublication(p_slug));
      dispatch(actions.loadSettings(p_slug));
    }
  });

  return (
    <>
      <Helmet>
        <title>Sign In</title>
        <meta name="description" content="Sign in to use Pulp" />
      </Helmet>
      <AdminNavBar />
      <PageWrapper>
        <Switch>
          <Route exact path={`${url}/write`} component={NewArticle} />
          <Route path={`${url}/settings`}>
            <div>Settings</div>
          </Route>
          <Route path={`${url}/history`}>
            <div>History Page</div>
          </Route>
          <Route path={`${url}/subscribers`}>
            <div>Subscribers Page</div>
          </Route>
        </Switch>
      </PageWrapper>
    </>
  );
}
