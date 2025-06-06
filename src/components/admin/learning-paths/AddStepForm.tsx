'use client';

import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import learningPathApi from '@/api/axios/learningPathApi';

interface AddStepFormProps {
    learningPathId: number;
    onStepAdded: () => void;
    onError: (message: string) => void;
}

export default function AddStepForm({ learningPathId, onStepAdded, onError }: AddStepFormProps) {
    const [loading, setLoading] = useState(false);
    const [stepData, setStepData] = useState({ title: '', description: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setStepData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateStep = async () => {
        if (!stepData.title.trim()) {
            onError('Step title is required');
            return;
        }

        try {
            setLoading(true);

            // First create the step
            const response = await learningPathApi.createStep(stepData);

            if (response.data.statusCode === 201) {
                // Then add it to the learning path
                const stepData = response.data.data;
                const addResponse = await learningPathApi.addStepToLearningPath({
                    learningPathId: learningPathId,
                    stepId: stepData.id,
                    orderIndex: 9999 // Will be placed at the end
                });

                if (addResponse.data.statusCode === 201) {
                    // Reset form and notify parent
                    setStepData({ title: '', description: '' });
                    onStepAdded();
                } else {
                    onError('Failed to add step to learning path');
                }
            } else {
                onError(response.data.message || 'Failed to create step');
            }
        } catch (error: any) {
            console.error('Error creating step:', error);
            onError(error.response?.data?.message || 'An error occurred while creating the step');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Step</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Step Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={stepData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter step title"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Step Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={stepData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter step description"
                    />
                </div>

                <button
                    onClick={handleCreateStep}
                    disabled={loading || !stepData.title.trim()}
                    className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center ${(loading || !stepData.title.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <>
                            <span className="inline-block animate-spin mr-2">⟳</span> Adding...
                        </>
                    ) : (
                        <>
                            <FiPlus className="mr-2" /> Add Step
                        </>
                    )}
                </button>
            </div>
        </div>
    );
} 