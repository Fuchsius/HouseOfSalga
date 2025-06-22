import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import ConfirmOrder from './Pages/ConfirmOrder/ConfirmOrder'
import SignIn from './Pages/Signin/SignIn'
import Product from './Pages/Product/Product'
import ProductReturns from './Pages/ProductReturns/ProductReturns'
import ProductReview from './Pages/ProductReview/ProductReview'
import SignUp from './Pages/Signup/SignUp'
import ViewOrder from './Pages/ViewOrder/ViewOrder'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/confirmorder' element={<ConfirmOrder/>}/>
        <Route path='/confirmorder/:id' element={<ConfirmOrder/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path="/product/returns" element={<ProductReturns />} />
        <Route path="/product/review" element={<ProductReview />} />
        <Route path='/vieworder' element={<ViewOrder/>}/>
        {/* Add more routes as needed */}
      </Routes>
    </div>
  )
}

export default App