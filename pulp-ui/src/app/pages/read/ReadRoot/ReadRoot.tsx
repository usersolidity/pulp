import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import * as React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";

export function ReadRoot() {
  const { t } = useTranslation();
  let { url } = useRouteMatch();
  let { p_slug } = useParams<{ p_slug?: string }>();

  let article_id = 1;

  return (
    <>
      <Helmet>
        <title>Read {p_slug}</title>
        <meta
          name="description"
          content="Read {p_slug}"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Container>
          <Row className="my-5">
            <Col xs={12} md={6}>
              Read {p_slug}
              <div>
                Article List...
              </div>
              <div>
                About Section...
              </div>
              <Switch>
                <Route path={`${url}/${article_id}`}>
                  <div>
                    Article {article_id}
                  </div>
                </Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </PageWrapper>
    </>
  );
}
