import React, {useState} from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
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
  const [incorrectLogin, setIncorrectLogin] = useState(false);

  let loginAction = (data) => {
    setIncorrectLogin(false);
    post("/auth", {"name": data.login, "password": data.password}, '').then(
    (response) => {
      if(response.status === 200){
        ReactSession.set("name", response.name);
        ReactSession.set("permission", response.permission);
        ReactSession.set("token", response.token);
        ReactSession.set("creature_id", response.creatureId);
        navigate('/main', {replace: true});
      }else if(response.status === 400){
        setIncorrectLogin(true);
      }
    }).catch((response) => {
      console.log("Fail to request token, maybe login or password are incorrect!");
      //todo: ????
    });
  }

  return <form className="form container" onSubmit={handleSubmit(loginAction)} >
    <h1>Войти</h1>
    <input placeholder='Логин' className='form-control'
    {...register("login", {required: true, pattern: /^[A-Za-z0-9]+$/i, })} />
    {errors?.login?.type === "pattern" && ( <p className='error'>Русские буквы и цифры</p>)}
    {errors?.login?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <input type="password" placeholder='Пароль' className='form-control'
    {...register("password", { required: true, pattern: /^[A-Za-z0-9]+$/i, minLength: 8,})} />
    {errors?.password?.type === "pattern" && (<p className='error'>Русские буквы и цифры</p>)}
    {errors?.password?.type === "minLength" && <p className='error'>Хотя бы 8 символов</p>}
    {errors?.password?.type === "required" && <p className='error'>Это поле обязательно</p>}
    {incorrectLogin && <p className='error'>Неправильный логин или пароль</p>}
    
    <input type="submit" value='Вход' className='btn btn-block'/>
  </form>;
  
};

export default LoginContainer;