import CriminalsContainerTable from './CriminalsContainerTable';
import DetectivesContainerTable from './DetectivesContainerTable';

const CrimeConteiner = ({crime}) => {

    const crimeData = () => {
        return (
        <div className='blocks'>
        <h3 className="center">Досье</h3>
        <table className="table center">
            <tbody>
                <tr><th><p>Заголовок</p></th><th><p>{crime.title}</p></th></tr>
                <tr><th><p>Автор</p></th><th><p>{crime.author}</p></th></tr>
                <tr><th><p>Описание</p></th><th><p>{crime.description}</p></th></tr>
                <tr><th><p>Дата создания</p></th><th><p>{crime.createDate}</p></th></tr>
                <tr><th><p>Дата начала</p></th><th><p>{crime.dateBegin}</p></th></tr>
                <tr><th><p>Дата конца</p></th><th><p>{crime.dateEnd}</p></th></tr>
                <tr><th><p>Закрыто ли</p></th><th><p>{crime.isSolved ? <p className='green'>Закрыто</p> : <p className='error'>Не закрыто</p>}</p></th></tr>
                <tr><th><p>Описание урона</p></th><th><p>{crime.damageDescription}</p></th></tr>
                <tr><th><p>Место</p></th><th><p>{crime.location}</p></th></tr>
            </tbody>
        </table>
        </div>);
    }
  
    
    return (
    <div className='box'>
        {crimeData()}
        <DetectivesContainerTable crime={crime}/>
        <CriminalsContainerTable crime={crime}/>
    </div>
    )
}

export default CrimeConteiner
