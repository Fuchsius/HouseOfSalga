import React from 'react'
import './Home.css'
import Hero from '../HimashaComponents/Hero/Hero'
import TrendingSection from '../HimashaComponents/TrendingSection/TrendingSection'
import NewArrivals from '../HimashaComponents/NewArrivals/NewArrivals'
import Testimonials from '../HimashaComponents/Testimonials/Testimonials'
import Footer from '../HimashaComponents/Footer/Footer'
import Header from '../HimashaComponents/Header/Header'

function Home() {
  return (
    <div>
        <Header/>
        <Hero/>
        <TrendingSection />
        <NewArrivals/>
        <Testimonials/>
        <Footer/>
        
      
    </div>
  )
}

export default Home
