import React, {useRef} from 'react'
import { useForm } from "react-hook-form";


const CountDamageToWorldHeart = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,},
    } = useForm();

    const begin = useRef({});
    begin.current = watch("begin", "");

    const countDamage = (data) => {
        //todo: request damage for given period
        console.log(data);
    }
    
    return (
        <form className="form container" onSubmit={handleSubmit(countDamage)} >
            <h1>Урон Сердцу Мира</h1>
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
        </form>
    );
}

export default CountDamageToWorldHeart
