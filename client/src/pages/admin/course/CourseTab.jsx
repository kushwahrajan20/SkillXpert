import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';


const CourseTab = () => {
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });
    const params = useParams();
    const courseId = params.courseId;
    const {data: courseByIdData,isLoading:courseByIdLoading,refetch} = useGetCourseByIdQuery(courseId,{refetchOnMountOrArgChange:true});
    
    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData?.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: "",
            });
        }
    }, [courseByIdData]);

    const [previewThumbnail, setPreviewThumbnail] = useState("")
    
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }
    const selectCategory = (value) => {
        setInput({ ...input, category: value })
    }
    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value })
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }
    const navigate = useNavigate();
    
    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
    // const isPublished = true;
    // const isLoading = false;
    const updateCourseHandler = async () => {
        // console.log(input);
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);
        await editCourse({formData, courseId});
    };

    const [publishCourse,{}] = usePublishCourseMutation();

    const publishStatusHandler = async(action)=>{
        try {
            const response = await publishCourse({courseId,query:action});

            if(response.data){
                refetch();
                toast.success(response.data.message);
            }
            
        } catch (error) {
            toast.error("Failed to publish or unpublish course");
        }
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course updated successfully");
        }
        if (error) {
            toast.error(error.data.message || "Failed to update course");
        }
    }, [isSuccess, error]);

    if(courseByIdLoading) return <h1>Loading...</h1>
    
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>
                        Basic Course Information
                    </CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button disabled={courseByIdData?.course.lectures.length === 0 } variant="outline" onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished? "false" : "true")}>
                        {
                            courseByIdData?.course.isPublished? "Unpublished" : "Publish"
                        }
                    </Button>
                    <Button>
                        Remove Course
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Fullstack developer"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a fullstack developer from zero to hero."
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex items-center gap-5'>
                        <div className=''>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory}>
                                <SelectTrigger className="w-[180px] mt-1">
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
                        <div className=''>
                            <Label>Course Level</Label>

                            <Select onValueChange={selectCourseLevel}>
                                <SelectTrigger className="w-[180px] mt-1">
                                    <SelectValue placeholder="Select a Course Level" />
                                </SelectTrigger>
                                <SelectContent side="top" >
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>

                                        <SelectItem value="Intermediate">Intermediate</SelectItem>

                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="199"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>
                            Course Thumbnail
                        </Label>
                        <Input
                            onChange={selectThumbnail}
                            accept="image/*"
                            className="w-fit"
                            type="file" />{
                            previewThumbnail && (
                                <img src={previewThumbnail} className="w-64 my-2" alt="Course Thumbnail" />
                            )
                        }
                    </div>
                    <div>
                        <Button variant="outline" onClick={() => navigate("/admin/course")}>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait...
                                    </>
                                ) : (
                                    "Save"
                                )
                            }
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab