import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: req.headers.cookie || "", // Передаём куки клиента на бэкенд
        },
        body: JSON.stringify(req.body),
        credentials: "include", // Важно для работы с куками
      }
    );

    // Обрабатываем все куки из ответа бэкенда
    const cookies = apiRes.headers.get("set-cookie");
    if (cookies) {
      // Разделяем множественные куки и устанавливаем их все
      const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];
      cookiesArray.forEach((cookie) => {
        res.setHeader("Set-Cookie", cookie);
      });
    }

    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ message: "Internal proxy error" });
  }
}
