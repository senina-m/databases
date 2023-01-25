import React, { useEffect, useState } from 'react';
import get from '../../../api/Get'
import post from '../../../api/Post'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../table/Table";
import { useLocation } from 'react-router-dom';
import checkAuth from '../../../api/CheckAuth';
import checkWriter from '../../../api/CheckRole';
 

const AddDetectiveToCrime = () => {
  const navigate = useNavigate();
  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});
  useEffect( () => {if(checkWriter()) navigate("/forbidden", { replace: true });});


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
      get("/detectives", {}, token).then((json) => {
        if (json.status === 200) {
          delete json.status;
          let table_data = [];
          json.forEach((e, i) => {
              table_data[i] = {"id" : e.id,
              "name": e.creature.name,
              "position": e.position,
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
  }, [navigate]);

  const columns = () => {
      let columns = [
        {
            Header: 'Табельный номер',
            accessor: 'id'
        },
        {
          Header: 'Имя',
          accessor: 'name'
        },
        {
            Header: 'Должность',
            accessor: 'position'
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
    let detective = row.original;
    let token = ReactSession.get("token");
      post("/crimes/" + crime.id + "/detectives", {"detectiveId": detective.id}, token).then((json) => {
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
    {sucsess && <h2 className='center green'>Детектив {sucsessName} успешно добавлен в досье.</h2>}
    {addingError && <h2 className='center error'>{addingErrorMessage}</h2>}
    {isError ? <h3 className='center'>Не удалось получить данные с сервера...</h3> : 
      (isLoading ? <h3 className='center'>Загружаем таблицу с существами...</h3> : 
        <Table columns={columns()} data={data} onRowClick={onRowClick}/>)
    }
    <button className='btn center' onClick={backToCrimeInfo}>Назад к приступлению</button>
  </>);
}

export default AddDetectiveToCrime