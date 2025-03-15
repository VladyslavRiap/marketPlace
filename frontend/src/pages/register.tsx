import { GetServerSideProps } from "next";
import api from "@/utils/api";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { registerUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbarContext } from "@/context/SnackBarContext";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", role: "buyer" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useSnackbarContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(registerUser(form)).unwrap();
      if (result) {
        router.push("/profile");
      }
    } catch (err: any) {
      showMessage(err || "Ошибка регистрации", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-2xl text-center font-bold mb-4">Регистрация</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="buyer">Покупатель</option>
          <option value="seller">Продавец</option>
        </select>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <button
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-300"
          type="submit"
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
      </form>
      <p className="text-center mt-4">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Войти
        </Link>
      </p>
    </motion.div>
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
