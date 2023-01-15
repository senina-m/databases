import React from 'react'
import { Link } from 'react-router-dom'
import relogin from '../relogin.jpg';

const Relogin = () => {
  return (
    <>
      <h3 className='center'> Ваш JWT токен истёк. Войдите, пожалуйста, в систему ещё раз</h3>
      <br/>
      <br/>
      <Link className='navigation-link center' to={"/login"}>Войти в систему</Link>
      <img className='img-relogin center'src={relogin} alt="Relogin"/>
    </>
  )
}

export default Relogin
