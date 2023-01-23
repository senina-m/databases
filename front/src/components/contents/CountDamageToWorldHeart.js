import React, {useRef, useState} from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import get from "../../api/Get";
import {ReactSession} from 'react-client-session';


const CountDamageToWorldHeart = () => {
    const navigate = useNavigate();

    const [damage, setDamage] = useState(-1);
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

    const countDamage = (data) => {
        let token = ReactSession.get("token");
        get("/magicAmount", {"dateBegin": get_ddmmyyyy(data.begin), "dateEnd": get_ddmmyyyy(data.end)}, token).then((json) => {
            if (json.status === 200) {
                delete json.status;
                console.log("here", json);
                //todo проверить что правильно достаю данные
                setDamage(json);
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
        //todo: request damage for given period
        console.log(data);
    }
    
    return (
        <>
            <form className="form cont" onSubmit={handleSubmit(countDamage)} >
                <h1>Урон Сердцу Мира</h1>
                {isError && <p className='error'>{error}</p>}
                <label className='form-label'>Начало (мм/дд/гггг)</label>
                <input  type="date" placeholder='Начало' className='form-control'
                {...register("begin", {required: true, valueAsDate: true,
                validate: date => {
                let bd = Date.parse(date);
                return bd <= new Date();
                }})} />
                {errors?.begin?.type === "required" && <p className='error'>Это поле обязательно</p>}
                {errors?.begin?.type === "validate" && <p className='error'>Дата должна быть не больше настоящей</p>}

                <input  type="date" placeholder='Конец' className='form-control'
                {...register("end", {required: true, valueAsDate: true,
                validate: end => {
                    let end_date = Date.parse(end);
                    let begin_date = Date.parse(begin.current);
                    return end_date > begin_date;
                }})} />
                {errors?.end?.type === "required" && <p className='error'>Это поле обязательно</p>}
                {errors?.end?.type === "validate" && <p className='error'>Дата должна быть не больше настоящей</p>}
                
                <input type="submit" value='Рассчитать урон сердцу мира' className='btn btn-block'/>
                {isResived && <h2 className='green'>Урон сердцу мира в этот период: {damage} у.е.</h2>}
            </form>

        </>
    );
}

const get_ddmmyyyy = (str_date) =>{
    const date = new Date(str_date);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2,'0');
    const dd = String(date.getDate()).padStart(2,'0');
  
    return `${dd}-${mm}-${yyyy}`
  }

export default CountDamageToWorldHeart
