import React from 'react';
import { Link } from 'react-router-dom';
import RegisterContainer from './RegisterContainer'

const RegisterPage = () => {
  return <div>
    <RegisterContainer/>
    <Link className='navigation-link' to="/">Уже есть аккаунт?</Link>
    <br/>
  </div>;
};

export default RegisterPage;