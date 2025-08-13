import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse,{data, isLoading, isSuccess, error}] = useCreateCourseMutation();
  const navigate = useNavigate();
  const getSelectedCategory = (value)=> {
    setCategory(value);
  }

  const createCourseHandler =async () => {
      await createCourse({ courseTitle, category});
  }
  // const isLoading = false; 
  useEffect(()=>{
    if(isSuccess){
      toast.success(data?.message || "Course created.")
      navigate("/admin/course");
    }
  },[isSuccess, error])
  return (
    <div>
      <div className='flex-1 mx-10'>
        <div className='mb-4'>
          <h1 className='font-bold text-xl'>Let's add course, add some basic course details for your new course</h1>
          <p className="text-sm">
            Please fill in the course title, description, and other details below to create a new course.
          </p>
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input type="text"
                 name="courseTitle" 
                 value={courseTitle} 
                 onChange={(e) => setCourseTitle(e.target.value)}
                 placeholder="Enter course title" />
        </div>
        <div className="space-y-2 mt-4">
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next JS">Next JS</SelectItem>

                <SelectItem value="Data Science">Data Science</SelectItem>

                <SelectItem value="Frontend Development">Frontend Development</SelectItem>

                <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>

                <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>

                <SelectItem value="Javascript">Javascript</SelectItem>

                <SelectItem value="Python">Python</SelectItem>

                <SelectItem value="Docker">Docker</SelectItem>

                <SelectItem value="MongoDB">MongoDB</SelectItem>

                <SelectItem value="HTML">HTML</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>


        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>Back</Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {
                isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    Please wait...
                    </>
                ) : "Create"
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddCourse