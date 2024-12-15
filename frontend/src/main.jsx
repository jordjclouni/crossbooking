import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // Импортируем AuthProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider> {/* Оборачиваем приложение в AuthProvider для работы с аутентификацией */}
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
