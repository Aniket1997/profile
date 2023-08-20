import React from 'react';

const InputField = ({ label, name, value, type, onChange }) => (
  <div>
    <label>{label}:</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete='false'
    />
  </div>
);

export default InputField;
