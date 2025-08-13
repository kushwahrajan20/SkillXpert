import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const searchHandler = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== "") {
            navigate(`/course/search?query=${searchQuery}`)
        }
        setSearchQuery("");
    }

    return (
        <div className='relative mt-16 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center'>
            <div className='max-w-3xl mx-auto'>
                <h1 className='text-white text-4xl font-bold mb-4'>Find the Best Courses for You</h1>
                <p className='text-gray-200 dark:text-gray-400 mb-8'>Explore a wide range of courses and enhance your skills with our expert-led programs.</p>
                <form
                    onSubmit={searchHandler}
                    className='flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6'
                >
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for courses, topics, or instructors"
                        className="flex-row border-none focus-visible:ring-0 px-6 py-3 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-full"
                    ></Input>
                    <Button type="submit" className="bg-blue-600 dark:bg-gray-800 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">Search</Button>
                </form>
                <Button onClick={() => navigate(`/course/search?query`)} className='bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200'>
                    Explore Courses
                </Button>

            </div>
        </div>
    )
}

export default HeroSection