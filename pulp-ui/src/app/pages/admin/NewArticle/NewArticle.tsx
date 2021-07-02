import MDEditor from '@uiw/react-md-editor';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { BsQuestionCircle } from "react-icons/bs";
import { useParams, useRouteMatch } from "react-router-dom";

export function NewArticle() {
  const { t } = useTranslation();
  let { url } = useRouteMatch();
  let { p_slug } = useParams<{ p_slug?: string }>();
  const [showPreview, setShowPreview] = React.useState<boolean | undefined>(false)
  // const showPreview = () => setShowPreview(true)

  const [value, setValue] = React.useState<string | undefined>("**Hello world!!!**");

  return (
    <div>
      <Container className="p-0 mt-4">
        <Row>
          <Col md={10}>
            <div className="lead">
              New Article
            </div>
            <div className="text-muted small mb-3">
              from your keyboard to the universe
            </div>
          </Col>
          <Col md={2} className="text-right">
            <a href="" target="_blank"><BsQuestionCircle /></a>
            {/* TODO: add docs page */}
          </Col>
        </Row>
      </Container>
      <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            {/* <Form.Label className="text-muted small">Title</Form.Label> */}
            <Form.Control size="lg" type="input" placeholder="Title..." />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlInput1">
            {/* <Form.Label className="text-muted small">Subtitle</Form.Label> */}
            <Form.Control type="input" placeholder="Subtitle..." />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlInput1">
            {/* <Form.Label className="text-muted small">Subtitle</Form.Label> */}
            <InputGroup className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text>https://nytimes.on.pulp.network/</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control id="inlineFormInputGroup" placeholder="URL..." />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formBasicCheckbox">
            <MDEditor
              value={value}
              height={400}
              preview={'edit'}
              onChange={(v?: string) => setValue(v)}
            />
          </Form.Group>

        <div className="text-right">
          <Button variant="light" size="lg" className="mr-3" onClick={(e) => setShowPreview(true)}>
            Preview
          </Button>
          <Button variant="primary" size="lg" type="submit">
            Publish
          </Button>
        </div>
        </Form>
      <div>
        { showPreview ? <MDEditor.Markdown source={value} /> : null }
      </div>
    </div>
  );
}
