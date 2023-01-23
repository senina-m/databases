import React, {useRef, useState} from 'react'
import { useForm } from "react-hook-form";
import get from "./api/Get"
import { useNavigate } from 'react-router-dom';
import {ReactSession} from 'react-client-session'

const CountSelaryContainer = () => {
    const navigate = useNavigate();
    const [selary, setSelary] = useState(-1);
    const [isResived, setIsResived] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,},
    } = useForm();

    const begin = useRef({});
    begin.current = watch("begin", "");

    const countDamage = (data) => {
        setIsResived(false);
        setSelary(-1);

        let token = ReactSession.get("token");
        get("", {}, token).then((json) => {
          if (json.status === 200) {
            delete json.status;
            console.log("here", json);
            //todo проверить что правильно достаю данные
            setSelary(json);
            setIsResived(true);
          }else if (json.status === 401){
            navigate("/relogin", { replace: true });
          }else if (json.status === 403) {
            navigate("/forbidden", { replace: true });
          }
        }).catch((e)=>{
          console.log("ERROR:", e);
          //todo: what to do if we are anable to load data from server?
          //or wrong json came
        });
    }
    
    return (
        <form className="form cont" onSubmit={handleSubmit(countDamage)} >
            <h1>Зарплата</h1>
            <label className='form-label'>Начало (мм/дд/гггг)</label>
            <input  type="month" placeholder='Начало' className='form-control'
            {...register("begin", {required: true, valueAsDate: true,
            validate: date => {
            let bd = Date.parse(date);
            return bd <= new Date();
            }})} />
            {errors?.begin?.type === "required" && <p className='error'>Это поле обязательно</p>}
            {errors?.begin?.type === "validate" && <p className='error'>Дата должна быть не больше настоящей</p>}

            <input  type="month" placeholder='Конец' className='form-control'
            {...register("end", {required: true, valueAsDate: true,
            validate: end => {
                let end_date = Date.parse(end);
                let begin_date = Date.parse(begin.current);
                return end_date > begin_date;
            }})} />
            {errors?.end?.type === "required" && <p className='error'>Это поле обязательно</p>}
            {errors?.end?.type === "validate" && <p className='error'>Дата конца должна быть больше даты начала</p>}
            
            <input type="submit" value='Рассчитать зарплату за период' className='btn btn-block'/>
            {isResived && <h2 className='green'>Ваша зарплата: {selary} у.е.</h2>}
        </form>
    );
}

const get_mmyyyy = (str_date) =>{

    const date = new Date(str_date);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2,'0');
    // const dd = String(date.getDate()).padStart(2,'0');
  
    return `${mm}-${yyyy}`
  }

export default CountSelaryContainer
