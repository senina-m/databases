
import React from 'react';
import { Link } from 'react-router-dom';
import LoginContainer from './LoginContainer';

const LoginPage = () => {
  return <>
  <LoginContainer/>
  <Link className='navigation-link' to="/register"> Ещё не регистрировались?</Link>
</>;
};

export default LoginPage;