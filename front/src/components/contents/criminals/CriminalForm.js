import React, {useState} from 'react';
import { useForm } from "react-hook-form";

const CriminalForm = ({criminal, onSubmit}) => {
    const {
        handleSubmit,
      } = useForm();

    const [isProved, setIsProved] = useState(false);

    const radio = () =>{
        return(
            <div className='form-control'>
            <label className='radio'>Доказано
                <input type="radio" name="isProved" className='radio' checked={isProved} onChange={() => {setIsProved(!isProved)}} />
            </label>
            <br/>
            <label className='radio'>Не доказано
                <input type="radio" name="isProved" className='radio' checked={!isProved} onChange={() => {setIsProved(!isProved)}} />
            </label>
            </div>
        );
    }

    const submit = () => {
        onSubmit(isProved);
    }

  return (
    <div>
        <form className="form container" onSubmit={handleSubmit(submit)} >
            <table className="table center">
                <tbody>
                    <tr><th><p>Имя</p></th><th><p>{criminal.name}</p></th></tr>
                    <tr><th><p>День Рождения</p></th><th><p>{criminal.birthday}</p></th></tr>
                    <tr><th><p>День Смерти</p></th><th><p>{criminal.deathDate}</p></th></tr>
                    <tr><th><p>Раса</p></th><th><p>{criminal.race}</p></th></tr>
                    <tr><th><p>Пол</p></th><th><p>{criminal.sex}</p></th></tr>
                    <tr><th><p>Доказана ли виновность</p></th><th><p>{radio()}</p></th></tr>
                </tbody>
            </table>
            <br/>
            <input type="submit" value='Отправить' className='btn btn-block center'/>
        </form>
    </div>
  )
}

export default CriminalForm
