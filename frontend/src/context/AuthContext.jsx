import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для получения данных пользователя с токеном
  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        localStorage.removeItem("token"); // Очистка токена в случае ошибки
      }
    } catch (error) {
      console.error("Ошибка при получении данных пользователя", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // Проверка токена при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);  // Загружаем данные пользователя при наличии токена
    } else {
      setLoading(false);  // Если токена нет, устанавливаем флаг загрузки в false
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token); // Сохраняем токен
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Удаляем токен
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
