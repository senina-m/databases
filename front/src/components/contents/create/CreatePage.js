import React from 'react'
import CreateCreatureContainer from './CreateCreatureContainer'
import { Link } from 'react-router-dom';
import CreateCrimeContainer from './CreateCrimeContainer'

const CreatePage = ({crime}) => {
  return (
    <div>
    <Link to="/main" className='back-to-main-link'>Вернуться на главную</Link>
      <h1>Create Page</h1>

      {/* {crime? "true" : "false"} */}
      {crime && <CreateCrimeContainer/>}
      {!crime && <CreateCreatureContainer/>}
    </div>
  )
}

export default CreatePage
