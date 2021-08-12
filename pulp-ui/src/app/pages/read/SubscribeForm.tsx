import { SubscriptionEntity } from 'pnlp/domain';
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
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectFounderFriendlyName, selectIdentity, selectPublication, selectSubscription, useAppSlice } from 'store/app-state';

export function SubscribeForm() {
  const history = useHistory();
  let { url } = useRouteMatch();

  const { actions } = useAppSlice();
  const subscription = useSelector(selectSubscription);
  const founder_friendly_name = useSelector(selectFounderFriendlyName);
  const publication = useSelector(selectPublication);
  const identity = useSelector(selectIdentity);
  const dispatch = useDispatch();

  const onChangeSubscription = (value: Partial<SubscriptionEntity>) => {
    const updated_subscription = {
      ...subscription.entity,
      ...value,
    };
    dispatch(actions.setSubscription(updated_subscription));
  };

  const onSubmitForm = (evt?: React.FormEvent<HTMLFormElement>) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    dispatch(actions.createSubscription());
  };

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
                  <div className="lead">Subscribe to {publication.entity.properties.title}</div>
                  <div className="text-muted small mb-3">{publication.entity.properties.tagline}</div>
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
                    <Form.Label className="text-muted small">Subscription Rate</Form.Label>
                    <Form.Control type="string" value="1 DAIx / month" disabled />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="text-muted small">Subscribe To</Form.Label>
                    <Form.Control type="string" value={publication.entity.slug} disabled />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="text-muted small">Paid To</Form.Label>
                    <Form.Control type="input" disabled value={founder_friendly_name} />
                  </Form.Group>

                  <Button variant="primary" block size="lg" type="submit">
                    Subscribe
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
