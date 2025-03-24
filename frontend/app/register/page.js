'use client';

import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { createUser } from '@/utils/users';
// import { createUser } from '@/utils/fetchUser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const RegisterPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const { confirmPassword, ...userData } = data; // Remove confirmPassword before sending to API
            const response = await createUser(JSON.stringify(userData));

            if (response.ok) {
                const responseData = await response.json();

                if (responseData.success) {
                    reset();
                    router.push('/email-verification');
                } else {
                    setErrorMessage(responseData.message);
                }
            } else {
                throw new Error('Failed to register user');
            }
        } catch (error) {
            console.error('Failed to register user.', error);
        }
    };

    return (
        <div>
            <div className="container">
                <div className="max-w-xl px-8 py-10 mx-auto mt-10 bg-white border border-gray-400 rounded-xl">
                    <h2 className="mb-4 text-3xl font-semibold text-gray-800">
                        Register User
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-3">
                            <InputField
                                label="First Name"
                                name="firstName"
                                placeholder="Enter your first name"
                                register={register}
                                errors={errors}
                                validation={{
                                    required: 'First name is required',
                                    minLength: {
                                        value: 2,
                                        message:
                                            'First name must be at least 2 characters',
                                    },
                                }}
                            />
                            <InputField
                                label="Last Name"
                                name="lastName"
                                placeholder="Enter your last name"
                                register={register}
                                errors={errors}
                                validation={{
                                    required: 'Last name is required',
                                    minLength: {
                                        value: 2,
                                        message:
                                            'Last name must be at least 2 characters',
                                    },
                                }}
                            />
                            <InputField
                                label="Email"
                                name="email"
                                placeholder="Enter email address"
                                register={register}
                                errors={errors}
                                validation={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email format',
                                    },
                                }}
                            />
                            <InputField
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter password"
                                register={register}
                                errors={errors}
                                validation={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message:
                                            'Password must be at least 8 characters',
                                    },
                                }}
                            />
                            <InputField
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                register={register}
                                errors={errors}
                                validation={{
                                    required: 'Confirm password is required',
                                    validate: (value) =>
                                        value === watch('password') ||
                                        'Passwords do not match',
                                }}
                            />
                        </div>
                        <Button
                            variant="default"
                            type="submit"
                            className="mt-5"
                        >
                            Submit
                        </Button>
                        {errorMessage && (
                            <p className="text-red-500">{errorMessage}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
