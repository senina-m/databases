// import CreatureTable from './CreatureTable'
import React, { useEffect, useState, useMemo } from 'react';
import get from '../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../contents/table/Table";
 

const CreaturesPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      console.log(2)
      setIsLoading(true);
      setError(false);
      let token = ReactSession.get("token");
      get("/creatures", {}, token).then((json) => {
        if (json.status === 200) {
          delete json.status;
          console.log("here", json);
          setData(json);
        } else if (json.status === 401 || json.status === 403) {
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

  const columns = useMemo(
    () => (
      [
        {
          Header: 'Имя',
          accessor: 'name'
        },
        {
          Header: 'День Рождения',
          accessor: 'birthday'
        },
        {
          Header: 'День смерти',
          accessor: 'death_date'
        },
        {
          Header: 'Раса',
          accessor: 'race'
        },
        {
          Header: 'Пол',
          accessor: 'sex'
        }
      ]
    ), [])
  
  return (<>
    {isError ? <h3>Не удалось получить данные с сервера...</h3> : 
    (isLoading ? <h3>Загружаем таблицу с существами...</h3> : <Table columns={columns} data={data} />)} </>);
}

export default CreaturesPage