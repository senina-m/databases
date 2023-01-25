import React from 'react'

const DetectiveContainer = ({detective}) => {

    const detectiveInfo = () => {
        return (
        <div className='blocks'>
        <h3 className="center">О детективе</h3>
            <table className="table center">
            <tbody>
                <tr><th><p>Табельный номер</p></th><th><p>{detective.id}</p></th></tr>
                <tr><th><p>Должность</p></th><th><p>{detective.position}</p></th></tr>
                <tr><th><p>Имя</p></th><th><p>{detective.name}</p></th></tr>
                <tr><th><p>День Рождения</p></th><th><p>{detective.birthday}</p></th></tr>
                <tr><th><p>День Смерти</p></th><th><p>{detective.deathDate}</p></th></tr>
                <tr><th><p>Раса</p></th><th><p>{detective.race}</p></th></tr>
                <tr><th><p>Пол</p></th><th><p>{detective.sex}</p></th></tr>
            </tbody>
        </table>
        </div>);
    }

  return (
    <div className='box'>
        {detectiveInfo()}
    </div>
  )
}

export default DetectiveContainer
