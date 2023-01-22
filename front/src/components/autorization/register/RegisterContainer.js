import React, {useRef} from 'react';
import { useForm } from "react-hook-form";
import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

const RegistrContainer = () => {
    // const navigate = useNavigate();

    const {state} = useLocation();
    const {creature} = state;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
      } = useForm();

    const password = useRef({});
    password.current = watch("password", "");
  
    const onSubmit = (data) => {
  
    };

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
    
          <input type="submit" value="Зарегистрироваться" className='btn-block btn' />
        </form>
    );
};

export default RegistrContainer;