import { PageWrapper } from 'app/components/PageWrapper';
import { selectIdentity, selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import { AdminNavBar } from 'app/pages/admin/AdminNavBar';
import { ArticleList } from 'app/pages/read/ArticleList';
import { ArticleRead } from 'app/pages/read/ArticleRead';
import { ReadNavBar } from 'app/pages/read/ReadNavBar';
import { SubscribeForm } from 'app/pages/read/SubscribeForm';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';

export function ReadRoot() {
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
    if (publication_slug) {
      dispatch(actions.loadPublication(publication_slug));
    }
  });

  return (
    <>
      {publication?.entity?.founder === identity?.state?.ethereum_address ? <AdminNavBar /> : <ReadNavBar />}
      <PageWrapper>
        <Switch>
          <Route exact path={`${url}`} component={ArticleList} />
          <Route path={`/read/:publication_slug/on/:article_slug`} component={ArticleRead} />
          <Route path={`${url}/subscribe`} component={SubscribeForm} />
        </Switch>
      </PageWrapper>
    </>
  );
}
