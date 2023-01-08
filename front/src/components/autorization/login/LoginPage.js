
import React from 'react';
import { Link } from 'react-router-dom';
import LoginContainer from './LoginContainer';

const LoginPage = ({serverPort}) => {
  return <>
  <LoginContainer serverPort={serverPort}/>
  <Link className='navigation-link' to="/register"> Ещё не регистрировались?</Link>
</>;
};

export default LoginPage;