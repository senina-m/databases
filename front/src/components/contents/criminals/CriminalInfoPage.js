import React, {useState} from 'react';
import del from '../../../api/Delete';
import {ReactSession} from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CriminalContainer from './CriminalContainer';

const CriminalsInfoPage = () => {
    // const role = ReactSession.get("permission");
    //todo: uncomment upper code
    const role = "writer";
    // const role = "detective";

    const {state} = useLocation();
    const {criminal} = state;
    const {crime} = state;

    const navigate = useNavigate();
    const [deleteStatus, setDeleteStatus] = useState(false);

    const deleteCriminal = () =>{
        setDeleteStatus(false);
        let token = ReactSession.get("token");
        del("/crimes/" + crime.id + "/criminals/" + criminal.id, {}, token).then((json) => {
          if (json.status === 200) {
            delete json.status;
            setDeleteStatus(true);
          }else if (json.status === 401){
            navigate("/relogin", { replace: true });
          }else if (json.status === 403) {
            navigate("/forbidden", { replace: true });
          }else if (json.status === 404) {
            navigate("*", { replace: true });
          }
        }).catch((e)=>{
          console.log("ERROR:", e);
          //todo: what to do if we are anable to load data from server?
          //or wrong json came
        });
    }

    const editCriminal = () => {
        navigate("/edit/criminal", {state: {criminal: criminal, crime: crime}});
    }

  return (
    <>
        {deleteStatus ? <h2 className='center green'> Преступник успешно удалён!" </h2> :
          <>
            <CriminalContainer criminal={criminal}/>
            {role === "writer" && (<>
              <button className='btn center' onClick={editCriminal}>Изменить</button>
              <br/>
              <button className='btn center' onClick={deleteCriminal}>Удалить</button>
            </>)}
          </>
        }
        <br/>
    </>
  )
}

export default CriminalsInfoPage
