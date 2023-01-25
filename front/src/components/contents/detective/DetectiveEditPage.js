import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import checkAuth from '../../../api/CheckAuth';

const DetectiveEditPage = () => {
  const navigate = useNavigate()


  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});

  return (
    <div>
      
    </div>
  )
}

export default DetectiveEditPage
