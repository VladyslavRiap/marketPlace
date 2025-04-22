import { GetServerSideProps } from "next";
import api from "@/utils/api";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser, fetchUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import Button from "@/components/Button";

const LoginPage = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [errors, setErrors] = useState({ email: false, password: false });
  const { showMessage } = useSnackbarContext();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let hasErrors = false;
    const newErrors = { email: false, password: false };

    if (!form.email || !validateEmail(form.email)) {
      newErrors.email = true;
      hasErrors = true;
      showMessage("Please enter a valid email", "error");
    }

    if (!form.password) {
      newErrors.password = true;
      hasErrors = true;
      showMessage("Please enter your password", "error");
    }

    setErrors(newErrors);

    if (hasErrors) {
      setLoading(false);
      return;
    }

    try {
      const result = await dispatch(loginUser(form)).unwrap();
      if (result) {
        await dispatch(fetchUser());
        showMessage("Login successful!", "success");
      }
    } catch (err: any) {
      showMessage(err || "Login error. Please check your details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex">
      <div className="hidden md:flex w-1/2  items-center justify-center">
        <div className="relative w-full h-3/4">
          <Image
            src="/images/auth-side-image.avif"
            alt="Login"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
            priority
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center p-10 lg:py-56 lg:pb-[327px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Log in to</h2>
            <p className="text-gray-600 mt-2">Enter your details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className={`h-5 w-5 ${
                      errors.email ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  placeholder="Email"
                  className={`pl-10 w-full p-3 border-b text-gray-700 focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:border-[#DB4444]"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => handleFocus("email")}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 ${
                      errors.password ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className={`pl-10 w-full p-3 border-b text-gray-700 focus:outline-none ${
                    errors.password
                      ? "border-red-500 focus:border-[#DB4444]"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onFocus={() => handleFocus("password")}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-[#DB4444] hover:text-[#E07575] hover:underline"
              >
                Forget Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              fullWidth
              disabled={loading}
              className="rounded-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#DB4444] hover:text-[#E07575] font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const { data } = await api.get("/users/me", {
      headers: { cookie: req.headers.cookie || "" },
    });

    if (data) {
      return {
        redirect: {
          destination: "/profile",
          permanent: false,
        },
      };
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { props: { isAuthenticated: false } };
    }
    return { props: { isAuthenticated: false } };
  }

  return { props: { isAuthenticated: false } };
};

export default LoginPage;
