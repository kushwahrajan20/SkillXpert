import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi'

import React from 'react'
import {LineChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const Dashboard = () => {
  const {data, isSuccess, isError, isLoading} = useGetPurchasedCoursesQuery()
  if(isError) return <h1>Error loading dashboard data</h1>
  if(isLoading) return <h1>Loading...</h1>

  const purchasedCourse = data?.purchasedCourse || [];
  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId.courseTitle,
    price: course.courseId.coursePrice,
  }));
  return (
    <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">400</p>
        </CardContent>  
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">1200</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">Course Prices</CardTitle>
        </CardHeader>
        <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={courseData} >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
            dataKey="name"
            stroke="#6b7280"
            angle={-30}
            textAnchor="end"
            interval={0}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip formatter={(value, name) => [`$${value}`, name]} />
              <Line
              type="monotone"
              dataKey="price"
              stroke="#4a90e2"
              strokeWidth={3}
              dot={{stroke: '#4a90e2', strokeWidth: 2}}
              />
          </LineChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard