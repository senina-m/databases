// import CreatureTable from './CreatureTable'
import React, { useEffect, useState } from 'react';
import get from '../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../contents/table/Table";
import { Link } from 'react-router-dom';
 

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
          console.log("here", json);
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

      if(role === "writer"){
        columns.push({
          disableFilters:true,
          accessor: 'action',
          Cell: props => <button className="btn" onClick={() => {
            console.log(props?.row?.original);
            let creature =  props?.row?.original
            navigate("/edit/creature", { replace: true, state: {creature: creature}});
          }}>Изменить</button>
        });
      }
      return columns;
  };

  const onCreateCreatureClick = () =>{
    navigate("/create", { replace: true, state: {crime: false}});
  }
  
  return (<>
    <Link to="/main" className='back-to-main-link'>Вернуться на главную</Link>
    {isError ? <h3>Не удалось получить данные с сервера...</h3> : 
      (isLoading ? <h3>Загружаем таблицу с существами...</h3> : 
        (role === "writer" ?
        (<>
          <Table columns={columns()} data={data}/> 
          <br/>
          <button className='btn center' onClick={onCreateCreatureClick}>Создать новое существо</button> 
        </>) :
          <Table columns={columns()} data={data}/>
        )
      )
    }
    </>);
    
}

export default CreaturesPage