import React, {useEffect} from 'react'
import { ReactSession } from 'react-client-session';
import CountDamageToWorldHeart from './CountDamageToWorldHeart';
import CountSelaryContainer from './CountSelaryContainer';
import writer from '../../../writer.jpg';
import { useNavigate } from 'react-router-dom';
import checkAuth from '../../../api/CheckAuth';

const UserInfoPage = () => {
    const navigate = useNavigate();
    useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});


    const role = ReactSession.get("permission");
    return (
        <div>
            <div className='center'><p>Имя Пользователя: </p> <h3>{ReactSession.get("name")}</h3></div>
            <div className='center'><p>Доступ: </p> <h3>{role}</h3></div>
            {(role === "detective") && 
                            <div className='box'>
                                <CountDamageToWorldHeart/>
                                <CountSelaryContainer/>
                            </div>}
            {(role === "writer") && <img className='center'src={writer} alt="writer"/>}
        </div>
    )
}

export default UserInfoPage
