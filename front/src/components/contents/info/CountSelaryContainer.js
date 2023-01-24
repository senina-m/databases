import React, {useRef, useState} from 'react'
import { useForm } from "react-hook-form";
import get from "../../../api/Get"
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

    const getDetectiveId = async () =>{
        let token = ReactSession.get("token");
        let creature_id = ReactSession.get("creature_id");
        return await get("/detectives", {"creatureId":creature_id}, token).then((json) => {
          if (json.status === 200) {
            delete json.status;
            if (json === undefined || json.length === 0) {
              navigate("/forbidden", { replace: true });
            }else{
              console.log( json[0].id);
              return json[0].id;
            }
          }else if (json.status === 401){
            navigate("/relogin", { replace: true });
          }else if (json.status === 403) {
            navigate("/forbidden", { replace: true });
          }
          return -1;
        }).catch((e)=>{
          console.log("ERROR:", e);
          return -1;
          //todo: what to do if we are anable to load data from server?
          //or wrong json came
      });
    }

    //todo: fix, when api will add json instead of plain text number
    const requestSelary = (detective_id, data) => {
      console.log("requestSelary", detective_id);
      if(detective_id < 0){
        return;
      }

      ReactSession.set("detective_id", detective_id);
      setIsResived(false);
      setSelary(-1);
      setIsError(false);
      setError("");

      let token = ReactSession.get("token");
      get("/detectives/" + detective_id +"/salary/" + get_year(data.month) + "/" + get_month(data.month), {}, token).then((json) => {
        if (json.status === 200) {
          delete json.status;
          //todo проверить что правильно достаю данные
          setSelary(json.value);
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

    const countSalary = (data) => {
      getDetectiveId().then((detective_id) => requestSelary(detective_id, data));
    }
    
    return (
        <form className="form cont" onSubmit={handleSubmit(countSalary)} >
            <h1>Зарплата</h1>
            {isError && <p className='error'>{error}</p>}
            <label className='form-label'>Месяц</label>
            <input  type="month" placeholder='Начало' className='form-control'
            {...register("month", {required: true, valueAsDate: true,
            validate: date => {
              let bd = Date.parse(date);
              return bd <= new Date();
            }})} />
            {errors?.month?.type === "required" && <p className='error'>Это поле обязательно</p>}
            {errors?.month?.type === "validate" && <p className='error'>Дата должна быть не больше настоящей</p>}
            
            <input type="submit" value='Рассчитать зарплату за период' className='btn btn-block'/>
            {isResived && <h2 className='green'>Ваша зарплата: {selary} у.е.</h2>}
        </form>
    );
}

const get_year = (str_date) =>{
  console.log(str_date)
  const date = new Date(str_date);
  const yyyy = date.getFullYear();
  return yyyy;
}

const get_month = (str_date) =>{
  const date = new Date(str_date);
  const mm = String(date.getMonth() + 1).padStart(2,'0');
  return mm;
}

export default CountSelaryContainer
