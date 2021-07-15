import MDEditor from '@uiw/react-md-editor';
import { selectArticle, selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import { ArticleEntity } from 'pnlp/domain';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { BsQuestionCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

export function ArticleForm() {
  const { actions } = useAdminSlice();
  const article = useSelector(selectArticle);
  const publication = useSelector(selectPublication);
  const dispatch = useDispatch();

  const onChangeArticle = (value: Partial<ArticleEntity>) => {
    const updated_article = {
      ...article.entity,
      ...value,
    };
    dispatch(actions.setArticle(updated_article));
  };

  const onChangeArticleContent = (value?: string) => {
    dispatch(actions.setArticleContent(value));
  };

  const onTogglePreview = () => {
    const application_state = {
      ...article.application,
      preview: !article.application.preview,
    };
    dispatch(actions.setArticleApplicationState(application_state));
  };

  const onSubmitForm = (evt?: React.FormEvent<HTMLFormElement>) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    dispatch(actions.publishArticle());
  };

  return (
    <div>
      <Container className="p-0 mt-4">
        <Row>
          <Col md={10}>
            <div className="lead">New Article</div>
            <div className="text-muted small mb-3">direct to subscriber</div>
          </Col>
          <Col md={2} className="text-right">
            <a href="/docs" target="_blank">
              <BsQuestionCircle />
            </a>
            {/* TODO: add docs page */}
          </Col>
        </Row>
      </Container>
      <Form onSubmit={onSubmitForm}>
        <Form.Group controlId="exampleForm.ControlInput1">
          {/* <Form.Label className="text-muted small">Title</Form.Label> */}
          <Form.Control
            size="lg"
            type="input"
            value={article.entity.title}
            onChange={e =>
              onChangeArticle({
                title: e.currentTarget.value,
              })
            }
            placeholder="Title..."
          />
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlInput1">
          {/* <Form.Label className="text-muted small">Subtitle</Form.Label> */}
          <Form.Control
            type="input"
            placeholder="Subtitle..."
            value={article.entity.subtitle}
            onChange={e =>
              onChangeArticle({
                subtitle: e.currentTarget.value,
              })
            }
          />
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlInput1">
          {/* <Form.Label className="text-muted small">Subtitle</Form.Label> */}
          <InputGroup size="sm" className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>https://{publication?.entity?.slug}.on.pulp.network/</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              id="inlineFormInputGroup"
              value={article.entity.slug}
              onChange={e =>
                onChangeArticle({
                  slug: e.currentTarget.value,
                })
              }
              placeholder="URL..."
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">
          <MDEditor height={400} preview={'edit'} value={article.entity.content} onChange={(value?: string) => onChangeArticleContent(value)} />
        </Form.Group>

        <div className="text-right">
          <Button variant="outline-secondary" className="mr-3" onClick={onTogglePreview}>
            Preview
          </Button>
          <Button variant="primary" type="submit">
            Publish
          </Button>
        </div>
      </Form>
    </div>
  );
}
