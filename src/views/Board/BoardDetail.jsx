import React from 'react';
import Form from 'react-bootstrap/Form';

function BoardDetail() {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>제목</Form.Label>
        <Form.Control type="email" placeholder="제목을 입력하세요" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>내용</Form.Label>
        <Form.Control type="password" placeholder="내용을 입력하세요" />
      </Form.Group>
    </Form>
  );
}

export default BoardDetail;