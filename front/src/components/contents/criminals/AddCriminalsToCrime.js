import React, { useEffect, useState } from 'react';
import get from '../../../api/Get'
import post from '../../../api/Post'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../table/Table";
import { useLocation } from 'react-router-dom';
 

const AddCriminalsToCrime = () => {
    const navigate = useNavigate();
    // const role = ReactSession.get("permission");
    //todo: uncomment upper code
    // const role = "writer";
    // const role = "detective";

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [addingError, setAddingError] = useState(false);
  const [sucsess, setSucsess] = useState(false);
  const [sucsessName, setSucsessName] = useState("");
  const [addingErrorMessage, setAddingErrorMessage] = useState("");

  const {state} = useLocation();
  const {crime} = state;

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(false);
      let token = ReactSession.get("token");
      get("/crimes/" + crime.id + "/criminals", {}, token).then((json) => {
        if (json.status === 200) {
          delete json.status;
          let table_data = [];
          json.forEach((e, i) => {
              table_data[i] = {"id" : e.id,
                            "name": e.creature.name,
                            "isProved": e.isProved,
                            "birthday": e.creature.birthday,
                            "deathDate": e.creature.deathDate,
                            "race": e.creature.race,
                            "sex": e.creature.sex,
                            "creature_id": e.creature.id}
            });
          setData(table_data);
          console.log(table_data);
        }else if (json.status === 401){
          navigate("/relogin", { replace: true });
        }else if (json.status === 403) {
          navigate("/forbidden", { replace: true });
        }else if (json.status === 404) {
          navigate("*", { replace: true });
        }
      }).catch((e)=>{
        console.log("ERROR:", e);
        setError(true);
        //todo: what to do if we are anable to load data from server?
        //or wrong json came
      });
      setIsLoading(false);
    }
    getData()
  }, [navigate, crime]);

  const formatIsSolved = (cell) => {
    return cell ? 
    <div className='green'>да</div> : 
    <div className='error'>нет</div>;
  }

  const columns = () => {
      let columns = [
        {
          Header: 'Имя',
          accessor: 'name'
        },
        {
          Header: 'Доказано ли',
          accessor: 'isProved',
          Cell: props => formatIsSolved(props.value)
        },
        {
          Header: 'День Рождения',
          accessor: 'birthday'
        },
        {
          Header: 'День смерти',
          accessor: 'deathDate'
        },
        {
          Header: 'Раса',
          accessor: 'race'
        },
        {
          Header: 'Пол',
          accessor: 'sex'
        }
      ];
      return columns;
  };

  const onRowClick = (e, row) =>{
    setAddingError(false);
    setAddingErrorMessage("");
    setSucsess(false);
    console.log(row.original);
    let criminal = row.original;
    let token = ReactSession.get("token");
      post("/crimes/" + crime.id + "/criminals", {"creatureId": criminal.creature_id, "isProved":criminal.isProved}, token).then((json) => {
        if (json.status === 201) {
            delete json.status;
            setSucsess(true);
            setSucsessName(json.creature.name)
        }else if (json.status === 400){
            navigate("/forbidden", { replace: true });
        }else if (json.status === 401){
            navigate("/relogin", { replace: true });
        }else if (json.status === 403) {
          navigate("/forbidden", { replace: true });
        }else if (json.status === 404){
            navigate("*", { replace: true });
        }else if (json.status === 409){
            setAddingError(true);
            setAddingErrorMessage(json.message);
        }
      }).catch((e)=>{
        console.log("ERROR:", e);
        setAddingError(true);
        //todo: what to do if we are anable to load data from server?
        //or wrong json came
      });
  }

  const backToCrimeInfo = () => {
    navigate("/info/crime", {state: {crime: crime}});
  }
  
  return (
  <>
    {sucsess && <h2 className='center green'>Преступник {sucsessName} успешно добавлен в досье.</h2>}
    {addingError && <h2 className='center error'>{addingErrorMessage}</h2>}
    {isError ? <h3 className='center'>Не удалось получить данные с сервера...</h3> : 
      (isLoading ? <h3 className='center'>Загружаем таблицу с существами...</h3> : 
        <Table columns={columns()} data={data} onRowClick={onRowClick}/>)
    }
    <button className='btn center' onClick={backToCrimeInfo}>Назад к приступлению</button>
  </>);
}

export default AddCriminalsToCrime