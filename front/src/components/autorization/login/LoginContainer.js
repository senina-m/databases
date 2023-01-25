import React, {useState} from 'react';
import { useForm } from "react-hook-form";
import { json, useNavigate } from 'react-router-dom';
import post from '../../../api/Post';
import { ReactSession } from 'react-client-session';


const LoginContainer = () => {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors,},
  } = useForm();

  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  let loginAction = (data) => {
    setError(false);
    post("/auth", {"name": data.login, "password": data.password}, '').then(
    (response) => {
      if(response.status === 200){
        ReactSession.set("name", response.name);
        ReactSession.set("permission", response.permission);
        ReactSession.set("token", response.token);
        ReactSession.set("creature_id", response.creatureId);
        navigate('/main', {replace: true});
      }else if(response.status === 400){
        setError(true);
        setErrorMessage(json.message);
      }else if(response.status === 404){
        setError(true);
        setErrorMessage(json.message);
      }
    }).catch((response) => {
      console.log("Fail to request token, maybe login or password are incorrect!");
      //todo: ????
    });
  }

  return <form className="form container" onSubmit={handleSubmit(loginAction)} >
    <h1>Войти</h1>
    <input placeholder='Логин' className='form-control'
    {...register("login", {required: true, })} />
     {/* pattern: /^[A-Za-z0-9]+$/i, */}
    {errors?.login?.type === "pattern" && ( <p className='error'>Русские буквы и цифры</p>)}
    {errors?.login?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <input type="password" placeholder='Пароль' className='form-control'
    // pattern: /^[A-Za-z0-9]+$/i, minLength: 8,
    {...register("password", { required: true, })} />
    {errors?.password?.type === "pattern" && (<p className='error'>Русские буквы и цифры</p>)}
    {errors?.password?.type === "minLength" && <p className='error'>Хотя бы 8 символов</p>}
    {errors?.password?.type === "required" && <p className='error'>Это поле обязательно</p>}
    {error && <p className='error'>Неправильный логин или пароль</p>}

    {error && <p className='error'>{errorMessage}</p>}
    
    <input type="submit" value='Вход' className='btn btn-block'/>
  </form>;
  
};

export default LoginContainer;