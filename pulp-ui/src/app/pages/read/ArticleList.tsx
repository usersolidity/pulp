import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router-dom';
import { selectFounderFriendlyName, selectIdentity, selectPublication } from 'store/app-state';
import styled from 'styled-components/macro';

export function ArticleList() {
  const publication = useSelector(selectPublication);
  const identity = useSelector(selectIdentity);
  const history = useHistory();
  const founder_friendly_name = useSelector(selectFounderFriendlyName);

  const onSelect = (publication_slug: string, article_slug: string) => {
    history.push(`/read/${publication_slug}/on/${article_slug}`);
  };

  return (
    <>
      <Container className="mt-5">
        {!!publication?.loading && !publication?.entity?.articles?.length && (
          <>
            <Row className="text-center mb-5">
              <Col className="text-muted lead">Searching Distributed Space...</Col>
            </Row>
            <Row className="text-center mb-2">
              <Col>
                <Spinner animation="grow" variant="secondary" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </Col>
            </Row>
          </>
        )}
        {!publication?.loading && !publication?.entity?.articles?.length && identity?.state?.ethereum_address === publication?.entity?.founder && (
          <>
            <Row className="text-center">
              <Col className="text-muted lead">{publication.entity.properties.title}</Col>
            </Row>
            <Row className="text-center mb-2">
              <Col className="text-muted">by: {founder_friendly_name}</Col>
            </Row>
            <Row className="text-center mb-5">
              <Col className="text-muted small">Your shiny new publication needs some content!</Col>
            </Row>
            <Row className="text-center">
              <Col className="text-muted lead">
                <LinkContainer className="mb-5" to={`/admin/${publication.entity.slug}/write`}>
                  <Button size="lg" variant="outline-primary">
                    Write an Article
                  </Button>
                </LinkContainer>{' '}
              </Col>
            </Row>
          </>
        )}
        {!publication?.loading && !publication?.entity?.articles?.length && identity?.state?.ethereum_address !== publication?.entity?.founder && (
          <>
            <Row className="text-center">
              <Col className="text-muted lead">{publication.entity.properties.title}</Col>
            </Row>
            <Row className="text-center mb-2">
              <Col className="text-muted">by: {founder_friendly_name}</Col>
            </Row>
            <Row className="text-center mb-5">
              <Col className="text-muted small">It looks like this author hasn't published any articles yet...</Col>
            </Row>
          </>
        )}
        {!publication?.loading && publication?.entity?.articles?.length && (
          <>
            <Row className="text-left">
              <Col className="text-muted small">/pnlp/read/{publication.entity.slug}</Col>
            </Row>
            <Row className="text-left">
              <Col className="text-muted small">{publication.entity.properties.tagline}</Col>
            </Row>
            <Row className="text-left">
              <Col className="text-muted small">by: {founder_friendly_name}</Col>
            </Row>
            <Row className="text-left mb-5">
              <List>
                {Object.entries(publication.entity.articles).map(([s, a], i) => (
                  <Feature onClick={() => onSelect(publication.entity.slug, s)} key={i}>
                    {/* <CSSIcon className="feature-icon" /> */}
                    <Content>
                      <div className="lead">{a.title}</div>
                      <div className="lead text-muted">{a.subtitle}</div>
                      <div className="text-muted small">By: {a.author}</div>
                    </Content>
                  </Feature>
                ))}
              </List>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}

const Feature = styled.li`
  display: flex;
  margin: 6.25rem 0 6.25rem 2.25rem;

  .feature-icon {
    width: 6.25rem;
    height: 6.25rem;
    margin-right: 2.25rem;
    flex-shrink: 0;
  }

  &:hover {
    text-decoration: none;
    color: ${p => p.theme.primary};
    opacity: 0.8;
    cursor: pointer;
  }

  &:active {
    opacity: 0.4;
  }
`;
const Content = styled.div`
  flex: 1;
`;

const List = styled.ul`
  padding: 0;
  margin: 6.25rem 0 0 0;
`;
