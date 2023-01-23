import React, {useRef, useState} from 'react'
import { useForm } from "react-hook-form";
import get from "../../api/Get"
import { useNavigate } from 'react-router-dom';
import {ReactSession} from 'react-client-session'

const CountSelaryContainer = () => {
    const navigate = useNavigate();
    const [selary, setSelary] = useState(-1);
    const [isResived, setIsResived] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,},
    } = useForm();

    const begin = useRef({});
    begin.current = watch("begin", "");

    const getDetectiveId = () =>{
        let token = ReactSession.get("token");
        let creature_id = ReactSession.get("creature_id");
        get("/detectives", {"creatureId":creature_id}, token).then((json) => {
          if (json.status === 200) {
            delete json.status;
            console.log("here", json);
            if (json === undefined || json.length === 0) {
              navigate("/forbidden", { replace: true });
            }else{
              //todo проверить что правильно достаю данные
              setSelary(json[0]);
              setIsResived(true);
            }
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

    const countDamage = (data) => {
        setIsResived(false);
        setSelary(-1);
        setIsError(false);
        setError("");

        let token = ReactSession.get("token");
        let detective_id = getDetectiveId();
        //todo: wait for api url!!!!
        get("/detectives/" + detective_id +"/salary/" + get_year(data) + "/" + get_month(data), {}, token).then((json) => {
          if (json.status === 200) {
            delete json.status;
            console.log("here", json);
            //todo проверить что правильно достаю данные
            setSelary(json);
            setIsResived(true);
          }else if (json.status === 400){
            setError(json.message);
            setIsError(true);
          }else if (json.status === 401){
            navigate("/relogin", { replace: true });
          }else if (json.status === 403) {
            navigate("/forbidden", { replace: true });
          }else if (json.status === 404) {
            navigate("*", { replace: true });
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
            {isError && <p className='error'>{error}</p>}
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

const get_year = (str_date) =>{

  const date = new Date(str_date);
  const yyyy = date.getFullYear();  
  return `${yyyy}`
}

const get_month = (str_date) =>{
  const date = new Date(str_date);
  const mm = String(date.getMonth() + 1).padStart(2,'0');
  return `${mm}`
}

export default CountSelaryContainer
