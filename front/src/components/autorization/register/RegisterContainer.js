import React, {useRef} from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

const RegistrContainer = ({serverPort}) => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
      } = useForm();

    const password = useRef({});
    password.current = watch("password", "");
  
    const onSubmit = (data) => {
  
      console.log("Attempt entered by user:");
      console.log(data);
  
      tryToSendAddAttemptRequest(serverPort, {login:data.login, password:data.password}).then(
      (registrationResult) => {
          console.log("Got this attempt from server:" + registrationResult);
          if(registrationResult === "User added successfully"){
            sendLoginRequest(serverPort, data.login, data.password).then(() => {
                navigate('/main', {replace: true});
              }
              ).catch(() => {
                console.log("Fail to request token, maybe login or password are incorrect!");
                //todo: login or password is incorrect
              });
          }
        }
        ).catch(() => {
        //todo: maybe token is expired - need to go to login page
        console.log("Adding attempt finished with error!");
        }
      );
    };

    return (
        <form className="register_box container" onSubmit={handleSubmit(onSubmit)}>
          <h1>Регистрация</h1>
          <input placeholder='Логин' className='form-control'
              {...register("login", {required: true, pattern: /^[A-Za-z0-9]+$/i, })} />
          {errors?.login?.type === "pattern" && ( <p className='error'>Латинские буквы и цифры</p>)}
          {errors?.login?.type === "required" && <p className='error'>Это поле обязательно</p>}
    
          <input type="password" placeholder='Пароль' className='form-control'
          {...register("password", { required: true, pattern: /^[A-Za-z0-9]+$/i, minLength: 8,})} />
          {errors?.password?.type === "pattern" && (<p className='error'>Латинские буквы и цифры</p>)}
          {errors?.password?.type === "minLength" && <p className='error'>Хотя бы 8 символов</p>}
          {errors?.password?.type === "required" && <p className='error'>Это поле обязательно</p>}
    
    
          <input type="password" placeholder='Повторите пароль' className='form-control'
          {...register("repeatePassword", {
               required: true,
               pattern: /^[A-Za-z0-9]+$/i,
                minLength: 8,
                validate: value => value === password.current})} />
          {errors?.repeatePassword?.type === "pattern" && (<p className='error'>Латинские буквы и цифры</p>)}
          {errors?.repeatePassword?.type === "minLength" && <p className='error'> Хотя бы 8 символов</p>}
          {errors?.repeatePassword?.type === "required" && <p className='error'>Это поле обязательно</p>}
          {errors?.repeatePassword?.type === "validate" && <p className='error'>Пароли не совпадают</p>}
    
          <input type="submit" value="Зарегистрироваться" className='btn-block btn' />
        </form>
    );
};

export default RegistrContainer;

let tryToSendAddAttemptRequest = async (port, data) => {
    console.log(port);
    let url = "http://localhost:"+ port +"/auth/register";
    console.log("Sending POST request to url: " + url + ". With body: " + JSON.stringify(data));
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(data),
    });
    return response.text(); //todo: think if it will be better to return json as response or use just request status?
}

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