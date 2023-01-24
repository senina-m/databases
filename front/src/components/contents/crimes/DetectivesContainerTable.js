import React, { useEffect, useState } from 'react';
import get from '../../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../table/Table";

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
                json.forEach((item, i) => {
                    table_data[i] = {"id":item.id, "name": (item.creature).name, "position":item.position};
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
          navigate("/info/detective", { replace: true, state: {detective: row.original}});
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
        </div>
    );
}

export default DetectivesContainerTable
