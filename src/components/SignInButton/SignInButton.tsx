import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

interface SignInButtonProps {
  className?: string;
}

const SignInButton = ({ className = "" }: SignInButtonProps) => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoggedIn) {
      logout();
      return;
    }

    navigate("/login");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white ${className}`}
    >
      {isLoggedIn ? "Logout" : "Sign In"}
    </button>
  );
};

export default SignInButton;