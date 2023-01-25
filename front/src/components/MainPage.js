import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import checkAuth from '../api/CheckAuth';
import { useNavigate } from 'react-router-dom';
import { ReactSession } from 'react-client-session';


// Главная, откуда можно уйти либо на просмотр преступлений, либо на просмотр людей, либо на страницу можно будет создать человека или досье 
const MainPage = () => {
  const navigate = useNavigate();

  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});
  
  const role = ReactSession.get("permission");
  return (
    <div className='container'>
      <Link className='link-container-element' to="/creatures"> &#x2022; Список всех существ </Link>
      <Link className='link-container-element' to="/crimes"> &#x2022; Список всех преступлений </Link>
      <Link className='link-container-element' to="/detectives"> &#x2022; Список всех детективов </Link>
      <Link className='link-container-element' to="/info"> &#x2022; Личная информация </Link>
      { role === 'writer' &&
        <Link className='link-container-element' to="/create/crime"> &#x2022; Создать досье </Link>}
    </div>
  )
}

export default MainPage
