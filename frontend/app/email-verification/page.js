
const EmailVerification = () => {
    return (
        <div className="text-center">
            <h1>You have successfully registered your account</h1>
            <p>Please check your email for the verification link.</p>

            {/* Button to open Gmail app or Gmail web inbox */}
            <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
            >
            Gmail
            </a>
        </div>
    );
};

export default EmailVerification;
