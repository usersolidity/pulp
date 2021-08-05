import MDEditor from '@uiw/react-md-editor';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { selectArticle, selectIdentity, selectPublication, useAppSlice } from 'store/app-state';

export function ArticleRead() {
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
    console.log('loading...');
    console.log(article_slug);
    console.log(publication_slug);
    if (article_slug && publication_slug) {
      dispatch(actions.loadArticle({ article_slug, publication_slug }));
    }
  });

  return (
    <>
      <div className="mt-4">
        <div className="text-muted small">
          /pnlp/read/{publication?.entity?.slug}/on/{article?.entity?.slug}
        </div>
        <div className="lead mt-2">{article?.entity?.title}</div>
        <div className="text-muted mb-3">{article?.entity?.subtitle}</div>
        <MDEditor.Markdown source={article?.entity?.content} />
      </div>
    </>
  );
}
