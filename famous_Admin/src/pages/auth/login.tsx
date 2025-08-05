import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

// Types
interface LoginData {
  email: string;
  password: string;
  twoFactorCode?: string;
}

interface SecurityState {
  failedAttempts: number;
  lastAttemptTime: number | null;
  isLocked: boolean;
}

const AdminLogin = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    twoFactorCode: "",
  });

  const [security, setSecurity] = useState<SecurityState>({
    failedAttempts: 0,
    lastAttemptTime: null,
    isLocked: false,
  });

  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const navigate = useNavigate();

  // Lockout timer effect
  useEffect(() => {
    if (security.isLocked && security.lastAttemptTime) {
      const lockoutDuration = 5 * 60 * 1000; // 5 minutes
      const timer = setTimeout(() => {
        setSecurity((prev) => ({
          ...prev,
          isLocked: false,
          failedAttempts: 0,
        }));
      }, lockoutDuration);

      return () => clearTimeout(timer);
    }
  }, [security.isLocked, security.lastAttemptTime]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  // Validate password strength
  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  };

  // Client-side hashing
  const hashPassword = (password: string): string => {
    return CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
  };

  // Rate limiting check
  const checkRateLimit = (): boolean => {
    const { failedAttempts, lastAttemptTime } = security;
    const now = Date.now();

    // More than 5 failed attempts in last 5 minutes
    if (
      failedAttempts >= 5 &&
      lastAttemptTime &&
      now - lastAttemptTime < 5 * 60 * 1000
    ) {
      setSecurity((prev) => ({
        ...prev,
        isLocked: true,
        lastAttemptTime: now,
      }));
      return true;
    }

    return false;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    if (errors[name as keyof LoginData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(loginData.password)) {
      newErrors.password =
        "Password must be at least 12 characters with uppercase, lowercase, numbers, and special characters";
    }

    if (requires2FA && !loginData.twoFactorCode) {
      newErrors.twoFactorCode = "2FA code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (security.isLocked) {
      alert(
        "Account temporarily locked due to too many failed attempts. Please try again later."
      );
      return;
    }

    if (checkRateLimit()) {
      alert("Too many failed attempts. Account locked for 5 minutes.");
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Client-side hashing before sending
      const hashedPassword = hashPassword(loginData.password);

      // Simulate API call
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: hashedPassword,
          twoFactorCode: loginData.twoFactorCode,
        }),
        credentials: "include", // For secure cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      // Reset security state on successful login
      setSecurity({
        failedAttempts: 0,
        lastAttemptTime: null,
        isLocked: false,
      });

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (error: any) {
      // Update security state on failed attempt
      setSecurity((prev) => ({
        failedAttempts: prev.failedAttempts + 1,
        lastAttemptTime: Date.now(),
        isLocked: prev.failedAttempts >= 4, // Lock after 5 attempts
      }));

      if (error.message.includes("2FA required")) {
        setRequires2FA(true);
      } else {
        alert(`Login failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {security.isLocked ? (
          <div className="text-red-500 text-center mb-4">
            Account temporarily locked. Please try again in 5 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                autoComplete="username"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {requires2FA && (
              <div className="mb-4">
                <label
                  htmlFor="twoFactorCode"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  2FA Code
                </label>
                <input
                  type="text"
                  id="twoFactorCode"
                  name="twoFactorCode"
                  value={loginData.twoFactorCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.twoFactorCode ? "border-red-500" : "border-gray-300"
                  }`}
                  autoComplete="one-time-code"
                />
                {errors.twoFactorCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.twoFactorCode}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading || security.isLocked}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isLoading || security.isLocked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#101828]"
                }`}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>

            {security.failedAttempts > 0 && !security.isLocked && (
              <div className="text-red-500 text-xs mt-2 text-center">
                {5 - security.failedAttempts} attempts remaining before lockout
              </div>
            )}
          </form>
        )}

       
      </div>
    </div>
  );
};

export default AdminLogin;