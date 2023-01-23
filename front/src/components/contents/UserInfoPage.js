import React from 'react'
import { ReactSession } from 'react-client-session';
import CountDamageToWorldHeart from './CountDamageToWorldHeart';
import CountSelaryContainer from '../../CountSelaryContainer';

const UserInfoPage = () => {
    // const role = ReactSession.get("permission");
    const role = "detective";
    return (
        <div>
            <div className='center'><p>Имя Пользователя: </p> <h3>{ReactSession.get("name")}</h3></div>
            <div className='center'><p>Доступ: </p> <h3>{role}</h3></div>
            <div className='box'>
                {(role === "writer" || role === "detective") && <CountDamageToWorldHeart/>}
                {role === "detective" && <CountSelaryContainer/>}
            </div>
        </div>
    )
}

export default UserInfoPage
