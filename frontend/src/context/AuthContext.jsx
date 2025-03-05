import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние для ошибок

  // Загружаем пользователя из localStorage при старте
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser); // Устанавливаем user сразу, если данные есть
        } else {
          setUser(null);
        }
      } catch (parseError) {
        setUser(null);
        localStorage.removeItem("user");
        setError("Ошибка загрузки данных авторизации.");
      } finally {
        setLoading(false); // Завершаем загрузку, даже если данных нет
      }
    };

    loadAuthData();
  }, []);

  // Функция входа: сохраняем пользователя
  const login = (userData) => {
    setUser(userData);
    setError(null);
    localStorage.setItem("user", JSON.stringify(userData)); // Сохраняем user
  };

  // Функция выхода: удаляем данные
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading, // Добавляем loading в контекст
    error, // Добавляем error в контекст
    login,
    logout,
  };

  if (loading) {
    return null; // Или можно вернуть Spinner для UI
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};