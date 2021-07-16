import MDEditor from '@uiw/react-md-editor';
import { selectArticle, selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
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
    <Container className="mt-5">
      <Row className="mb-5">
        <Col className="text-muted text-center small">
          <span className="text-primary">Previewing</span> {publication?.entity?.slug}.on.pulp.network/{article?.entity?.slug}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={8} md={10}>
          <div className="lead">{article?.entity?.title}</div>
          <div className="text-muted">{article?.entity?.subtitle}</div>
          <div className="text-muted small">By: {article?.entity?.author}</div>
        </Col>
        <Col className="text-right">
          <Button variant="outline-secondary" className="mr-3" onClick={onTogglePreview}>
            Edit
          </Button>
        </Col>
      </Row>
      <div className="mt-4">
        <MDEditor.Markdown source={article?.entity?.content} />
        <div className="text-right mt-3 mb-3">
          <Button variant="outline-secondary" className="mr-3" onClick={onTogglePreview}>
            Edit
          </Button>
        </div>
      </div>
    </Container>
  );
}
