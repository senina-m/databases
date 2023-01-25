import React, {useState, useEffect} from 'react';
import post from '../../../api/Post';
import { useForm } from "react-hook-form";
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import get_yyyymmdd from "../../ConvertData";
import checkAuth from '../../../api/CheckAuth';
import checkWriter from '../../../api/CheckRole';


const CreateCreaturePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();

  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});
  useEffect( () => {if(checkWriter()) navigate("/forbidden", { replace: true });});


  const [nothingUpdate, setNothingUpdate] = useState(false);
  const [sucsess, setSucsess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [someError, setSomeError] = useState(false);
  const [error, setError] = useState("");
  const [isMale, setIsMale] = useState(true);

  const prepareDate = (data)=>{
    return {"name": data.name,
    "birthday": get_yyyymmdd(data.birthday),
    "race": data.race,
    "deathDate": get_yyyymmdd(data.deathDate),
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
    <input type="date" placeholder='Дата смерти' className='form-control' defaultValue={"yyyy-MM-dd"}
    {...register("deathDate", {valueAsDate: true })} />


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
                    <h2 className='center green'>Существо успешно создано!</h2>
                    <br/>
                    <button className='btn center' onClick={showFormOnClick}>Создать ещё одно</button>
                  </>}
      {nothingUpdate && <>
                          <h2 className='center'>Такое существо уже существует..</h2>
                          <br/>
                          <button className='btn center' onClick={showFormOnClick}>Внести изменения</button>
                        </>}
      {showForm && form()}
      <br/>
      <Link  className='center' to="/creatures" >Вернуться к таблице</Link>
    </>
  )
}

export default CreateCreaturePage
