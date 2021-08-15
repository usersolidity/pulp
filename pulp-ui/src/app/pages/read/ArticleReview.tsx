import { ReviewEntity } from 'pnlp/domain';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Fade from 'react-bootstrap/Fade';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { BsQuestionCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import {
  selectArticle,
  selectArticleUrl,
  selectAuthorFriendlyName,
  selectFounderFriendlyName,
  selectIdentity,
  selectPublication,
  selectReview,
  selectSubscription,
  useAppSlice
} from 'store/app-state';

export function ArticleReview() {
  const history = useHistory();
  let { url } = useRouteMatch();

  const { actions } = useAppSlice();
  const subscription = useSelector(selectSubscription);
  const { article_slug, publication_slug } = useParams<{ article_slug?: string; publication_slug?: string }>();
  const review = useSelector(selectReview);
  const article = useSelector(selectArticle);
  const article_url = useSelector(selectArticleUrl);
  const author_friendly_name = useSelector(selectAuthorFriendlyName);
  const founder_friendly_name = useSelector(selectFounderFriendlyName);
  const publication = useSelector(selectPublication);
  const identity = useSelector(selectIdentity);
  const dispatch = useDispatch();

  const onChangeReview = (value: Partial<ReviewEntity>) => {
    const updated_review = {
      ...review.entity,
      ...value,
    };
    dispatch(actions.setReview(updated_review));
  };

  const onSubmitForm = (evt?: React.FormEvent<HTMLFormElement>) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    dispatch(actions.reviewArticle());
  };

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(effect, []);
  };

  useEffectOnMount(() => {
    onChangeReview({
      approved: false,
      rating: 0,
      article: article.metadata?.ipfs,
    });
    if (publication_slug && article_slug) {
      dispatch(actions.loadArticle({ publication_slug, article_slug }));
    }
  });

  const [fade, setFade] = React.useState<boolean | undefined>(false);
  setTimeout(async () => {
    await setFade(true);
  }, 200);

  return (
    <Fade in={fade}>
      <Container>
        <Row className="my-5">
          <Col></Col>
          <Col xs={12} md={6}>
            <Container className="p-0">
              <Row>
                <Col md={10}>
                  <div className="lead">Reviewing: {article.entity.title}</div>
                  <div className="text-muted small mb-3">By: {author_friendly_name}</div>
                </Col>
                <Col md={2} className="text-right">
                  <a href="/docs" target="_blank">
                    <BsQuestionCircle />
                  </a>
                  {/* TODO: add docs page */}
                </Col>
              </Row>
            </Container>
            <Card>
              <Card.Body>
                <Form onSubmit={onSubmitForm}>
                  <Form.Group>
                    <Form.Label className="text-muted small">Article</Form.Label>
                    <Form.Control type="string" value={article_url} disabled />
                  </Form.Group>

                  <Form.Group>
                    <Form.Check
                      inline
                      label="Approve"
                      name="review-group"
                      type="radio"
                      id="approve"
                      value="approve"
                      onChange={e =>
                        onChangeReview({
                          approved: e.currentTarget.value === 'approve',
                        })
                      }
                    />
                    <Form.Check
                      inline
                      label="Reject"
                      name="review-group"
                      type="radio"
                      id="reject"
                      value="reject"
                      onChange={e =>
                        onChangeReview({
                          approved: e.currentTarget.value === 'approve',
                        })
                      }
                    />
                  </Form.Group>

                  <Button variant="primary" block size="lg" type="submit">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </Fade>
  );
}
