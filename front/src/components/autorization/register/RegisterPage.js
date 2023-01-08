import React from 'react';
import { Link } from 'react-router-dom';
import RegisterContainer from './RegisterContainer'

const RegisterPage = ({serverPort}) => {
  return <>
  <RegisterContainer serverPort={serverPort}/>
  <Link className='navigation-link' to="/">Уже есть аккаунт?</Link>
  </>;
};

export default RegisterPage;