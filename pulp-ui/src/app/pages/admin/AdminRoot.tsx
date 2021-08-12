import { Footer } from 'app/components/Footer';
import { PageWrapper } from 'app/components/PageWrapper';
import { AdminNavBar } from 'app/pages/admin/AdminNavBar';
import { HistoryRoot } from 'app/pages/admin/history/HistoryRoot';
import { NewArticle } from 'app/pages/admin/NewArticle/Loadable';
import { SubscriberList } from 'app/pages/admin/SubscriberList';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { selectIdentity, selectPublication, useAppSlice } from 'store/app-state';

export function AdminRoot() {
  let { url } = useRouteMatch();
  let { publication_slug } = useParams<{ publication_slug?: string }>();
  const { actions } = useAppSlice();
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
      // TODO:NEXT: subscribers hang off the author, not the publication
      // we need a way to remedy that. maybe add publication metadata onto a superfluid stream?
      dispatch(actions.loadPublication(publication_slug));
      dispatch(actions.loadSettings(publication_slug));
      dispatch(actions.listSubscribers());
    }
  });

  return (
    <>
      <AdminNavBar />
      <PageWrapper>
        <Switch>
          <Route exact path={`${url}/write`} component={NewArticle} />
          <Route path={`${url}/history`} component={HistoryRoot} />
          <Route path={`${url}/subscribers`} component={SubscriberList} />
          <Route path={`${url}/settings`}>
            <div>Settings</div>
          </Route>
        </Switch>
      </PageWrapper>
      <Footer />
    </>
  );
}
