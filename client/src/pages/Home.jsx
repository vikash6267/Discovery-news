import React from 'react'
import LatestNews from '../components/core/Home/LatestNews'
import CategoryWise from '../components/core/Home/CategoryWise'

function Home() {
  return (
    <div className=' max-w-7xl p-4 mx-auto'>

        <LatestNews />
        <CategoryWise />


        
    </div>
  )
}

export default Home