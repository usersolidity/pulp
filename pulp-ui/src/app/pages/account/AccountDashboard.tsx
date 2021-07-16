import { PublicationList } from 'app/pages/account/PublicationList';
import { WelcomePage } from 'app/pages/account/WelcomePage';
import { selectCatalogue, selectIdentity, selectMe, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

export function AccountDashboard() {
  const { t } = useTranslation();
  const { actions } = useAdminSlice();
  const identity = useSelector(selectIdentity);
  const me = useSelector(selectMe);
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
