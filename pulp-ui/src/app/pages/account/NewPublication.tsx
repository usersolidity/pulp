import { selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import { PublicationPropertiesEntity } from 'pnlp/domain';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Fade from 'react-bootstrap/Fade';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { BsQuestionCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

export function NewPublication() {
  const history = useHistory();
  let { url } = useRouteMatch();

  const { actions } = useAdminSlice();
  const publication = useSelector(selectPublication);
  const dispatch = useDispatch();

  const onChangePublicationProperties = (value: Partial<PublicationPropertiesEntity>) => {
    const updated_publication = {
      ...publication.entity,
      properties: {
        ...publication.entity.properties,
        ...value,
      },
    };
    dispatch(actions.setPublication(updated_publication));
  };

  const onChangePublicationSlug = (value: string) => {
    const updated_publication = {
      ...publication.entity,
      slug: value,
    };
    dispatch(actions.setPublication(updated_publication));
  };

  const onSubmitForm = (evt?: React.FormEvent<HTMLFormElement>) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    dispatch(actions.createPublication());
    history.push(`/account/publishing`);
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
                  <div className="lead">Publish on Web 3</div>
                  <div className="text-muted small mb-3">from your keyboard to the universe</div>
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
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label className="text-muted small">Publication Name</Form.Label>
                    <Form.Control
                      type="input"
                      placeholder="e.g. 'The New York Rhymes'"
                      value={publication.entity.properties.title}
                      onChange={e =>
                        onChangePublicationProperties({
                          title: e.currentTarget.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label className="text-muted small">Tagline</Form.Label>
                    <Form.Control
                      type="input"
                      placeholder="e.g. 'All the verse that's fit to spit'"
                      value={publication.entity.properties.tagline}
                      onChange={e =>
                        onChangePublicationProperties({
                          tagline: e.currentTarget.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label className="text-muted small">URL</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control
                        id="inlineFormInputGroup"
                        placeholder="e.g. 'nyrhymes'"
                        value={publication.entity.slug}
                        onChange={e => onChangePublicationSlug(e.currentTarget.value)}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text>.on.pulp.network</InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check
                      className="text-muted small"
                      type="checkbox"
                      label="I understand pulp is in pre-release alpha. Contracts have not been audited. Data may be lost."
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" block size="lg" type="submit">
                    🚀 TTM
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
