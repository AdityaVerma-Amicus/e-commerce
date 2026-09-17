interface SignInButtonProps {
    className?: string;
}

const SignInButton = ({ className = "" }: SignInButtonProps) => {
    return (
        <button
            type="button"
            className={`rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white ${className}`}
        >
            Sign In
        </button>
    );
};

export default SignInButton;