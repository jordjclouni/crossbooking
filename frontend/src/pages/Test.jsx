import React, { useState, useEffect } from "react";
import {
  Container,
  Text,
  Box,
  VStack,
  Input,
  Button,
  useToast,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import { EmailIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";

const API_SEND_EMAIL = "http://127.0.0.1:5000/api/send-email"; // Обновили эндпоинт
const API_BOOKS = "http://127.0.0.1:5000/api/books/available";
const API_SHELVES = "http://127.0.0.1:5000/api/safeshelves";

// Функции для работы с Cookie
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

const Test = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // Добавлено поле для сообщения
  const [savedEmailCookie, setSavedEmailCookie] = useState("");
  const [savedEmailLocalStorage, setSavedEmailLocalStorage] = useState("");
  const [availableBooks, setAvailableBooks] = useState([]);
  const [shelves, setShelves] = useState({});
  const [authors, setAuthors] = useState({}); // Добавлено для хранения списка авторов
  const [genres, setGenres] = useState({}); // Добавлено для хранения списка жанров
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchAvailableBooks(), fetchShelves(), fetchAuthors(), fetchGenres()])
      .catch((error) => {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error("Ошибка загрузки:", error);
      })
      .finally(() => setIsLoading(false));

    // Загрузка сохранённого email из Cookie и Local Storage
    const cookieEmail = getCookie("userEmail");
    if (cookieEmail) {
      setSavedEmailCookie(cookieEmail);
    }

    const localStorageEmail = localStorage.getItem("userEmail");
    if (localStorageEmail) {
      setSavedEmailLocalStorage(localStorageEmail);
    }
  }, []);

  const fetchAvailableBooks = async () => {
    try {
      const response = await axios.get(API_BOOKS);
      if (response.data && Array.isArray(response.data)) {
        setAvailableBooks(response.data);
      } else {
        throw new Error("Сервер вернул некорректные данные о книгах");
      }
    } catch (error) {
      throw new Error(
        `Не удалось загрузить список доступных книг: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const fetchShelves = async () => {
    try {
      const response = await axios.get(API_SHELVES);
      if (response.data && Array.isArray(response.data)) {
        const shelfMap = {};
        response.data.forEach((shelf) => {
          shelfMap[shelf.id] = shelf.name || "Не указано"; // Используем name вместо address для соответствия SearchBooks.jsx
        });
        setShelves(shelfMap);
      } else {
        throw new Error("Сервер вернул некорректные данные о ячейках");
      }
    } catch (error) {
      throw new Error(
        `Не удалось загрузить список ячеек: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/authors");
      const authorMap = {};
      response.data.forEach((author) => {
        authorMap[author.id] = author.name || "Неизвестен";
      });
      setAuthors(authorMap);
    } catch (error) {
      console.error("Ошибка загрузки авторов:", error);
      throw new Error("Не удалось загрузить авторов");
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/genres");
      const genreMap = {};
      response.data.forEach((genre) => {
        genreMap[genre.id] = genre.name || "Не указан";
      });
      setGenres(genreMap);
    } catch (error) {
      console.error("Ошибка загрузки жанров:", error);
      throw new Error("Не удалось загрузить жанры");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSaveEmail = () => {
    if (!email) {
      toast({
        title: "Ошибка",
        description: "Поле email не может быть пустым!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Ошибка",
        description: "Введите корректный email (например, example@domain.com)!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Сохранение в Cookie (на 7 дней)
    setCookie("userEmail", email, 7);
    setSavedEmailCookie(email);

    // Сохранение в Local Storage
    localStorage.setItem("userEmail", email);
    setSavedEmailLocalStorage(email);

    // Вывод введённых данных в "диалоговом окне" (toast)
    toast({
      title: "Данные сохранены",
      description: `Email: ${email}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleClearStorage = () => {
    // Очистка Cookie
    deleteCookie("userEmail");
    setSavedEmailCookie("");

    // Очистка Local Storage
    localStorage.removeItem("userEmail");
    setSavedEmailLocalStorage("");

    toast({
      title: "Данные очищены",
      description: "Cookie и Local Storage очищены",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSendEmail = async () => {
    if (!email || !message) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните email и сообщение",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Ошибка",
        description: "Введите корректный email (например, example@domain.com)!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Формируем список книг для отправки
      const booksToSend = availableBooks.map((book) => ({
        title: book.title,
        author: authors[book.author_id] || "Неизвестен",
        isbn: book.isbn || "Не указан",
        genres:
          book.genres
            .map((genreId) => genres[genreId])
            .filter(Boolean)
            .join(", ") || "Не указаны",
        shelf: shelves[book.safe_shelf_id] || "Не указано",
      }));

      const payload = {
        email: email,
        message: message,
        books: booksToSend,
      };

      const response = await axios.post(API_SEND_EMAIL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Успех",
        description: `Список книг успешно отправлен на ${email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log("Ответ сервера:", response.data);
      setEmail("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.error || "Не удалось отправить письмо",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Ошибка отправки письма:", error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="600px" py={6}>
      <Text fontSize="4xl" fontWeight="bold" mb={4}>
        Форма отправки списка книг
      </Text>

      <Box>
        <VStack spacing={3} align="stretch">
          <Input
            placeholder="Электронная почта получателя"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={isLoading}
          />
          <Textarea
            placeholder="Введите сообщение"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            isDisabled={isLoading}
          />
          <HStack spacing={3}>
            <Button
              colorScheme="purple"
              leftIcon={<EmailIcon />}
              onClick={handleSendEmail}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Отправить список книг
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSaveEmail}
              isDisabled={isLoading}
            >
              Сохранить email
            </Button>
            <Button
              colorScheme="red"
              leftIcon={<DeleteIcon />}
              onClick={handleClearStorage}
              isDisabled={isLoading}
            >
              Очистить хранилище
            </Button>
          </HStack>
          {savedEmailCookie && (
            <Text fontSize="sm" color="gray.600">
              Email из Cookie: {savedEmailCookie}
            </Text>
          )}
          {savedEmailLocalStorage && (
            <Text fontSize="sm" color="gray.600">
              Email из Local Storage: {savedEmailLocalStorage}
            </Text>
          )}
        </VStack>
      </Box>
    </Container>
  );
};

export default Test;