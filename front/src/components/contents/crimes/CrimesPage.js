import React, { useEffect, useState } from 'react';
import get from '../../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../table/Table";
import { Link } from 'react-router-dom';

const CrimesPage = () => {

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
      get("/crimes", {}, token).then((json) => {
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
    return cell ? "да" : "нет"
    ;
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
        Header: 'Дата начала',
        accessor: 'dateEnd'
      },
      {
        Header: 'Закрыто ли',
        accessor: 'isSolved',
        Cell: props => <div> {formatIsSolved(props.value)} </div>
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

    if(role === "writer"){
      columns.push({
        disableFilters:true,
        accessor: 'action',
        Cell: props => <button className="btn" onClick={() => {
          console.log(props?.row?.original);
          let crime =  props?.row?.original
          navigate("/edit/crime", { replace: true, state: {crime: crime}});
        }}>Изменить</button>
      });
    }
    return columns;
};

const onCreateCrimeClick = () =>{
  navigate("/create", { replace: true, state: {crime: true}});
}

return (<div className='block'>
  <Link to="/main" className='back-to-main-link'>Вернуться на главную</Link>
  {isError ? <h3>Не удалось получить данные с сервера...</h3> : 
    (isLoading ? <h3>Загружаем таблицу с существами...</h3> : 
      (role === "writer" ?
      (<>
        <Table columns={columns()} data={data}/> 
        <br/>
        <button className='btn center' onClick={onCreateCrimeClick}>Создать новое досье</button> 
      </>) :
        <Table columns={columns()} data={data}/>
      )
    )
  }
  </div>);
}

export default CrimesPage
