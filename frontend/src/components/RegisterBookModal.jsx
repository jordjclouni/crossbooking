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
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";

const RegisterBookModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
  });
  const toast = useToast();

  // Обработчик изменений ввода
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик регистрации книги
  const handleRegisterBook = async () => {
    const { title, author, genre, description } = formData;

    // Проверка, что все поля заполнены
    if (!title || !author || !genre || !description) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Отправка данных на сервер
      const response = await fetch("http://127.0.0.1:5000/api/add_book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, genre, description }),
      });

      const data = await response.json();

      // Если запрос успешен
      if (response.ok) {
        toast({
          title: "Успех",
          description: "Книга успешно добавлена!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFormData({
          title: "",
          author: "",
          genre: "",
          description: "",
        });
        onClose();
      } else {
        // Ошибка с сервера
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
        <ModalHeader>Регистрация книги</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired>
            <FormLabel>Название книги</FormLabel>
            <Input
              name="title"
              placeholder="Введите название книги"
              value={formData.title}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Автор</FormLabel>
            <Input
              name="author"
              placeholder="Введите имя автора"
              value={formData.author}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Жанр</FormLabel>
            <Input
              name="genre"
              placeholder="Введите жанр книги"
              value={formData.genre}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Описание</FormLabel>
            <Textarea
              name="description"
              placeholder="Введите описание книги"
              value={formData.description}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button
            colorScheme="teal"
            mt={4}
            width="100%"
            onClick={handleRegisterBook}
          >
            Зарегистрировать книгу
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RegisterBookModal;
