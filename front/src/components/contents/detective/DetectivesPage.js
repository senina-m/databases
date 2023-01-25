import React, { useEffect, useState } from 'react';
import get from '../../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../table/Table";
import checkAuth from '../../../api/CheckAuth';
 

const DetectivesPage = () => {
  const navigate = useNavigate();

  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});

  const role = ReactSession.get("permission");

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);


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
        },
      ];

      return columns;
  };

  const onCreateDetectiveClick = () =>{
    navigate("/create/detective", { replace: true});
  }

  const onRowClick = (e, row) =>{
    console.log(row.original);
    navigate("/info/detective", {state: {detective: row.original}});
  }
  
  return (<>
    {isError ? <h3 className='center'>Не удалось получить данные с сервера...</h3> : 
      (isLoading ? <h3 className='center'>Загружаем таблицу с существами...</h3> : 
        (role === "writer" ?
        (<>
          <Table columns={columns()} data={data} onRowClick={onRowClick}/> 
          <br/>
          <button className='btn center' onClick={onCreateDetectiveClick}>Добавить нового детектива</button> 
        </>) :
          <Table columns={columns()} data={data} onRowClick={onRowClick}/>
        )
      )
    }
  </>);
}

export default DetectivesPage