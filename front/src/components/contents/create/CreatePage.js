import React from 'react'
import CreateCreatureContainer from './CreateCreatureContainer'
import CreateCrimeContainer from './CreateCrimeContainer'

const CreatePage = ({crime}) => {
  return (
    <div>
      <h1>Create Page</h1>
      {crime && <CreateCrimeContainer/>}
      {!crime && <CreateCreatureContainer/>}
    </div>
  )
}

export default CreatePage
