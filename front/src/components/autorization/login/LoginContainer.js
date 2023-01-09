import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import post from '../../../api/Post';
import { ReactSession } from 'react-client-session';


const LoginContainer = () => {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();

  let loginAction = (data) => {
    post("/auth", {"name": data.login, "password": data.password}).then(
    (json) => {
      if(json.status === 200){
        ReactSession.set("name", json.name);
        ReactSession.set("permission", json.permission);
        ReactSession.set("token", json.token);
        navigate('/main', {replace: true});
      }else if(json.status === 400){
        //todo: login or password is incorrect
      }
    }).catch((json) => {
      console.log("Fail to request token, maybe login or password are incorrect!");
      //todo: ????
    });
  }

  return <form className="form container" onSubmit={handleSubmit(loginAction)} >
    <h1>Войти</h1>
    <input placeholder='Логин' className='form-control'
    {...register("login", {required: true, pattern: /^[A-Za-z0-9]+$/i, })} />
    {errors?.login?.type === "pattern" && ( <p className='error'>Латинские буквы и цифры</p>)}
    {errors?.login?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <input type="password" placeholder='Пароль' className='form-control'
    {...register("password", { required: true, pattern: /^[A-Za-z0-9]+$/i, minLength: 8,})} />
    {errors?.password?.type === "pattern" && (<p className='error'>Латинские буквы и цифры</p>)}
    {errors?.password?.type === "minLength" && <p className='error'>Хотя бы 8 символов</p>}
    {errors?.password?.type === "required" && <p className='error'>Это поле обязательно</p>}
    
    <input type="submit" value='Вход' className='btn btn-block'/>
  </form>;
  
};

export default LoginContainer;