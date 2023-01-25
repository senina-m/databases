import React, {useRef, useState} from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactSession } from 'react-client-session';

import post from "../../../api/Post"
import { Link } from 'react-router-dom';

const RegistrContainer = () => {
    const navigate = useNavigate();

    const [permission, setPermission] = useState("detective");
    const [sucsess, setSucsess] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [someError, setSomeError] = useState(false);
    const [error, setError] = useState("");

    //todo: check if creature isn't null, else redirect for creatures page
    // https://stackoverflow.com/questions/48433008/js-es6-destructuring-of-undefined
    const {state} = useLocation();
    // console.log(Object.hasOwn(state, 'creature'));
    const {id} = state;
    console.log(id);


    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
      } = useForm();

    const password = useRef({});
    password.current = watch("password", ""); 

    const prepareData = (data) =>{
      console.log(id);
      return {
       "name": data.login,
       "password": data.password,
       "permission": permission,
       "creatureId": id
     }
   }

    const onSubmit = (data) => {
      setShowForm(true);
      setSucsess(false);
      setError("");
      setSomeError(false);
      let token = ReactSession.get("token");
    //todo: check that func works properly
      post("/customers", prepareData(data), token).then((json) => {
        if (json.status === 201) {
          setSucsess(true);
          setShowForm(false);
        }else if (json.status === 401){
          navigate("/relogin", { replace: true });
        }else if (json.status === 403) {
          navigate("/forbidden", { replace: true });
        }else if (json.status === 404) {
          navigate("/forbidden", { replace: true });
        }else if (json.status === 409) {
          setError(json.message);
          setSomeError(true);
          setShowForm(false);
          <Link to="/creatures"></Link>
        }
      }).catch((e)=>{
        console.log("ERROR:", e);
        //todo: what to do if we are anable to load data from server?
        //or wrong json came
      });
  
    };

    const form = () => {
      return (
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
          <h1>Регистрация</h1>
          <input placeholder='Логин' className='form-control'
              {...register("login", {required: true, pattern: /^[A-Za-z0-9]+$/i, })} />
          {errors?.login?.type === "pattern" && ( <p className='error'>Русские буквы и цифры</p>)}
          {errors?.login?.type === "required" && <p className='error'>Это поле обязательно</p>}
    
          <input type="password" placeholder='Пароль' className='form-control'
          {...register("password", { required: true, pattern: /^[A-Za-z0-9]+$/i, minLength: 8,})} />
          {errors?.password?.type === "pattern" && (<p className='error'>Русские буквы и цифры</p>)}
          {errors?.password?.type === "minLength" && <p className='error'>Хотя бы 8 символов</p>}
          {errors?.password?.type === "required" && <p className='error'>Это поле обязательно</p>}

          <input type="password" placeholder='Повторите пароль' className='form-control'
          {...register("repeatePassword", {
               required: true,
               pattern: /^[A-Za-z0-9]+$/i,
                minLength: 8,
                validate: value => value === password.current})} />
          {errors?.repeatePassword?.type === "pattern" && (<p className='error'>Русские буквы и цифры</p>)}
          {errors?.repeatePassword?.type === "minLength" && <p className='error'> Хотя бы 8 символов</p>}
          {errors?.repeatePassword?.type === "required" && <p className='error'>Это поле обязательно</p>}
          {errors?.repeatePassword?.type === "validate" && <p className='error'>Пароли не совпадают</p>}

          <div className='form-control'>
            <label className='radio'>Детектив
              <input type="radio" name="Детектив" permission="detective" className='radio' checked={permission === 'detective' ? true : false} onChange={(e) => {setPermission(e.currentTarget.permission)}} />
            </label>
            <label className='radio'>Летописец
              <input type="radio" name="Летописец" permission="writer" className='radio' checked={permission === 'writer' ? true : false} onChange={(e) => {setPermission(e.currentTarget.permission)}} />
            </label>
          </div>
    
          <input type="submit" value="Зарегистрироваться" className='btn-block btn' />
        </form>
    );
  }

  return (
    <>
      {showForm && form()}
      {someError && <h2 className='error'>{error}</h2>}
      {sucsess && 
        (<>
          <h2>Аккаунт для существа успешно создан!</h2> 
          <br/><p>Не забудьте сообщить ему логин и пароль!</p>
          <br/><Link to="creatures">Перейти на страницу с существами</Link>
        </>)}
    </>

  );

    
};

export default RegistrContainer;