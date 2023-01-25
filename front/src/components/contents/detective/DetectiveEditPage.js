import React, {useState, useEffect} from 'react';
import DetectiveForm from './DetectiveForm';
import put from '../../../api/Put';
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import checkAuth from '../../../api/CheckAuth';
import { useLocation } from 'react-router-dom';


const DetectiveEditPage = () => {
  const navigate = useNavigate();

  
  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});
  
  const {state} = useLocation();
  const {detective} = state;

  const [noSuch, setNoSuch] = useState(false);
  const [nothingUpdate, setNothingUpdate] = useState(false);
  const [someError, setSomeError] = useState(false);
  const [error, setError] = useState("");
  const [sucsess, setSucsess] = useState(false);
  const [showForm, setShowForm] = useState(true);


  const update = (data) =>{
    setSucsess(false);
    setSomeError(false);

    let token = ReactSession.get("token");
    //todo: check that func works properly
      put("/detectives/" + detective.id, {"position": data.position}, token).then((json) => {
        if (json.status === 200) {
          setSucsess(true);
          setShowForm(true);
        }else if (json.status === 400){
          setSomeError(true);
          setError(json.message);
        }else if (json.status === 401){
          navigate("/relogin", { replace: true });
        }else if (json.status === 403) {
          navigate("/forbidden", { replace: true });
        }else if (json.status === 404) {
          setNoSuch(true);
          setShowForm(false);
        }else if (json.status === 409) {
          setNothingUpdate(true);
          setShowForm(false);
        }
      }).catch((e)=>{
        console.log("ERROR:", e);
        //todo: what to do if we are anable to load data from server?
        //or wrong json came
      });
  }

  const editCreature = () =>{
    console.log(detective);
    let creature = {
      "id": detective.creature_id,
      "name": detective.name, 
      "isProved": detective.isProved,
      "birthday": detective.birthday,
      "deathDate": detective.deathDate,
      "race": detective.race,
      "sex": detective.sex};
      console.log(creature);
    navigate("/edit/creature", {state: {creature: creature}});
  }

  const showFormOnClick = () => {
    setShowForm(true);
  }

  return (
    <div>
      {sucsess && <h2 className='center'>Детектив успешно обновлён!</h2>}
      <br/>
      {someError && <h2 className='center errorr'>{error}</h2>}
      {noSuch && <>
                  <h2 className='center error'>Детектива, которого вы хотели обновиить ещё не существует. Создайте его!</h2>
                </>}
      {nothingUpdate && <>
                  <h2 className='center error'>Вы не внесли ничего нового, детектив остался каким был.. !</h2>
                  <br/>
                  <button className='btn center' onClick={showFormOnClick}>Внести изменения</button>
                </>}
      {showForm && <DetectiveForm detective={detective} onSubmit={update}/>}
      <br/>
      <button className='btn center' onClick={editCreature}>Редактировать существо детектива</button>
      <br/>
      <Link  className='center' to="/detectives" >Вернуться к таблице</Link>
    </div>
  )
}

export default DetectiveEditPage
