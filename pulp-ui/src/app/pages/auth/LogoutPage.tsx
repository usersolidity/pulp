import { useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export function LogoutPage() {
  const { actions } = useAdminSlice();
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
