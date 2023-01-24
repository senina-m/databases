import React, { useEffect, useState } from 'react';
import get from '../../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../table/Table";
 

const CreaturesPage = () => {
  const navigate = useNavigate();
  // const role = ReactSession.get("permission");
  //todo: uncomment upper code
  const role = "writer";
  // const role = "detective";


  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);


  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(false);
      let token = ReactSession.get("token");
      get("/creatures", {}, token).then((json) => {
        if (json.status === 200) {
          delete json.status;
          setData(json);
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
        },
      ];

      return columns;
  };

  const onCreateCreatureClick = () =>{
    navigate("/create/creature", { replace: true});
  }

  const onRowClick = (e, row) =>{
    if(role === "writer"){
      console.log(row.original);
      navigate("/info/creature", { replace: true, state: {creature: row.original}});
    }
  }
  
  return (<>
    {isError ? <h3 className='center'>Не удалось получить данные с сервера...</h3> : 
      (isLoading ? <h3 className='center'>Загружаем таблицу с существами...</h3> : 
        (role === "writer" ?
        (<>
          <Table columns={columns()} data={data} onRowClick={onRowClick}/> 
          <br/>
          <button className='btn center' onClick={onCreateCreatureClick}>Создать новое существо</button> 
        </>) :
          <Table columns={columns()} data={data} onRowClick={onRowClick}/>
        )
      )
    }
  </>);
}

export default CreaturesPage