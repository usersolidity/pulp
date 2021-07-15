import MDEditor from '@uiw/react-md-editor';
import { selectArticle, selectIdentity, selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

export function ArticleRead() {
  const article = useSelector(selectArticle);
  let { url } = useRouteMatch();
  let { a_slug } = useParams<{ a_slug?: string }>();
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
    if (a_slug) {
      dispatch(actions.loadArticle(a_slug));
    }
  });

  return (
    <>
      <div className="mt-4">
        <div className="lead">{article?.entity?.title}</div>
        <div className="text-muted mb-3">{article?.entity?.subtitle}</div>
        <div className="text-muted small mb-3">{article?.entity?.slug}</div>
        <MDEditor.Markdown source={article?.entity?.content} />
      </div>
    </>
  );
}
