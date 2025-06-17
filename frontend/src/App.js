import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './Pages/Home'
import ConfirmOrder from './Pages/ConfirmOrder/ConfirmOrder'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path = '/' element ={<Home/>}/>
        <Route path ='/confirmorder' element ={<ConfirmOrder/>}/>
        

        
      </Routes>
      
    </div>
  )
}

export default App
