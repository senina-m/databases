import React, { useEffect, useState } from 'react';
import get from '../../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../table/Table";
import checkAuth from '../../../api/CheckAuth';

const CrimesPage = () => {
  const navigate = useNavigate();

  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});


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
      get("/crimes", {}, token).then((json) => {
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


  // "id": 9223372036854776000,
  //   "author": "string",
  //   "createDate": "2023-01-15",
  //   "title": "string",
  //   "description": "string",
  //   "dateBegin": "2023-01-15",
  //   "dateEnd": "2023-01-15",
  //   "isSolved": true,
  //   "damageDescription": "string",
  //   "location": "string"

  const formatIsSolved = (cell) => {
    return cell ? 
    <p className='green'>да</p> : <p className='error'>нет</p>;
  }

  const columns = () => {
    let columns = [
      {
        Header: 'Заголовок',
        accessor: 'title'
      },
      {
        Header: 'Автор',
        accessor: 'author'
      },
      {
        Header: 'Описание',
        accessor: 'description'
      },
      {
        Header: 'Дата создания',
        accessor: 'createDate'
      },
      
      {
        Header: 'Дата начала',
        accessor: 'dateBegin'
      },
      {
        Header: 'Дата конца',
        accessor: 'dateEnd'
      },
      {
        Header: 'Закрыто ли',
        accessor: 'isSolved',
        Cell: props => formatIsSolved(props.value)
      },
      {
        Header: 'Описание урона',
        accessor: 'damageDescription',
      },
      {
        Header: 'Место',
        accessor: 'location',
      },
    ];
    return columns;
};

const onCreateCrimeClick = () =>{
  navigate("/create/crime", { replace: true});
}

const onRowClick = (e, row) =>{
  if(role === "writer"){
    console.log(row.original);
    navigate("/info/crime", {state: {crime: row.original}});
  }
}

return (<div className='block'>
  {isError ? <h3>Не удалось получить данные с сервера...</h3> : 
    (isLoading ? <h3>Загружаем таблицу с существами...</h3> : 
      (role === "writer" ?
      (<>
        <Table columns={columns()} data={data} onRowClick={onRowClick}/> 
        <br/>
        <button className='btn center' onClick={onCreateCrimeClick}>Создать новое досье</button> 
      </>) :
        <Table columns={columns()} data={data} onRowClick={onRowClick}/>
      )
    )
  }
  </div>);
}

export default CrimesPage
