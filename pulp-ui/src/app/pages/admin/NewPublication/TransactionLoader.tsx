import { selectPublication } from 'app/pages/admin/admin-redux';
import * as React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export function TransactionLoader() {
  const { t } = useTranslation();

  const publication = useSelector(selectPublication);

  return (
    <Container className="p-0 mt-4">
      <Row>
        <Col md={10}>
          <div className="lead">
            Awaiting Transaction...
          </div>
        </Col>
      </Row>
    </Container>
  );
}
