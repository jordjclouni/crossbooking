import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
  List,
  ListItem,
  Checkbox,
  Select,
  useToast,
  Spinner,
  useColorModeValue,
  Box,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BOOKS = "http://127.0.0.1:5000/api/books";
const API_AUTHORS = "http://127.0.0.1:5000/api/authors";
const API_SHELVES = "http://127.0.0.1:5000/api/safeshelves";
const API_GENRES = "http://127.0.0.1:5000/api/genres";
const API_INVENTORY = "http://127.0.0.1:5000/api/inventory"; // Новый эндпоинт для инвентаря

const AddBook = () => {
  const [form, setForm] = useState({
    title: "",
    author_id: "",
    description: "",
    safe_shelf_id: null,
    isbn: "",
    genre_ids: [],
    status: "in_hand", // По умолчанию книга у пользователя
  });

  const [authors, setAuthors] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      try {
        await Promise.all([fetchAuthors(), fetchShelves(), fetchGenres()]);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [authLoading]);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(API_AUTHORS);
      setAuthors(response.data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить авторов",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchShelves = async () => {
    try {
      const response = await axios.get(API_SHELVES);
      setShelves(response.data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить безопасные ячейки",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(API_GENRES);
      setGenres(response.data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить жанры",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value || (name === "safe_shelf_id" ? null : value) });
  };

  const handleGenreChange = (id) => {
    setForm((prevForm) => ({
      ...prevForm,
      genre_ids: prevForm.genre_ids.includes(id)
        ? prevForm.genre_ids.filter((g) => g !== id)
        : [...prevForm.genre_ids, id],
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.author_id || !form.isbn.trim() || !form.description.trim()) {
      toast({
        title: "Ошибка",
        description: "Название, автор, ISBN и описание обязательны!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!user || !user.id) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, войдите в систему, чтобы добавить книгу",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title,
        author_id: form.author_id,
        description: form.description,
        safe_shelf_id: null, // По умолчанию книга не в ячейке, а у пользователя
        user_id: user.id,
        isbn: form.isbn,
        genre_ids: form.genre_ids,
        status: form.status, // "in_hand" по умолчанию
      };

      // Добавляем книгу
      const bookResponse = await axios.post(API_BOOKS, payload);
      const bookId = bookResponse.data.book_id; // Предполагаем, что сервер возвращает book_id

      // Добавляем книгу в инвентарь пользователя
      await axios.post(API_INVENTORY, {
        user_id: user.id,
        book_id: bookId,
      });

      toast({
        title: "Книга добавлена!",
        description: "Книга добавлена в ваш инвентарь.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Сбрасываем форму
      setForm({
        title: "",
        author_id: "",
        description: "",
        safe_shelf_id: null,
        isbn: "",
        genre_ids: [],
        status: "in_hand",
      });
      navigate("/profile"); // Перенаправляем в профиль, чтобы увидеть книгу в инвентаре
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error || "Не удалось добавить книгу";
      if (status === 401) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, войдите в систему",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
      } else if (status === 400) {
        toast({
          title: "Ошибка",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (status === 403) {
        toast({
          title: "Ошибка",
          description: "Недостаточно прав",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Ошибка",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData || authLoading) {
    return (
      <Container maxW="600px" py={6} textAlign="center">
        <Spinner size="lg" color="teal.500" />
      </Container>
    );
  }

  return (
    <Container maxW="600px" py={6}>
      <Heading mb={4} color={textColor} textAlign="center">
        Добавить книгу
      </Heading>

      <VStack
        spacing={3}
        align="stretch"
        bg={bgColor}
        p={6}
        borderRadius={8}
        borderWidth={1}
        borderColor={borderColor}
        boxShadow="md"
      >
        <Input
          placeholder="Название книги"
          name="title"
          value={form.title}
          onChange={handleInputChange}
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
          borderColor={borderColor}
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
        />

        <Select
          placeholder="Выберите автора"
          name="author_id"
          value={form.author_id}
          onChange={handleInputChange}
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
          borderColor={borderColor}
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
        >
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </Select>

        <Textarea
          placeholder="Описание книги"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
          borderColor={borderColor}
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
        />

        <Input
          placeholder="ISBN книги"
          name="isbn"
          value={form.isbn}
          onChange={handleInputChange}
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
          borderColor={borderColor}
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
        />

        <Select
          name="status"
          value={form.status}
          onChange={handleInputChange}
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
          borderColor={borderColor}
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
          isDisabled={true} // Скрываем выбор статуса, так как по умолчанию "in_hand"
        >
          <option value="in_hand">У меня</option>
        </Select>

        <Heading size="sm" mt={2} color={textColor}>
          Выберите жанры:
        </Heading>
        <List spacing={2}>
          {genres.map((genre) => (
            <ListItem key={genre.id}>
              <Checkbox
                isChecked={form.genre_ids.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
                colorScheme="teal"
                color={textColor}
                borderColor={borderColor}
                _focus={{ boxShadow: "0 0 0 1px teal.500" }}
              >
                {genre.name}
              </Checkbox>
            </ListItem>
          ))}
        </List>

        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText="Добавление..."
          color="white"
          size="lg"
          width="full"
          mt={4}
          _hover={{ bg: "teal.600" }}
        >
          Добавить книгу
        </Button>
      </VStack>
    </Container>
  );
};

export default AddBook;