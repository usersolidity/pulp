import { PageWrapper } from 'app/components/PageWrapper';
import { selectIdentity, selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import { AdminNavBar } from 'app/pages/admin/AdminNavBar';
import { ArticleList } from 'app/pages/read/ArticleList';
import { ArticleRead } from 'app/pages/read/ArticleRead';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';

export function ReadRoot() {
  let { url } = useRouteMatch();
  let { p_slug } = useParams<{ p_slug?: string }>();
  const { actions } = useAdminSlice();
  const publication = useSelector(selectPublication);
  const identity = useSelector(selectIdentity);
  const dispatch = useDispatch();
  const history = useHistory();

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(effect, []);
  };

  // TODO:NEXT: this doesn't get called every time so we don't reload publication on route change
  useEffectOnMount(() => {
    if (p_slug) {
      dispatch(actions.loadPublication(p_slug));
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
          <Route exact path={`${url}`} component={ArticleList} />
          <Route path={`${url}/:a_slug`} component={ArticleRead} />
        </Switch>
      </PageWrapper>
    </>
  );
}
