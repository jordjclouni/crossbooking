import React, { useState } from "react";
import { Box, Text, Button, Container } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext"; // Путь должен быть относительно текущего местоположения файла
import RegisterBookModal from "../components/RegisterBookModal"; // Импортируем компонент модального окна для регистрации книги

const UserProfile = () => {
  const { user, logout } = useAuth(); // Получаем данные пользователя
  const [isRegisterBookOpen, setIsRegisterBookOpen] = useState(false); // Состояние для открытия модального окна

  const openRegisterBookModal = () => setIsRegisterBookOpen(true);
  const closeRegisterBookModal = () => setIsRegisterBookOpen(false);

  if (!user) {
    return <Text>Вы не авторизованы. Пожалуйста, войдите в систему.</Text>;
  }

  return (
    <Container maxW="600px" mt={8}>
      <Text fontSize="2xl" fontWeight="bold">Личный кабинет</Text>
      <Box mt={4} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Text fontSize="lg"><strong>Имя:</strong> {user.name}</Text>
        <Text fontSize="lg"><strong>Email:</strong> {user.email}</Text>
      </Box>
      <Box mt={4}>
        {/* Кнопка для открытия модального окна */}
        <Button colorScheme="teal" mr={2} onClick={openRegisterBookModal}>
          Зарегистрировать книгу
        </Button>
        <Button colorScheme="teal">
          Найти книги
        </Button>
      </Box>
      <Box mt={4}>
        <Button colorScheme="red" onClick={logout}>
          Выйти
        </Button>
      </Box>

      {/* Модальное окно для регистрации книги */}
      <RegisterBookModal isOpen={isRegisterBookOpen} onClose={closeRegisterBookModal} />
    </Container>
  );
};

export default UserProfile;
