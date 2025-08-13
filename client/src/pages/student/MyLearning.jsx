import React from 'react'
import Course from './Course';
import { useLoadUserQuery } from '@/features/api/authApi';

const MyLearning = () => {
  // const isLoading = false;
  // const myLearningCourses = [1,2]; 
  const { data, isLoading } = useLoadUserQuery();

  const myLearning = data?.user?.enrolledCourses || [];
  return (
    <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
      <h1 className='font-bold text-2xl'>MY LEARNING</h1>
      <div className='my-6'>
        {isLoading ? <MyLearningSkeleton /> :
          (myLearning.length === 0 ? 
           
              (<p className='text-center text-gray-500'>You have not enrolled in any courses yet.</p>)
              
          
            :( 
            
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {
                    myLearning.map((course, index) => (
                      <Course key={index} course={course}/>
                    ))
                  }
                </div>
            )
          )
        }
      </div>
    </div>
  )
}

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);

export default MyLearning