import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'

const Profile = () => {
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setProfilePhoto(file);
    }
    const { data, isLoading, refetch } = useLoadUserQuery();
    // console.log(data);
    const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess }] = useUpdateUserMutation();



    const updateUserHandler = async () => {
        // console.log(name, profilePhoto);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("profilePhoto", profilePhoto);
        await updateUser(formData);

    }

    useEffect(() => {
        refetch();
    },[])
     

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data.messaage || "Profile updated")
        }

        if (isError) {
            toast.error(error.messaage || "Failed to update profile")
        }

    }, [ error,updateUserData, isSuccess, isError])

    if (isLoading) return <h1>Profile Loading...</h1>
    
    const  user  = data && data.user;
    // const isLoading = true;
    // const enrolledCourses = [1, 2];


    return (
        <div className='max-w-4xl mx-auto px-4 my-24'>
            <h1 className='font-bold text-2xl text-center md:text-left'>Profile</h1>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-8 mt-6'>
                <div className='flex flex-col items-center'>
                    <Avatar className='w-24 h-24 md:w-32 md:h-32 mb-4'>
                        <AvatarImage src={user.photoURL || "https://github.com/shadcn.png"} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Name: <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user.name}</span>
                        </h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Email: <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user.email}</span>
                        </h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Role: <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user.role.toUpperCase()}</span>
                        </h1>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="mt-2">
                                Edit Profile
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile information here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className='grid gap-4 py-4'>
                                <div className='grid grid-cols-4 item-centre gap-4'>
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"
                                        className="col-span-3" />
                                </div>
                                <div className='grid grid-cols-4 item-centre gap-4'>
                                    <Label>Profile Photo</Label>
                                    <Input
                                        onChange={onChangeHandler}
                                        type="file"
                                        accept="image/*"
                                        className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={updateUserHandler}
                                    disabled={updateUserIsLoading}>
                                    {
                                        updateUserIsLoading ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )
                                    }
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className='mt-10'>
                <h1 className='font-medium text-lg'>Courses you're enrolled in</h1>
                <div className='grid grid-cols-1 sm:grid-colls-2 md:grid-cols-3 gap-4 my-5'>
                    {
                        user.enrolledCourses.length === 0 ?
                            (
                                <h1>You haven't enrolled yet</h1>
                            )
                            :
                            (
                                user.enrolledCourses.map((course) => <Course course={course} key={course._id} />)
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile