'use client';

import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import learningPathApi from '@/api/axios/learningPathApi';

interface Course {
    id: number;
    title: string;
    description?: string;
    banner?: string;
    level?: string;
    orderIndex: number;
}

interface Step {
    id: number;
    title: string;
    description?: string;
    orderIndex: number;
    courses: Course[];
}

interface AvailableCourse {
    id: number;
    title: string;
    banner?: string;
    level?: { name: string };
}

interface StepsListProps {
    steps: Step[];
    availableCourses: AvailableCourse[];
    onStepsChange: (steps: Step[]) => void;
    onError: (message: string) => void;
}

export default function StepsList({ steps, availableCourses, onStepsChange, onError }: StepsListProps) {
    const [loading, setLoading] = useState(false);
    const [selectedStep, setSelectedStep] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

    const handleRemoveStep = async (stepId: number) => {
        if (!window.confirm('Are you sure you want to remove this step? All associated courses will be removed.')) {
            return;
        }

        try {
            setLoading(true);

            const response = await learningPathApi.removeStepFromLearningPath(stepId);

            if (response.data.statusCode === 200) {
                onStepsChange(steps.filter(step => step.id !== stepId));
            } else {
                onError('Failed to remove step');
            }
        } catch (error: any) {
            console.error('Error removing step:', error);
            onError(error.response?.data?.message || 'An error occurred while removing the step');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourseToStep = async (stepId: number, courseId: number) => {
        try {
            setLoading(true);

            const step = steps.find(s => s.id === stepId);
            const orderIndex = step?.courses?.length ? step.courses.length + 1 : 1;

            const response = await learningPathApi.addCourseToStep({
                learningPathStepId: stepId,
                courseId: courseId,
                orderIndex: orderIndex
            });

            if (response.data.statusCode === 201) {
                // Get the course details from available courses
                const courseDetails = availableCourses.find(c => c.id === courseId);

                // Update the local state
                const updatedSteps = steps.map(step => {
                    if (step.id === stepId) {
                        return {
                            ...step,
                            courses: [
                                ...step.courses,
                                {
                                    id: courseId,
                                    title: courseDetails?.title || 'Unknown Course',
                                    banner: courseDetails?.banner,
                                    level: courseDetails?.level?.name,
                                    orderIndex: orderIndex
                                }
                            ]
                        };
                    }
                    return step;
                });

                onStepsChange(updatedSteps);
                setSelectedCourse(null);
            } else {
                onError('Failed to add course to step');
            }
        } catch (error: any) {
            console.error('Error adding course:', error);
            onError(error.response?.data?.message || 'An error occurred while adding the course');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCourse = async (stepId: number, courseId: number) => {
        if (!window.confirm('Are you sure you want to remove this course from the step?')) {
            return;
        }

        try {
            setLoading(true);

            const response = await learningPathApi.removeCourseFromStep(stepId, courseId);

            if (response.data.statusCode === 200) {
                // Update local state
                const updatedSteps = steps.map(step => {
                    if (step.id === stepId) {
                        return {
                            ...step,
                            courses: step.courses.filter(course => course.id !== courseId)
                        };
                    }
                    return step;
                });

                onStepsChange(updatedSteps);
            } else {
                onError('Failed to remove course');
            }
        } catch (error: any) {
            console.error('Error removing course:', error);
            onError(error.response?.data?.message || 'An error occurred while removing the course');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStepOrder = async (stepId: number, direction: 'up' | 'down') => {
        const currentStep = steps.find(s => s.id === stepId);
        if (!currentStep) return;

        const currentIndex = steps.findIndex(s => s.id === stepId);
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= steps.length) return;

        try {
            setLoading(true);

            const response = await learningPathApi.updateStepOrder(stepId, newIndex + 1);

            if (response.data.statusCode === 200) {
                // Also update the other affected step
                const otherStep = steps[newIndex];
                await learningPathApi.updateStepOrder(otherStep.id, currentIndex + 1);

                // Update local state by swapping the steps
                const updatedSteps = [...steps];
                [updatedSteps[currentIndex], updatedSteps[newIndex]] = [updatedSteps[newIndex], updatedSteps[currentIndex]];

                onStepsChange(updatedSteps);
            } else {
                onError('Failed to update step order');
            }
        } catch (error: any) {
            console.error('Error updating step order:', error);
            onError(error.response?.data?.message || 'An error occurred while updating the step order');
        } finally {
            setLoading(false);
        }
    };

    if (steps.length === 0) {
        return (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No steps added yet. Add your first step using the form.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {steps.map((step, index) => (
                <div key={step.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-gray-800">
                                {index + 1}. {step.title}
                            </h3>
                            <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleUpdateStepOrder(step.id, 'up')}
                                disabled={index === 0 || loading}
                                className={`p-1 rounded-full ${index === 0 || loading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                <FiArrowUp />
                            </button>
                            <button
                                onClick={() => handleUpdateStepOrder(step.id, 'down')}
                                disabled={index === steps.length - 1 || loading}
                                className={`p-1 rounded-full ${index === steps.length - 1 || loading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                <FiArrowDown />
                            </button>
                            <button
                                onClick={() => handleRemoveStep(step.id)}
                                disabled={loading}
                                className={`p-1 text-red-600 hover:bg-red-50 rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Courses in this step</h4>

                        {step.courses && step.courses.length > 0 ? (
                            <div className="space-y-2 mb-4">
                                {step.courses.map((course) => (
                                    <div key={course.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                        <div className="flex items-center">
                                            {course.banner && (
                                                <img
                                                    src={course.banner}
                                                    alt={course.title}
                                                    className="w-10 h-10 object-cover rounded mr-2"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium">{course.title}</div>
                                                <div className="text-xs text-gray-500">{course.level}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveCourse(step.id, course.id)}
                                            disabled={loading}
                                            className={`text-red-600 hover:text-red-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 mb-4">No courses added to this step yet.</p>
                        )}

                        {/* Add course to step */}
                        <div className="mt-2">
                            <label htmlFor={`course-${step.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                                Add a course to this step
                            </label>
                            <div className="flex space-x-2">
                                <select
                                    id={`course-${step.id}`}
                                    value={selectedStep === step.id ? (selectedCourse || '') : ''}
                                    onChange={(e) => {
                                        setSelectedStep(step.id);
                                        setSelectedCourse(Number(e.target.value) || null);
                                    }}
                                    disabled={loading}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                >
                                    <option value="">Select a course</option>
                                    {availableCourses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.title} {course.level?.name ? `(${course.level.name})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => {
                                        if (selectedStep === step.id && selectedCourse) {
                                            handleAddCourseToStep(step.id, selectedCourse);
                                        }
                                    }}
                                    disabled={!(selectedStep === step.id && selectedCourse) || loading}
                                    className={`bg-indigo-600 text-white px-3 py-2 rounded-md ${!(selectedStep === step.id && selectedCourse) || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                                >
                                    <FiPlus />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 