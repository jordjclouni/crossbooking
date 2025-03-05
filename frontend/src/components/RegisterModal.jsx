import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

const RegisterModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Очистка ошибок перед новой валидацией
  const validate = () => {
    const newErrors = {};
    setErrors({}); // <--- Сбрасываем ошибки перед проверкой

    if (!name.trim()) newErrors.name = "Имя не может быть пустым.";
    else if (name.trim().length < 2) newErrors.name = "Имя должно содержать минимум 2 символа.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email не может быть пустым.";
    else if (!emailRegex.test(email)) newErrors.email = "Введите корректный email.";

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password) newErrors.password = "Пароль не может быть пустым.";
    else if (!passwordRegex.test(password)) {
      newErrors.password = "Пароль должен содержать минимум 6 символов, включая букву, цифру и спецсимвол.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role_id: 2 }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Регистрация успешна!",
          description: `Добро пожаловать, ${data.name}!`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        // ✅ Автоматический вход после регистрации
        const loginResponse = await fetch("http://127.0.0.1:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("role_id", loginData.user.role_id);
          login(loginData.user, loginData.token);
        } else {
          toast({
            title: "Ошибка входа",
            description: loginData.error || "Не удалось войти после регистрации.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }

        setName("");
        setEmail("");
        setPassword("");
        onClose();
      } else {
        toast({
          title: "Ошибка регистрации",
          description: data.error || "Что-то пошло не так.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      toast({
        title: "Ошибка сети",
        description: "Не удалось подключиться к серверу. Попробуйте позже.",
        status: "error",
        duration: 4000,
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
        <ModalHeader>Регистрация</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Имя</FormLabel>
            <Input
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </FormControl>

          <FormControl mt={4} isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>

          <FormControl mt={4} isRequired isInvalid={!!errors.password}>
            <FormLabel>Пароль</FormLabel>
            <Input
              type="password"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
          </FormControl>

          <Button
            colorScheme="teal"
            mt={4}
            width="100%"
            onClick={handleRegister}
            isLoading={isLoading}
            loadingText="Регистрация..."
            isDisabled={isLoading}
          >
            Зарегистрироваться
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
