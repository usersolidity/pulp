import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import styled from 'styled-components/macro';

export function Subscribe() {
  return (
    <FormWrapper>
      <Form>
        <Form.Group>
          {/* <Form.Label>Email address</Form.Label> */}
          {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
          <InputGroup>
            <Form.Control type="email" placeholder="Email Address" />
            <InputGroup.Append>
              <Button variant="primary" type="submit">
                Subscribe
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    </FormWrapper>
  );
}

const FormWrapper = styled.div`
  width: 500px;
`;
