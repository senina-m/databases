import React from 'react'
import page_not_found_img from '../not_found.jpg';

const PageNotFound = () => {
  return (
    <>
    <h1 style={{textAlign:'center'}}>Страница не найдена: 404</h1>
    <img src={page_not_found_img} alt="Page not found"/>
    </>
  )
}

export default PageNotFound
