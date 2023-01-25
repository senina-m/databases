import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import put from '../../../api/Put';
import { useForm } from "react-hook-form";
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import get_yyyymmdd from "../../ConvertData";
import checkAuth from '../../../api/CheckAuth';


const CreatureEditForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  useEffect( () => {if(checkAuth()) navigate("/forbidden", { replace: true });});

  const [noSuch, setNoSuch] = useState(false);
  const [nothingUpdate, setNothingUpdate] = useState(false);
  const [someError, setSomeError] = useState(false);
  const [error, setError] = useState("");
  const [sucsess, setSucsess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  
  const {state} = useLocation();
  const {creature} = state;
  
  // setIsMale();
  const [isMale, setIsMale] = useState(creature.sex === "Мужчина");

  const prepareDate = (data)=>{
    return {"name": data.name,
    "birthday": get_yyyymmdd(data.birthday),
    "race": data.race,
    "deathDate": get_yyyymmdd(data.deathDate),
    "sex": (isMale ? "Мужчина" : "Женщина")
    }
  }

  const sendCreatureData = (data) => {
    setNoSuch(false);
    setNothingUpdate(false);
    setSucsess(false);
    setSomeError(false);

    let token = ReactSession.get("token");
    //todo: check that func works properly
      put("/creatures/"+ creature.id, prepareDate(data), token).then((json) => {
        if (json.status === 200) {
          setShowForm(false);
          setSucsess(true);
        }else if (json.status === 400){
          setSomeError(true);
          setError(json.message);
        }else if (json.status === 401){
          navigate("/relogin", { replace: true });
        }else if (json.status === 403) {
          navigate("/forbidden", { replace: true });
        }else if (json.status === 404) {
          setShowForm(false);
          setNoSuch(true);
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

  const onCreateCreatureClick = () =>{
    navigate("/create/creature", { replace: true});
  }

  const renderForm = ()=>{
    return <form className="form container" onSubmit={handleSubmit(sendCreatureData)} >
    <h1>Редактирование существа</h1>
    <label className='form-label'>Имя</label>
    <input placeholder='Имя' className='form-control' defaultValue={creature.name}
    {...register("name", {required: true, pattern: /^[А-Яа-я ]+$/i, })} />
    {errors?.name?.type === "pattern" && ( <p className='error'>Русские буквы</p>)}
    {errors?.name?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <label className='form-label'>День рождения (мм/дд/гггг)</label>
    <input  type="date" placeholder='День рождения' className='form-control' defaultValue={creature.birthday}
    {...register("birthday", {required: true, valueAsDate: true})} />
    {errors?.birthday?.type === "required" && <p className='error'>Это поле обязательно</p>}
    {errors?.birthday?.type === "validate" && <p className='error'>Дата должна быть не больше настоящей</p>}


    <label className='form-label'>День смерти (мм/дд/гггг)</label>
    <input type="date" placeholder='Дата смерти' className='form-control' defaultValue={creature.deathDate}
    {...register("deathDate", {valueAsDate: true})} />

    <label className='form-label'>Раса</label>
    <input placeholder='Раса' className='form-control' defaultValue={creature.race}
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
  }

  return (
    <>
      {sucsess && <h2 className='center green'>Существо успешно обновлено!</h2>}
      {someError && <h2 className='center'>{error}</h2>}
      {noSuch && <>
                  <h2 className='center'>Существа, которое вы хотели обновиить ещё не существует. Создайте его!</h2>
                  <button className='btn center' onClick={onCreateCreatureClick}>Создать новое существо</button>
                </>}
      {nothingUpdate && <>
                  <h2 className='center'>Вы не внесли ничего нового, существо осталось как было.. !</h2>
                  <br/>
                  <button className='btn center' onClick={showFormOnClick}>Внести изменения</button>
                </>}
      {showForm && renderForm()}
      <Link  className='center' to="/creatures" >Вернуться к таблице</Link>
    </>
  )
}

export default CreatureEditForm
