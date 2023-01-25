import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterContainer from './RegisterContainer';
import checkAuth from '../../../api/CheckAuth';

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});

  return <div>
    <RegisterContainer />
  </div>;
};

export default RegisterPage;