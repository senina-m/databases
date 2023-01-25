import React, {useRef, useState} from 'react';
import post from '../../../api/Post';
import { useForm } from "react-hook-form";
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const CreateCreaturePage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();


  const navigate = useNavigate();

  const [nothingUpdate, setNothingUpdate] = useState(false);
  const [sucsess, setSucsess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [someError, setSomeError] = useState(false);
  const [error, setError] = useState("");
  const [isMale, setIsMale] = useState(true);


  const birthday = useRef({});
  birthday.current = watch("birthday", "");

  const prepareDate = (data)=>{
    return {"name": data.name,
    "birthday": get_ddmmyyyy(data.birthday),
    "race": data.race,
    "deathDate": get_ddmmyyyy(data.deathDate),
    "sex": (isMale ? "Мужчина" : "Женщина")
  }
  }

  const sendCreatureData = (data) => {
    setNothingUpdate(false);
    setSucsess(false);
    setSomeError(false);
    setError("");

    let token = ReactSession.get("token");
    //todo: check that func works properly
      post("/creatures" , prepareDate(data), token).then((json) => {
        if (json.status === 201) {
          setShowForm(false);
          setSucsess(true);
        }else if(json.status === 400){
          setSomeError(true);
          setError(json.message);
        }else if (json.status === 401){
          navigate("/relogin", { replace: true });
        }else if (json.status === 403) {
          navigate("/forbidden", { replace: true });
        }else if (json.status === 409) {
          setShowForm(false);
          setNothingUpdate(true);
        }
      }).catch((e)=>{
        console.log("ERROR:", e);
        //todo: what to do if we are anable to load data from server?
        //or wrong json came
      });
  }

  const form = ()=>{
    return <form className="form container" onSubmit={handleSubmit(sendCreatureData)} >
    <h1>Создание существа</h1>
    <label className='form-label'>Имя</label>
    <input placeholder='Имя' className='form-control'
    {...register("name", {required: true, pattern: /^[А-Яа-я ]+$/i, })} />
    {errors?.name?.type === "pattern" && ( <p className='error'>Русские буквы</p>)}
    {errors?.name?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <label className='form-label'>День рождения (мм/дд/гггг)</label>
    <input  type="date" placeholder='День рождения' className='form-control'
    {...register("birthday", {required: true, valueAsDate: true,
    validate: date => {
      let bd = Date.parse(date);
      return bd <= new Date();
      }})} />
    {errors?.birthday?.type === "required" && <p className='error'>Это поле обязательно</p>}
    {errors?.birthday?.type === "validate" && <p className='error'>Дата должна быть не больше настоящей</p>}


    <label className='form-label'>День смерти (мм/дд/гггг)</label>
    <input type="date" placeholder='Дата смерти' className='form-control' 
    {...register("deathDate", {valueAsDate: true, 
    validate: deathDate => {
      let death = Date.parse(deathDate);
      let birth = Date.parse(birthday.current);
      return death > birth
      }})} />
    {errors?.deathDate?.type === "required" && <p className='error'>Это поле обязательно</p>}
    {errors?.deathDate?.type === "validate" && <p className='error'>Дата смерти должна быть больше даты рождения</p>}
    {/* TODO: check deathDate if it isn't greater then currnt date as birthdaty*/}


    <label className='form-label'>Раса</label>
    <input placeholder='Раса' className='form-control' 
    {...register("race", {required: true, pattern: /^[А-Яа-я ]+$/i, })} />
    {errors?.race?.type === "pattern" && ( <p className='error'>Русские буквы</p>)}
    {errors?.race?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <div className='form-control'>
      <label className='radio'>Мужчина
        <input type="radio" name="sex" className='radio' checked={isMale} onChange={() => {setIsMale(!isMale)}} />
      </label>
      <label className='radio'>Женщина
        <input type="radio" name="sex" className='radio' checked={!isMale} onChange={() => {setIsMale(!isMale)}} />
      </label>
    </div>

    <input type="submit" value='Отправить' className='btn btn-block'/>
  </form>
  }

  const showFormOnClick = () =>{
    setShowForm(true);
    setNothingUpdate(false);
    setSucsess(false);
  }

  return (
    <>
      {someError && <h2 className='center error'>{error}</h2>}
      {sucsess && <>
                    <h2 className='center'>Существо успешно создано!</h2>
                    <br/>
                    <button className='btn center' onClick={showFormOnClick}>Создать ещё одно</button>
                  </>}
      {nothingUpdate && <>
                          <h2 className='center'>Такое существо уже существует..</h2>
                          <br/>
                          <button className='btn center' onClick={showFormOnClick}>Внести изменения</button>
                        </>}
      {showForm && form()}
      <Link  className='center' to="/creatures" >Вернуться к таблице</Link>
    </>
  )
}

export default CreateCreaturePage

const get_ddmmyyyy = (str_date) =>{

  const date = new Date(str_date);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2,'0');
  const dd = String(date.getDate()).padStart(2,'0');

  return `${dd}-${mm}-${yyyy}`
}
