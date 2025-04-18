import { GetServerSideProps } from "next";
import api from "@/utils/api";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { registerUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbarContext } from "@/redux/context/SnackBarContext";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Button from "@/components/Button";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });
  const { showMessage } = useSnackbarContext();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let hasErrors = false;
    const newErrors = { name: false, email: false, password: false };

    if (!form.name) {
      newErrors.name = true;
      hasErrors = true;
      showMessage("Пожалуйста, введите ваше имя", "error");
    }

    if (!form.email || !validateEmail(form.email)) {
      newErrors.email = true;
      hasErrors = true;
      showMessage("Пожалуйста, введите корректный email", "error");
    }

    if (!form.password || form.password.length < 8) {
      newErrors.password = true;
      hasErrors = true;
      showMessage("Пароль должен содержать минимум 8 символов", "error");
    }

    setErrors(newErrors);

    if (hasErrors) {
      setLoading(false);
      return;
    }

    try {
      const result = await dispatch(registerUser(form)).unwrap();
      if (result) {
        showMessage("Регистрация прошла успешно!", "success");
        router.push("/profile");
      }
    } catch (err: any) {
      showMessage(err.message || "Ошибка регистрации", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="min-h-full flex">
      <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center">
        <div className="relative w-full h-3/4">
          <Image
            src="/images/auth-side-image.avif"
            alt="Registration"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
            priority
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center p-10 lg:py-56">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Create an account
            </h2>
            <p className="text-gray-600 mt-2">Enter your details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon
                    className={`h-5 w-5 ${
                      errors.name ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  placeholder="Name"
                  className={`pl-10 w-full p-3 border-b text-gray-700 focus:outline-none ${
                    errors.name
                      ? "border-red-500 focus:border-[#DB4444]"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => handleFocus("name")}
                />
              </div>

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
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      className="sr-only"
                      name="role"
                      value="buyer"
                      checked={form.role === "buyer"}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                    />
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        form.role === "buyer"
                          ? "border-[#DB4444]"
                          : "border-gray-400"
                      } flex items-center justify-center`}
                    >
                      {form.role === "buyer" && (
                        <div className="w-3 h-3 rounded-full bg-[#DB4444]"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-gray-700">Buyer</span>
                </label>

                <label className="inline-flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      className="sr-only"
                      name="role"
                      value="seller"
                      checked={form.role === "seller"}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                    />
                    <div
                      className={`w-5 h-5 rounded-full border ${
                        form.role === "seller"
                          ? "border-[#DB4444]"
                          : "border-gray-400"
                      } flex items-center justify-center`}
                    >
                      {form.role === "seller" && (
                        <div className="w-3 h-3 rounded-full bg-[#DB4444]"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-gray-700">Seller</span>
                </label>
              </div>
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              className="border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.667-4.146-2.668-6.735-2.668-5.523 0-10 4.477-10 10s4.477 10 10 10c8.396 0 10-7.524 10-10 0-0.67-0.069-1.325-0.189-1.961h-9.811z" />
              </svg>
              <span className="ml-2">Sign up with Google</span>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Log in
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
  } catch (error) {}

  return { props: {} };
};

export default RegisterPage;
