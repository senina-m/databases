import React, {useState, useEffect} from 'react';
import del from '../../../../api/Delete';
import { Link } from 'react-router-dom';
import {ReactSession} from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CrimeConteiner from './CrimeConteiner';
import checkAuth from '../../../../api/CheckAuth';

const CrimeInfoPage = () => {
  const role = ReactSession.get("permission");

  const {state} = useLocation();
  const {crime} = state;

  const navigate = useNavigate();
  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});

  const [deleteStatus, setDeleteStatus] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  const deleteCrime = () =>{
    setDeleteStatus(false);
    setDeleteError(false);
    setDeleteErrorMessage("");
    let token = ReactSession.get("token");
    del("/crimes", crime.id , token).then((json) => {
      if (json.status === 200) {
        delete json.status;
        setDeleteStatus(true);
      }else if (json.status === 400){
        setDeleteStatus(false);
        setDeleteError(true);
        setDeleteErrorMessage(json.message);
      }else if (json.status === 401){
        navigate("/relogin", { replace: true });
      }else if (json.status === 403) {
        navigate("/forbidden", { replace: true });
      }else if (json.status === 404) {
        navigate("*", { replace: true });
      }
    }).catch((e)=>{
      console.log("ERROR:", e);
      setDeleteError(true);
      //todo: what to do if we are anable to load data from server?
      //or wrong json came
    });
}

const editCrime = () => {
  navigate("/edit/crime", {state: {crime: crime}});
}

return (
  <>
      {deleteStatus ? <h2 className='center green'>Досье успешно удалено!</h2>:
        <>
          {deleteError && <h2 className='center error'>{deleteErrorMessage}</h2>}
          <CrimeConteiner crime={crime}/>
          <br/>
          <br/>
          {role === "writer" && (<>
            <button className='btn long center' onClick={editCrime}>Изменить</button>
            <br/>
            <button className='btn long center' onClick={deleteCrime}>Удалить</button>
          </>)}
        </>
      }
      <br/>
      <Link  className='center' to="/crimes" >Вернуться к таблице</Link>
  </>
)
}

export default CrimeInfoPage
