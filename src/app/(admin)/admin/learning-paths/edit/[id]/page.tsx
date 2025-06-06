'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import learningPathApi from '@/api/axios/learningPathApi';
import { FiSave, FiX } from 'react-icons/fi';
import StepsList from '@/components/admin/learning-paths/StepsList';
import AddStepForm from '@/components/admin/learning-paths/AddStepForm';

interface FormData {
    id: number;
    title: string;
    description: string;
    image: string;
    level: string;
    estimatedTime: number;
    status: number;
}

interface Step {
    id: number;
    title: string;
    description?: string;
    orderIndex: number;
    courses: Course[];
}

interface Course {
    id: number;
    title: string;
    description?: string;
    banner?: string;
    level?: string;
    orderIndex: number;
}

interface AvailableCourse {
    id: number;
    title: string;
    banner?: string;
    level?: { name: string };
}

export default function EditLearningPathPage() {
    const router = useRouter();
    const params = useParams();
    const pathId = Number(params.id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        id: pathId,
        title: '',
        description: '',
        image: '',
        level: '',
        estimatedTime: 0,
        status: 1,
    });

    const [steps, setSteps] = useState<Step[]>([]);
    const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>([]);

    // Fetch learning path data
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await learningPathApi.getLearningPathById(pathId);

            if (response.data.statusCode === 200) {
                const { learningPath, steps } = response.data.data;

                setFormData({
                    id: learningPath.id,
                    title: learningPath.title || '',
                    description: learningPath.description || '',
                    image: learningPath.image || '',
                    level: learningPath.level || '',
                    estimatedTime: learningPath.estimatedTime || 0,
                    status: learningPath.status || 1,
                });

                setSteps(steps || []);
            } else {
                setError('Failed to fetch learning path');
            }

            // Fetch available courses
            const coursesResponse = await learningPathApi.getAvailableCourses();
            if (coursesResponse.data.statusCode === 200) {
                setAvailableCourses(coursesResponse.data.data || []);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pathId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'estimatedTime' || name === 'status' ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await learningPathApi.updateLearningPath(formData);

            if (response.data.statusCode === 200) {
                router.push('/admin/learning-paths');
            } else {
                setError(response.data.message || 'Failed to update learning path');
            }
        } catch (error: any) {
            console.error('Error updating learning path:', error);
            setError(error.response?.data?.message || 'An error occurred while updating the learning path');
        } finally {
            setLoading(false);
        }
    };

    const handleStepsChange = (updatedSteps: Step[]) => {
        setSteps(updatedSteps);
    };

    const handleError = (message: string) => {
        setError(message);
    };

    if (loading && steps.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Edit Learning Path</h1>
                <Link
                    href="/admin/learning-paths"
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
                >
                    <FiX className="mr-2" /> Cancel
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <button
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setError(null)}
                    >
                        <FiX />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter learning path title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter description"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        type="text"
                                        id="image"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter image URL"
                                    />
                                    {formData.image && (
                                        <div className="mt-2">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="h-24 w-auto object-cover rounded-md"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                                        Level
                                    </label>
                                    <select
                                        id="level"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select Level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="All Levels">All Levels</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-1">
                                        Estimated Time (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        id="estimatedTime"
                                        name="estimatedTime"
                                        value={formData.estimatedTime}
                                        onChange={handleChange}
                                        min="0"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value={1}>Active</option>
                                        <option value={0}>Inactive</option>
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="inline-block animate-spin mr-2">⟳</span> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="mr-2" /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Add New Step Section */}
                    <div className="mt-6">
                        <AddStepForm
                            learningPathId={pathId}
                            onStepAdded={fetchData}
                            onError={handleError}
                        />
                    </div>
                </div>

                {/* Steps and Courses Management */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Learning Path Steps</h2>
                        <StepsList
                            steps={steps}
                            availableCourses={availableCourses}
                            onStepsChange={handleStepsChange}
                            onError={handleError}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 