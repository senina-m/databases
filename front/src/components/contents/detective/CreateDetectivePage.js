import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import checkAuth from '../../../api/CheckAuth';


const CreateDetectivePage = () => {
    const navigate = useNavigate();

  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});

  return (
    <div>
      CreateDetectivePage
    </div>
  )
}

export default CreateDetectivePage
