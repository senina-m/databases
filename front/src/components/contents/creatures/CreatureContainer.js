// import React, {useState, useEffect} from 'react'
// import { useNavigate } from 'react-router-dom';
// import get from '../../../api/Get';
// import Table from "../table/Table";

// import {ReactSession} from 'react-client-session';

const CreatureContainer = ({creature}) => {
    // const navigate = useNavigate();

    // const [ordenLoading, setOrdenLoading] = useState(false);
    // const [ordenData, setOrdenData] = useState({});
    console.log(creature);

    const personalData = () => {
        return (
        <div className='blocks'>
        <h3 className="center">О существе</h3>
            <table className="table center">
            <tbody>
                <tr><th><p>Имя</p></th><th><p>{creature.name}</p></th></tr>
                <tr><th><p>День Рождения</p></th><th><p>{creature.birthday}</p></th></tr>
                <tr><th><p>День Смерти</p></th><th><p>{creature.death_date}</p></th></tr>
                <tr><th><p>Раса</p></th><th><p>{creature.race}</p></th></tr>
                <tr><th><p>Пол</p></th><th><p>{creature.sex}</p></th></tr>
            </tbody>
        </table>
        </div>);
    }

    // useEffect(() => {
    //     const getOrdenData = async () => {
    //     setOrdenLoading(true);
    //     let token = ReactSession.get("token");
    //     //todo: ждём получения ручки
    //     get("/ordens/", {}, token).then((json) => {
    //       if (json.status === 200) {
    //         delete json.status;
    //         console.log("here", json);
    //         setOrdenData(json);
    //       }else if (json.status === 401){
    //         navigate("/relogin", { replace: true });
    //       }else if (json.status === 403) {
    //         navigate("/forbidden", { replace: true });
    //       }
    //     }).catch((e)=>{
    //       console.log("ERROR:", e);
    //       //todo: what to do if we are anable to load data from server?
    //       //or wrong json came
    //     });
    //     setOrdenLoading(false);
    //   }
    //   getOrdenData();
    // }, [navigate]);

    // const ordenColumns = () => {
    //     let columns = [
    //        {
    //         Header: 'Имя',
    //         accessor: 'name'
    //         },
    //         {
    //             Header: 'Описание',
    //             accessor: 'description'
    //         }
    //     ];
    //     return columns;
    // };

    // const nope = () => {}

    //todo: в идеале показывать ещё в каком человек ордене
    // const ordenInfo = () =>{
    //     return(
    //         <div className='blocks'>
    //             <h3>Состоит в орденах:</h3>
    //             {/* {!ordenLoading && <Table data={ordenData} columns={ordenColumns()} onRowClick={nope()}/>} */}
    //             {/* {ordenLoading && <h4>Ордена существа загружаются...</h4>} */}
    //         </div>
    //     );
    // }
  

  return (
    <>
        {personalData()}
        {/* {ordenInfo()} */}
    </>
  )
}

export default CreatureContainer
