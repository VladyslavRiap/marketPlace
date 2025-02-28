const Custom404 = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold">404 – Страница не найдена</h1>
      <p className="mt-4">Запрашиваемая страница не существует.</p>
      <a href="/" className="text-blue-600 hover:underline mt-6 inline-block">
        Вернуться на главную
      </a>
    </div>
  );
};

export default Custom404;
