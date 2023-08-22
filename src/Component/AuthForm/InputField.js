import React from 'react';
import { FormControl, InputLabel, Input, FormHelperText } from '@mui/material';

const InputField = ({ label, name, value, type, onChange }) => (
  <FormControl>
    <InputLabel htmlFor={name}>{label}:</InputLabel>
    <Input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete='off'
    />
    <FormHelperText>Helper text goes here</FormHelperText>
  </FormControl>
);

export default InputField;
