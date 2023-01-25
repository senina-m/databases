import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import put from '../../../api/Put';
import { useForm } from "react-hook-form";
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import get_yyyymmdd from "../../ConvertData";
import checkAuth from '../../../api/CheckAuth';


const CrimeEditForm = () => {
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
  const { crime } = state;

  const prepareDate = (data)=>{
    return {
      "id": crime.id,
      "title": data.title,
      "description": data.description,
      "dateBegin": get_yyyymmdd(data.dateBegin),
      "dateEnd":  get_yyyymmdd(data.dateEnd),
      "isSolved": data.isSolved,
      "damageDescription": data.damageDescription,
      "location": data.location,
      "mainDetectiveId": data.mainDetectiveId
    }
  }

  const sendCrimeData = (data) => {
    console.log(data);
    setNoSuch(false);
    setNothingUpdate(false);
    setSucsess(false);
    setSomeError(false);

    let token = ReactSession.get("token");
    //todo: check that func works properly
      put("/crimes/"+ crime.id, prepareDate(data), token).then((json) => {
        // put("/creatures/"+ 123456789, prepareDate(data), token).then((json) => {
        if (json.status === 200) {
          showForm(false);
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

  const onCreateCrimeClick = () =>{
    navigate("/create/crime", { replace: true});
  }

  const renderForm = ()=>{
    return <form className="form cont form-crime" onSubmit={handleSubmit(sendCrimeData)} >
    <h1>Редактирование досье</h1>
    <label className='form-label'>Заголовок</label>
    <input placeholder='заголовок' className='form-control  crime' defaultValue={crime.title}
    {...register("title", {required: true, pattern: /^[А-Яа-я ]+$/i, })} />
    {errors?.title?.type === "pattern" && ( <p className='error'>Русские буквы</p>)}
    {errors?.title?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <label className='form-label'>Описание</label>
    <textarea type='text' placeholder='описание' className='form-control  crime textarea' defaultValue={crime.description}
    {...register("description", {required: true, pattern: /^[А-Яа-я 0-9]+$/i, })} />
    {errors?.description?.type === "pattern" && ( <p className='error'>Русские буквы</p>)}
    {errors?.description?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <label className='form-label'>Дата Начала (мм/дд/гггг)</label>
    <input  type="date" placeholder='дата начала' className='form-control  crime' defaultValue={crime.dateBegin}
    {...register("dateBegin", {required: true, valueAsDate: true,
    validate: date => {
      let bd = Date.parse(date);
      return bd <= new Date();
      }})} />
    {errors?.dateBegin?.type === "required" && <p className='error'>Это поле обязательно</p>}
    {errors?.dateBegin?.type === "validate" && <p className='error'>Дата должна быть не больше настоящей</p>}

    <label className='form-label'>Дата конца(мм/дд/гггг)</label>
    <input type="date" placeholder='дата конца' className='form-control  crime' defaultValue={crime.dateEnd}
    {...register("dateEnd", {valueAsDate: true})} />

    <label className='form-label'>Раскрыто ли</label>
    {/* <input type="checkbox"  onChange={this.handleChangeChk} /> */}
    <input type="checkbox" placeholder='раскрыто ли' className='form-control crime' defaultChecked={crime.isSolved}
    {...register("isSolved")} />

    <label className='form-label'>Описание урона</label>
    <textarea placeholder='описание урона' className='form-control textarea crime' defaultValue={crime.damageDescription}
    {...register("damageDescription", {pattern: /^[А-Яа-я 0-9]+$/i, })} />
    {errors?.damageDescription?.type === "pattern" && ( <p className='error'>Русские буквы</p>)}

    <label className='form-label'>Локация</label>
    <input placeholder='локация' className='form-control  crime' defaultValue={crime.location}
    {...register("location", {required: true, pattern: /^[А-Яа-я 0-9]+$/i, })} />
    {errors?.location?.type === "pattern" && ( <p className='error'>Русские буквы</p>)}
    {errors?.location?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <label className='form-label'>id Главного детектива</label>
    <input placeholder='id Главного детектива' className='form-control  crime' defaultValue={crime.mainDetectiveId}
    {...register("mainDetectiveId", {required: true, pattern: /^[0-9]+$/i, })} />
    {errors?.mainDetectiveId?.type === "pattern" && ( <p className='error'>Русские буквы</p>)}
    {errors?.mainDetectiveId?.type === "required" && <p className='error'>Это поле обязательно</p>}

    <input type="submit" value='Отправить' className='btn btn-block'/>
  </form>
  }

  const showFormOnClick = () =>{
    setShowForm(true);
  }

  return (
    <>
      {sucsess && <h2 className='center'>Досье успешно обновлено!</h2>}
      {someError && <h2 className='center'>{error}</h2>}
      {noSuch && <>
                  <h2 className='center'>Досье, которое вы хотели обновиить ещё не существует. Создайте его!</h2>
                  <button className='btn center' onClick={onCreateCrimeClick}>Создать новое досье</button>
                </>}
      {nothingUpdate && <>
                  <h2 className='center'>Вы не внесли ничего нового, досье осталось как было.. !</h2>
                  <br/>
                  <button className='btn center' onClick={showFormOnClick}>Внести изменения</button>
                </>}
      {showForm && renderForm()}
      <Link  className='center' to="/crimes" >Вернуться к таблице</Link>
    </>
  )
}

export default CrimeEditForm
