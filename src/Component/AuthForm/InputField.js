import React from 'react';
import { Form } from 'react-bootstrap';

const InputField = ({ label, name, value, type, onChange }) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}:</Form.Label>
    <Form.Control
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete='off'
    />
  </Form.Group>
);

export default InputField;
