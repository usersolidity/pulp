import MDEditor from '@uiw/react-md-editor';
import { friendlyName } from 'pnlp/domain';
import * as React from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { selectArticle, selectAuthorFriendlyName, selectIdentity, selectPublication, useAppSlice } from 'store/app-state';

export function ArticleRead() {
  const article = useSelector(selectArticle);
  let { url } = useRouteMatch();
  let { article_slug, publication_slug } = useParams<{ article_slug?: string; publication_slug?: string }>();
  const { actions } = useAppSlice();
  const publication = useSelector(selectPublication);
  const identity = useSelector(selectIdentity);
  const author_friendly_name = useSelector(selectAuthorFriendlyName);
  const dispatch = useDispatch();
  const history = useHistory();

  const approved_reviewers = article.reviews.filter(r => r.approved).map(r => friendlyName(r.reviewer));
  const rejected_reviewers = article.reviews.filter(r => !r.approved).map(r => friendlyName(r.reviewer));

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
      <Container className="mt-5">
        <Row>
          <Col className="text-muted small" xs={8} md={10}>
            pnlp://{publication?.entity?.slug}/{article?.entity?.slug}
          </Col>
          <Col className="text-right">
            <LinkContainer to={`/read/${publication.entity.slug}/on/${article.entity.slug}/review`}>
              <Button size="sm" variant="outline-primary">
                Review
              </Button>
            </LinkContainer>{' '}
          </Col>
        </Row>
        {!!approved_reviewers?.length && (
          <Row>
            <Col className="text-muted">
              Endorsed By: <Badge variant="success">{approved_reviewers[0]}</Badge>{' '}
            </Col>
          </Row>
        )}
        {!!rejected_reviewers?.length && (
          <Row>
            <Col className="text-muted">
              Rejected By: <Badge variant="danger">{rejected_reviewers[0]}</Badge>{' '}
            </Col>
          </Row>
        )}
        <hr />
        <Row>
          <Col className="lead mt-3">{article?.entity?.title}</Col>
        </Row>
        <Row>
          <Col className="text-muted mb-2">{article?.entity?.subtitle}</Col>
        </Row>
        <Row>
          <Col className="text-muted mb-3">By: {author_friendly_name}</Col>
        </Row>
        <Row>
          <Col className="text-muted mt-4">
            <MDEditor.Markdown source={article?.entity?.content} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
