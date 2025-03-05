import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите email и пароль.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;

        // Сохраняем токен и роль пользователя в localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role_id", user.role_id);

        login(user, token); // Авторизация пользователя в контексте

        toast({
          title: "Успешный вход",
          description: `Добро пожаловать, ${user.name}!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        onClose(); // Закрываем модальное окно

        // Перенаправление в зависимости от роли пользователя
        if (user.role_id === 1) {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      } else {
        let errorMessage = "Ошибка входа. Проверьте данные.";
        if (response.status === 401) errorMessage = "Неверный пароль.";
        if (response.status === 403) errorMessage = "Недостаточно прав для входа.";

        toast({
          title: "Ошибка входа",
          description: data.error || errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      toast({
        title: "Ошибка сервера",
        description: "Не удалось подключиться к серверу. Попробуйте позже.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Вход в систему</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Пароль</FormLabel>
            <Input
              type="password"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button
            colorScheme="teal"
            mt={4}
            width="100%"
            onClick={handleLogin}
            isLoading={isLoading}
            loadingText="Вход..."
          >
            Войти
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
