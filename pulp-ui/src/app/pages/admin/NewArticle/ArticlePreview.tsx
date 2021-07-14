import MDEditor from '@uiw/react-md-editor';
import { selectArticle, selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch } from 'react-router-dom';

export function ArticlePreview() {
  let { url } = useRouteMatch();
  let { p_slug } = useParams<{ p_slug?: string }>();
  // const showPreview = () => setShowPreview(true)
  const { actions } = useAdminSlice();
  const article = useSelector(selectArticle);
  const publication = useSelector(selectPublication);
  const dispatch = useDispatch();

  const [value, setValue] = React.useState<string | undefined>('**Hello world!!!**');

  const onTogglePreview = () => {
    const application_state = {
      ...article.application,
      preview: !article.application.preview,
    };
    dispatch(actions.setArticleApplicationState(application_state));
  };

  return (
    <div className="mt-4">
      <div className="lead">{article?.entity?.title}</div>
      <div className="text-muted mb-3">{article?.entity?.subtitle}</div>
      <div className="text-muted small mb-3">{article?.entity?.slug}</div>
      <MDEditor.Markdown source={article?.entity?.content} />
      <div className="text-right">
        <Button variant="light" className="mr-3" onClick={onTogglePreview}>
          Edit
        </Button>
        <Button variant="primary" type="submit">
          Publish
        </Button>
      </div>
    </div>
  );
}
