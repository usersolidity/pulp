import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { selectArticle, selectIdentity, selectPublication, useAppSlice } from 'store/app-state';

export function SubscribeForm() {
  const article = useSelector(selectArticle);
  let { url } = useRouteMatch();
  let { article_slug, publication_slug } = useParams<{ article_slug?: string; publication_slug?: string }>();
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
    if (article_slug && publication_slug) {
      dispatch(actions.loadArticle({ article_slug, publication_slug }));
    }
  });

  return (
    <>
      <div className="mt-4">TODO: Subscribe Form</div>
    </>
  );
}
