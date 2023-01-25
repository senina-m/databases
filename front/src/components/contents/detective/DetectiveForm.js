import React from 'react';
import { useForm } from "react-hook-form";

const DetectiveForm = ({detective, onSubmit}) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
      } = useForm();

    const getPosition = () =>{
        return(
            <>
                <input placeholder='должность' className='form-control'
                {...register("position", {required: true, pattern: /^[А-Яа-я ]+$/i, })} />
                {errors?.position?.type === "pattern" && ( <p className='error'>Русские буквы</p>)}
                {errors?.position?.type === "required" && <p className='error'>Это поле обязательно</p>}
            </>
        );
    }

  return (
    <div>
        <form className="form container" onSubmit={handleSubmit(onSubmit)} >
            <table className="table center">
                <tbody>
                    <tr><th><p>Имя</p></th><th><p>{detective.name}</p></th></tr>
                    <tr><th><p>День Рождения</p></th><th><p>{detective.birthday}</p></th></tr>
                    <tr><th><p>День Смерти</p></th><th><p>{detective.deathDate}</p></th></tr>
                    <tr><th><p>Раса</p></th><th><p>{detective.race}</p></th></tr>
                    <tr><th><p>Пол</p></th><th><p>{detective.sex}</p></th></tr>
                    <tr><th><p>Должность</p></th><th><p>{getPosition()}</p></th></tr>
                </tbody>
            </table>
            <br/>
            <input type="submit" value='Отправить' className='btn btn-block center'/>
        </form>
    </div>
  )
}

export default DetectiveForm
