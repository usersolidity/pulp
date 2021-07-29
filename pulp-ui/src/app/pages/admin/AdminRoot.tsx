import { Footer } from 'app/components/Footer';
import { PageWrapper } from 'app/components/PageWrapper';
import { selectIdentity, selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import { AdminNavBar } from 'app/pages/admin/AdminNavBar';
import { HistoryRoot } from 'app/pages/admin/history/HistoryRoot';
import { NewArticle } from 'app/pages/admin/NewArticle/Loadable';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';

export function AdminRoot() {
  let { url } = useRouteMatch();
  let { publication_slug } = useParams<{ publication_slug?: string }>();
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
    if (!identity.state) {
      history.push('/auth/login');
      return;
    }

    if (publication_slug) {
      dispatch(actions.loadPublication(publication_slug));
      dispatch(actions.loadSettings(publication_slug));
    }
  });

  return (
    <>
      <AdminNavBar />
      <PageWrapper>
        <Switch>
          <Route exact path={`${url}/write`} component={NewArticle} />
          <Route path={`${url}/history`} component={HistoryRoot} />
          <Route path={`${url}/settings`}>
            <div>Settings</div>
          </Route>
          <Route path={`${url}/subscribers`}>
            <div>Subscribers Page</div>
          </Route>
        </Switch>
      </PageWrapper>
      <Footer />
    </>
  );
}
