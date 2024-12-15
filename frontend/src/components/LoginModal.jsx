import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Spinner,
} from "@chakra-ui/react";

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
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
        login(data.user, data.token); // Входим в систему и сохраняем данные
        localStorage.setItem("token", data.token); // Сохраняем токен в локальное хранилище
        toast({
          title: "Успешный вход",
          description: `Добро пожаловать, ${data.user.name}!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Закрыть модальное окно после успешного входа
      } else {
        toast({
          title: "Ошибка входа",
          description: data.error || "Неверный логин или пароль.",
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
