'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import learningPathApi from '@/api/axios/learningPathApi';
import { FiSave, FiX } from 'react-icons/fi';

interface FormData {
    title: string;
    description: string;
    image: string;
    level: string;
    estimatedTime: number;
    status: number;
}

export default function CreateLearningPathPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        image: '',
        level: 'Beginner',
        estimatedTime: 0,
        status: 1,
    });

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

            const response = await learningPathApi.createLearningPath(formData);

            if (response.data.statusCode === 201) {
                router.push('/admin/learning-paths');
            } else {
                setError(response.data.message || 'Failed to create learning path');
            }
        } catch (error: any) {
            console.error('Error creating learning path:', error);
            setError(error.response?.data?.message || 'An error occurred while creating the learning path');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Create Learning Path</h1>
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
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
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

                        <div className="col-span-2">
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
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block animate-spin mr-2">⟳</span> Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave className="mr-2" /> Save Learning Path
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 