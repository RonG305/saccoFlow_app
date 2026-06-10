import React from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '../ui/progress'


const LoanLimitCard = () => {
  return (
    <Card>
        <h4 className='text-xl '>Available loan limit</h4>
        <h2 className='text-2xl font-bold'>KES 170,000.35</h2>
       <Progress value={60} />

       <div className='flex items-center justify-between'>
        <p className='font-semibold'>Eligible: <span className='text-success'>KES 170,000.35</span></p>
         <p className='font-semibold'>Utilized: <span className='text-danger'>KES 40,000.35</span></p>
       </div>
    </Card>
  )
}

export default LoanLimitCard
