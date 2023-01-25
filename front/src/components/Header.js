import React from 'react'
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const navigate = useNavigate();
  const navigateToMain = () => {
    navigate("/main", { replace: true});
  }

  return (
    <div className="header">
      <button className='btn right' onClick={navigateToMain}>На главную</button>
      <h1>Архив Тайного Сыскного Войска</h1>
    </div>
  )
}

export default Header
