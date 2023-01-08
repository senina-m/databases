import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';



const LoginContainer = ({serverPort}) => {

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors }
  } = useForm();


  const navigate = useNavigate();

  let loginAction = (data) => {
  sendLoginRequest(serverPort, data.login, data.password).then(() => {
    navigate('/main', {replace: true});
  }).catch(() => {
    console.log("Fail to request token, maybe login or password are incorrect!");
    //todo: login or password is incorrect
  });

  }


  // onSubmit={handleSubmit(loginAction)}
  return <form className="form container" >
    <h1>Войти</h1>
    <input placeholder='Логин' className='form-control'
    {...register("login", {required: true, pattern: /^[A-Za-z0-9]+$/i, })} />
    {errors?.login?.type === "pattern" && ( <p className='error'>Latin leters and numbers</p>)}
    {errors?.login?.type === "required" && <p className='error'>This field is required</p>}

    <input type="password" placeholder='Пароль' className='form-control'
    {...register("password", { required: true, pattern: /^[A-Za-z0-9]+$/i, minLength: 8,})} />
    {errors?.password?.type === "pattern" && (<p className='error'>Latin leters and numbers</p>)}
    {errors?.password?.type === "minLength" && <p className='error'>At least 8 chars</p>}
    {errors?.password?.type === "required" && <p className='error'>This field is required</p>}
    
    <input type="submit" value='Submit' className='btn btn-block'/>
  </form>;
  
};

export default LoginContainer;

let sendLoginRequest = async (port, login, password) => {
  let url = "http://localhost:"+ port +"/auth/login?" + new URLSearchParams({"login":login, "password":password});
  console.log("Sending GET request to url: " + url);
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
  });

  let json = await response.json();
  console.log(json);
  return json.token;
}