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

const RegisterModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useToast();

  // Валидация всех полей
  const validate = () => {
    const newErrors = {};

    // Проверка имени
    if (!name.trim()) {
      newErrors.name = "Имя не может быть пустым.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Имя должно содержать хотя бы 2 символа.";
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email не может быть пустым.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Введите корректный email.";
    }

    // Проверка пароля
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password) {
      newErrors.password = "Пароль не может быть пустым.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Пароль должен содержать минимум 6 символов, включая букву, цифру и специальный символ.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Возвращает true, если ошибок нет
  };

  const handleRegister = async () => {
    if (!validate()) {
      return; // Если валидация не пройдена, не продолжаем регистрацию
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Успех",
          description: "Вы успешно зарегистрировались!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setName("");
        setEmail("");
        setPassword("");
        onClose();
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Что-то пошло не так",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось связаться с сервером",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={4} isRequired isInvalid={!!errors.password}>
            <FormLabel>Пароль</FormLabel>
            <Input
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            {errors.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormControl>
          <Button
            colorScheme="teal"
            mt={4}
            width="100%"
            onClick={handleRegister}
          >
            Зарегистрироваться
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
