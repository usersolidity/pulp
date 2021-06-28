import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export function NewPublication() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>New Publication</title>
        <meta
          name="description"
          content="Start a new publication"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Container>
          <Row className="my-5">
            <Col></Col>
            <Col xs={12} md={6}>
              <div className="lead">
                Start a Publication
              </div>
              <div className="text-muted small mb-3">
                from your keyboard to the universe
              </div>
              <Card>
                <Card.Body>
                  <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label className="text-muted small">Publication Name</Form.Label>
                      <Form.Control type="input" placeholder="e.g. 'The New York Rhymes'" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label className="text-muted small">Tagline</Form.Label>
                      <Form.Control type="input" placeholder="e.g. 'All the verse that's fit to spit'" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label className="text-muted small">URL</Form.Label>
                      <InputGroup className="mb-2">
                        <Form.Control id="inlineFormInputGroup" placeholder="e.g. 'nyrhymes'" />
                        <InputGroup.Append>
                          <InputGroup.Text>.on.pulp.network</InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox">
                      <Form.Check className="text-muted small" type="checkbox" label="I understand pulp is in beta. Contracts have not been audited." required/>
                    </Form.Group>
                    <Button variant="primary" block size="lg" type="submit">
                      Begin
                    </Button>
                  </Form>
                  </Card.Body>
                </Card>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </PageWrapper>
    </>
  );
}
