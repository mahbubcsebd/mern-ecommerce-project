'use client';

import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { login } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Validation Schema
const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
});

const LoginForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onChange', // Validate on change
    });

    const onSubmit = async (data) => {
        // Reset previous error states
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            const responseData = await login(data);

            if (responseData.success) {
                // Clear form
                reset();

                // Redirect to profile
                router.push('/dashboard/profile');
            } else {
                // Set specific error message from server
                setErrorMessage(
                    responseData.message || 'Login failed. Please try again.'
                );
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(
                error.message ||
                    'An unexpected error occurred. Please try again.'
            );
        } finally {
            // Always reset submitting state
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <div className="space-y-4">
                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        register={register}
                        errors={errors}
                        disabled={isSubmitting}
                    />
                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        register={register}
                        errors={errors}
                        disabled={isSubmitting}
                    />

                    {errorMessage && (
                        <div
                            className="
                                bg-red-50
                                border
                                border-red-300
                                text-red-600
                                px-4
                                py-3
                                rounded
                                relative
                            "
                            role="alert"
                        >
                            {errorMessage}
                        </div>
                    )}

                    <Button
                        variant="default"
                        type="submit"
                        className="w-full mt-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>

                    <div className="text-center mt-4">
                        <a
                            href="/forgot-password"
                            className="text-blue-500 hover:underline text-sm"
                        >
                            Forgot Password?
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
