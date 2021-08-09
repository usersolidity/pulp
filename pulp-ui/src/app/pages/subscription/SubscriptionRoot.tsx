import { Footer } from 'app/components/Footer';
import { NavBar } from 'app/components/NavBar/Navbar';
import { PageWrapper } from 'app/components/PageWrapper';

import { NewSubscription } from 'app/pages/subscription/NewSubscription';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { selectIdentity, selectSubscription, useAppSlice } from 'store/app-state';

export function SubscriptionRoot() {
  let { url } = useRouteMatch();
  const { actions } = useAppSlice();
  const subscription = useSelector(selectSubscription);
  const identity = useSelector(selectIdentity);
  const dispatch = useDispatch();
  const history = useHistory();

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(effect, []);
  };

  useEffectOnMount(() => {
    // if (!identity.state) {
    //   alert('need to login')
    //   history.push('/auth/login');
    //   return;
    // }

    dispatch(actions.createSubscription());
  });

  return (
    <>
      <NavBar />
      <PageWrapper>
        <Switch>
          <Route exact path={`${url}/new`} component={NewSubscription} />
        </Switch>
      </PageWrapper>
      <Footer />
    </>
  );
}
