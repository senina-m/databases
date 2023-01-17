import React from 'react'
import forbidden from '../forbidden.jpg';


const Forbidden = () => {
  return (
    <div>
      <br/>
        <h2 className='center'>Доступ к этой странице запрещён 403</h2>
      <br/>
      <br/>
        <img className='img-relogin center'src={forbidden} alt="Forbidden"/>
    </div>
  )
}

export default Forbidden
