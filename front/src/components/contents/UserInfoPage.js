import React from 'react'
import { ReactSession } from 'react-client-session';
import CountDamageToWorldHeart from './CountDamageToWorldHeart';

const UserInfoPage = () => {
    const role = ReactSession.get("permission");
    return (
        <div>
            <div className='center'><p>Имя Пользователя: </p> <h3>{ReactSession.get("name")}</h3></div>
            <div className='center'><p>Доступ: </p> <h3>{role}</h3></div>
            {/* {(role === "writer" || role === "detective") && <CountDamageToWorldHeart/>} */}
            <CountDamageToWorldHeart/>
        </div>
    )
}

export default UserInfoPage
