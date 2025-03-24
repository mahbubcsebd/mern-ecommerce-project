import LoginForm from '@/components/LoginForm';

const LoginPage = () => {
    return (
        <div>
            <div className="container">
                <div className="grid h-screen items-center justify-center w-full">
                    <div className="w-[350px]">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
