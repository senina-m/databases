import React, { useEffect, useState } from 'react';
import get from '../../../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../../table/Table";

const DetectivesContainerTable = ({crime}) => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setError] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            setError(false);
            let token = ReactSession.get("token");
            get("/crimes/" + crime.id + "/detectives", {}, token).then((json) => {
            if (json.status === 200) {
                delete json.status;
                let table_data = []
                json.forEach((e, i) => {
                    table_data[i] = {"id":e.id,
                                    "name": (e.creature).name,
                                    "position":e.position,
                                    "birthday": e.creature.birthday,
                                    "deathDate": e.creature.deathDate,
                                    "race": e.creature.race,
                                    "sex": e.creature.sex,
                                    "creature_id": e.creature.id};
                });
                setData(table_data);
                // console.log(json);
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

    const columns = () => {
        let columns = [
          {
            Header: 'Имя',
            accessor: 'name'
          },
          {
            Header: 'Звание',
            accessor: 'position'
          },
        ];          
        return columns;
    };

    const onRowClick = (e, row) =>{
          console.log(row.original);
          navigate("/info/detective", {state: {detective: row.original}});
    }
    
    const addDetective = () => {
        navigate("/detectives/add", {state: {crime: crime}});
    }

    return (
        <div className='blocks'> 
            <h3 className="center">Детективы</h3>
            {isError ? <h3 className='error'>Не удалось получить данные с сервера...</h3> : 
                (isLoading ? <h3>Загружаем таблицу...</h3> :
                <>
                    {console.log(data)}
                    <Table data={data} columns={columns()} onRowClick={onRowClick}/>
                </>)}
            <button className='btn center' onClick={addDetective}>Добавить детектива</button>
        </div>
    );
}

export default DetectivesContainerTable
