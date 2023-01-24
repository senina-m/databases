import React, { useEffect, useState } from 'react';
import get from '../../../api/Get'
import {ReactSession} from 'react-client-session'
import { useNavigate } from 'react-router-dom';
import Table from "../table/Table";

const CriminalsContainerTable = ({crime}) => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setError] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            setError(false);
            let token = ReactSession.get("token");
            get("/crimes/" + crime.id + "/criminals", {}, token).then((json) => {
            if (json.status === 200) {
                delete json.status;
                let table_data = []
                json.forEach((item, i) => {
                    table_data[i] = {"id":item.id, "name": (item.creature).name, "isProved": item.isProved};
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


    // "id": 4803247625584882000,
    // "isProved": true,
    // "creature": {
    //   "id": 6285732497533835000,
    //   "name": "Arms and the Man",
    //   "birthday": "2023-01-09",
    //   "race": "To Say Nothing of the Dog",
    //   "deathDate": "2022-10-21",
    //   "sex": "Мужчина"
    // }

    const formatIsSolved = (cell) => {
        return cell ? 
        <div className='green'>да</div> : 
        <div className='error'>нет</div>;
      }

    const columns = () => {
        let columns = [
          {
            Header: 'Имя',
            accessor: 'name'
          },
          {
            Header: 'Доказано ли',
            accessor: 'isProved',
            Cell: props => formatIsSolved(props.value)
          },
        ];          
        return columns;
    };

    const onRowClick = (e, row) =>{
          console.log(row.original);
          navigate("/info/criminal", { replace: true, state: {criminal: row.original}});
    }

    return (
        <div className='blocks'> 
            <h3 className="center">Преступники</h3>
            {isError ? <h3 className='error'>Не удалось получить данные с сервера...</h3> : 
                (isLoading ? <h3>Загружаем таблицу...</h3> :
                <>
                    {console.log(data)}
                    <Table data={data} columns={columns()} onRowClick={onRowClick}/>
                </>)}
        </div>
    );
}

export default CriminalsContainerTable
