import React from 'react';
import AuthForm from '../AuthForm/AuthForm';

const loginFieldConfigs = [
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Password', name: 'password', type: 'password'},
];

const Login = () => {
  const handleLogin = (formData) => {
    console.log('Signup form submitted:', formData);
  };

  return (
    <div>
      <h2>Login</h2>
      <AuthForm
        onSubmit={handleLogin}
        buttonText="Sign Up"
        fieldConfigs={loginFieldConfigs}
      />
    </div>
  );
};

export default Login;
