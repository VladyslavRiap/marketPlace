import { GetServerSideProps } from "next";
import api from "@/utils/api";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser, fetchUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbarContext } from "@/context/SnackBarContext";
import { cookies } from "next/headers";

const LoginPage = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(loginUser(form)).unwrap();
      if (result) {
        await dispatch(fetchUser());
      }
    } catch (err: any) {
      showMessage(err || "Ошибка входа", "error");
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="container mx-auto p-6">Проверка аутентификации...</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl text-center font-bold mb-4">Вход</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          type="submit"
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </form>
      <p className="text-center mt-4">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Зарегистрируйтесь
        </Link>
      </p>
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

  return { props: { isAuthenticated: false } };
};

export default LoginPage;
