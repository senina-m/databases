import React from 'react'

const CriminalContainer = ({criminal}) => {

    const getFormatedIsProved = (isProved)=>{
        if (isProved){
            // return <p>Доказано</p>;
            return <p className='green'>Доказано</p>
        }else {
            return <p className='error'>Не доказано</p>
        }
    }

    const Info = () => {
        console.log(criminal);
        return (
        <div className='blocks'>
        <h3 className="center">О преступнике</h3>
        <table className="table center">
            <tbody>
                {/* todo */}
                <tr><th><p>Доказана ли виновность</p></th><th><p>{getFormatedIsProved(criminal.isProved)}</p></th></tr>
                <tr><th><p>Имя</p></th><th><p>{criminal.name}</p></th></tr>
                <tr><th><p>День Рождения</p></th><th><p>{criminal.birthday}</p></th></tr>
                <tr><th><p>День Смерти</p></th><th><p>{criminal.deathDate}</p></th></tr>
                <tr><th><p>Раса</p></th><th><p>{criminal.race}</p></th></tr>
                <tr><th><p>Пол</p></th><th><p>{criminal.sex}</p></th></tr>
            </tbody>
        </table>
        </div>);
    }

  return (
    <div className='box'>
        {Info()}
    </div>
  )
}

export default CriminalContainer
