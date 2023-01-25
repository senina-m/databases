import React, {useState, useEffect} from 'react';
import del from '../../../api/Delete';
import get from '../../../api/Get';
import { Link } from 'react-router-dom';
import {ReactSession} from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import CreatureContainer from './CreatureContainer';
import { useLocation } from 'react-router-dom';


const CreatureInfoPage = () => {
    // const role = ReactSession.get("permission");
    //todo: uncomment upper code
    const role = "writer";
    // const role = "detective";

    const {state} = useLocation();
    const {creature} = state;

    const navigate = useNavigate();
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
    //по умолчанию считаем, что аккаунт есть, чтобы не создавать лишее
    const [hasAccount, setHasAccount] = useState(true);


    useEffect(() => {
        const checkIfHasAcount = async () => {
          let token = ReactSession.get("token");
          let id = creature.id;
          //todo: проверить здесь ручку
          get("/customers", {"creatureId":id}, token).then((json) => {
            if (json.status === 200) {
              delete json.status;
              if (!Array.isArray(json) || !json.length) {
                setHasAccount(false);
              }else{
                setHasAccount(true);
              }
            }else if (json.status === 401){
              navigate("/relogin", { replace: true });
            }else if (json.status === 403) {
              navigate("/forbidden", { replace: true });
            }
          }).catch((e)=>{
            console.log("ERROR:", e);
            //todo: what to do if we are anable to load data from server?
            //or wrong json came
          });
        }
        checkIfHasAcount()
      }, [navigate, creature]);

    const deleteCreature = () =>{
        setDeleteStatus(false);
        setDeleteError(false);
        setDeleteErrorMessage("");
        let token = ReactSession.get("token");
        del("/creatures", creature.id , token).then((json) => {
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

    const editCeature = () => {
        navigate("/edit/creature", {state: {creature: creature}});
    }
    

    const createAccount = () => {
        navigate("/register", {state: {id: creature.id}});
    }


  return (
    <>
        {deleteStatus ? <h2 className='center green'> Существо успешно удалено!" </h2> :
          <>
            {deleteError && <h2 className='center error'>{deleteErrorMessage}</h2>}
            <CreatureContainer creature={creature}/>
            {role === "writer" && (<>
              <button className='btn center' onClick={editCeature}>Изменить</button>
              <br/>
              <button className='btn center' onClick={deleteCreature}>Удалить</button>
              <br/>
              {!hasAccount && <button className='btn center' onClick={createAccount}>Создать аккаунт</button>}
            </>)}
          </>
        }
        <Link  className='center' to="/creatures" >Вернуться к таблице</Link>
    </>
  )
}

export default CreatureInfoPage
