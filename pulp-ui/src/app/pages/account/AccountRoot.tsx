import { Footer } from 'app/components/Footer';
import { NavBar } from 'app/components/NavBar/Navbar';
import { PageWrapper } from 'app/components/PageWrapper';
import { AccountDashboard } from 'app/pages/account/AccountDashboard';
import { AccountInfo } from 'app/pages/account/AccountInfo';
import { AwaitingPublication } from 'app/pages/account/AwaitingPublication';
import { NewPublication } from 'app/pages/account/NewPublication';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { selectIdentity, selectPublication, useAppSlice } from 'store/app-state';

export function AccountRoot() {
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

  useEffectOnMount(() => {
    if (!identity.state) {
      history.push('/auth/login');
      return;
    }

    dispatch(actions.listPublications());
  });

  return (
    <>
      <NavBar />
      <PageWrapper>
        <Switch>
          <Route exact path={`${url}`} component={AccountDashboard} />
          <Route exact path={`${url}/new`} component={NewPublication} />
          <Route exact path={`${url}/publishing`} component={AwaitingPublication} />
          <Route exact path={`${url}/info`} component={AccountInfo} />
        </Switch>
      </PageWrapper>
      <Footer />
    </>
  );
}
