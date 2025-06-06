'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import learningPathApi from '@/api/axios/learningPathApi';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

interface LearningPath {
    id: number;
    title: string;
    description?: string;
    image?: string;
    level?: string;
    createdAt?: string;
    updatedAt?: string;
    totalSteps: number;
    totalCourses: number;
    status?: number;
}

export default function LearningPathsPage() {
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchLearningPaths();
    }, []);

    const fetchLearningPaths = async () => {
        try {
            setLoading(true);
            const response = await learningPathApi.getAllLearningPaths();
            if (response.data.statusCode === 200) {
                setLearningPaths(response.data.data);
            } else {
                setError('Failed to fetch learning paths');
            }
        } catch (error) {
            console.error('Error fetching learning paths:', error);
            setError('An error occurred while fetching learning paths');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this learning path?')) {
            return;
        }

        try {
            const response = await learningPathApi.deleteLearningPath(id);
            if (response.data.statusCode === 200) {
                setLearningPaths(learningPaths.filter(path => path.id !== id));
            } else {
                setError('Failed to delete learning path');
            }
        } catch (error) {
            console.error('Error deleting learning path:', error);
            setError('An error occurred while deleting the learning path');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Learning Paths</h1>
                <Link
                    href="/admin/learning-paths/create"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
                >
                    <FiPlus className="mr-2" /> Create New Path
                </Link>
            </div>

            {learningPaths.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500">No learning paths found. Create your first one!</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Steps</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {learningPaths.map((path) => (
                                <tr key={path.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{path.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {path.image && (
                                                <div className="flex-shrink-0 h-10 w-10 mr-4">
                                                    <img className="h-10 w-10 rounded-md object-cover" src={path.image} alt={path.title} />
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{path.title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{path.level || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{path.totalSteps}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{path.totalCourses}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${path.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {path.status === 1 ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {path.updatedAt ? new Date(path.updatedAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link href={`/learning-paths/${path.id}`} className="text-blue-600 hover:text-blue-900">
                                                <FiEye className="w-5 h-5" />
                                            </Link>
                                            <Link href={`/admin/learning-paths/edit/${path.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                <FiEdit2 className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(path.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 