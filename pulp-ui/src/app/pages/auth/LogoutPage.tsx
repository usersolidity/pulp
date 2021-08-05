import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAppSlice } from 'store/app-state';

export function LogoutPage() {
  const { actions } = useAppSlice();
  const dispatch = useDispatch();
  const history = useHistory();

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(effect, []);
  };

  useEffectOnMount(() => {
    dispatch(actions.clearIdentity());
    history.push('/');
  });

  return (
    <>
      <div>Signing Out...</div>
    </>
  );
}
