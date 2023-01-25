import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import CriminalForm from './CriminalForm';
import put from '../../../api/Put';
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const CriminalEditPage = () => {
  const navigate = useNavigate();
  const {state} = useLocation();
  const {criminal} = state;
  const {crime} = state;

  const [noSuch, setNoSuch] = useState(false);
  const [nothingUpdate, setNothingUpdate] = useState(false);
  const [someError, setSomeError] = useState(false);
  const [error, setError] = useState("");
  const [sucsess, setSucsess] = useState(false);
  const [showForm, setShowForm] = useState(true);


  const updateCriminal = (isProved) =>{
    setSucsess(false);
    setSomeError(false);

    let token = ReactSession.get("token");
    //todo: check that func works properly
      put("/crimes/"+ crime.id + "/criminals/" + criminal.id, {"isProved" : isProved}, token).then((json) => {
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
    console.log(criminal);
    let creature = {
      "id": criminal.creature_id,
      "name": criminal.name, 
      "isProved": criminal.isProved,
      "birthday": criminal.birthday,
      "deathDate": criminal.deathDate,
      "race": criminal.race,
      "sex": criminal.sex};
      console.log(creature);
    navigate("/edit/creature", {state: {creature: creature}});
  }

  const showFormOnClick = () => {
    setShowForm(true);
  }

  return (
    <div>
      {sucsess && <h2 className='center'>Преступник успешно обновлён!</h2>}
      <br/>
      {someError && <h2 className='center'>{error}</h2>}
      {noSuch && <>
                  <h2 className='center'>Преступника, которого вы хотели обновиить ещё не существует. Создайте его!</h2>
                </>}
      {nothingUpdate && <>
                  <h2 className='center'>Вы не внесли ничего нового, преступник остался каким был.. !</h2>
                  <br/>
                  <button className='btn center' onClick={showFormOnClick}>Внести изменения</button>
                </>}
      {showForm && <CriminalForm criminal={criminal} onSubmit={updateCriminal}/>}
      <button className='btn center' onClick={editCreature}>Редактировать существо преступника</button>
      <br/>
      <Link  className='center' to="/creatures" >Вернуться к таблице</Link>
    </div>
  )
}

export default CriminalEditPage
