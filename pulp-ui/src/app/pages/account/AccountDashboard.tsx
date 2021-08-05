import { PublicationList } from 'app/pages/account/PublicationList';
import { WelcomePage } from 'app/pages/account/WelcomePage';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectCatalogue, selectIdentity, selectUserFriendlyName, useAppSlice } from 'store/app-state';

export function AccountDashboard() {
  const { t } = useTranslation();
  const { actions } = useAppSlice();
  const identity = useSelector(selectIdentity);
  const me = useSelector(selectUserFriendlyName);
  const catalogue = useSelector(selectCatalogue);
  const isNewAccount = false; // useSelector(selectNewAccount);
  const dispatch = useDispatch();
  const history = useHistory();
  let { url } = useRouteMatch();

  const onSelect = (slug: string) => {
    history.push(`/admin/${slug}/write`);
  };

  return <>{isNewAccount ? <WelcomePage /> : <PublicationList />}</>;
}
