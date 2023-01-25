import React, { useEffect, useState } from 'react';
import get from '../../../api/Get'
import post from '../../../api/Post'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../table/Table";
import { useLocation } from 'react-router-dom';
import CriminalForm from './CriminalForm';
 

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
  const [showTable, setShowTable] = useState(true);
  const [showCriminal, setShowCriminal] = useState(false);
  const [criminal, setCriminal] = useState({});

  const {state} = useLocation();
  const {crime} = state;

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

  // const formatIsSolved = (cell) => {
  //   return cell ? 
  //   <div className='green'>да</div> : 
  //   <div className='error'>нет</div>;
  // }

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
    setShowTable(false);
    setShowCriminal(true);
    setCriminal(row.original);
  }

  const sendRequestToAddCriminal = (isProved) => {
    setAddingError(false);
    setAddingErrorMessage("");
    setSucsess(false);
    let token = ReactSession.get("token");
      post("/crimes/" + crime.id + "/criminals", {"creatureId": criminal.id, "isProved": isProved}, token).then((json) => {
        if (json.status === 201) {
            delete json.status;
            setSucsess(true);
            setSucsessName(json.creature.name);
            setShowCriminal(false);
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

  const addMore = () => {
    setShowTable(true);
    setSucsess(false);
    setAddingError(false)
    setAddingErrorMessage("");
  }
  
  return (
  <>
    {sucsess && 
    <>
      <h2 className='center green'>Преступник {sucsessName} успешно добавлен в досье.</h2>
      <br/>
      <button className='btn center' onClick={addMore}>Добавить ещё</button>
    </>}

    {addingError && <h2 className='center error'>{addingErrorMessage}</h2>}
    {showTable && (isError ? <h3 className='center'>Не удалось получить данные с сервера...</h3> : 
                    (isLoading ? <h3 className='center'>Загружаем таблицу с существами...</h3> : 
                      <Table columns={columns()} data={data} onRowClick={onRowClick}/>))
    }
    {showCriminal && <CriminalForm criminal={criminal} onSubmit={sendRequestToAddCriminal}/>}
    <br/>
    <button className='btn center' onClick={backToCrimeInfo}>Назад к приступлению</button>
  </>);
}

export default AddCriminalsToCrime