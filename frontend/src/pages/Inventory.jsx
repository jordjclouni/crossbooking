import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  VStack,
  List,
  ListItem,
  Button,
  Select,
  useToast,
  Spinner,
  useColorModeValue,
  Text,
  Box,
} from "@chakra-ui/react";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const API_INVENTORY = "http://127.0.0.1:5000/api/inventory";
const API_BOOKS = "http://127.0.0.1:5000/api/books";
const API_SHELVES = "http://127.0.0.1:5000/api/safeshelves";
const API_AUTHORS = "http://127.0.0.1:5000/api/authors";

const Inventory = () => {
  const [books, setBooks] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [authors, setAuthors] = useState([]); // Инициализируем пустым массивом
  const [loading, setLoading] = useState(true);
  const [selectedShelf, setSelectedShelf] = useState({}); // Выбранная ячейка для каждой книги
  const toast = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading, error } = useAuth();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    if (authLoading) return; // Ждём, пока данные авторизации загрузятся
    if (!user || !user.id) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, войдите в систему для просмотра инвентаря",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Получаем книги, полки и авторов
        const [inventoryResponse, shelvesResponse, authorsResponse] = await Promise.all([
          axios.get(`${API_INVENTORY}/${user.id}`),
          axios.get(API_SHELVES),
          axios.get(API_AUTHORS), // Загружаем авторов без параметров
        ]);
        setBooks(inventoryResponse.data.map((entry) => entry.book));
        setShelves(shelvesResponse.data);
        setAuthors(authorsResponse.data || []); // Убедимся, что authors — это массив
      } catch (inventoryError) {
        // Если API_INVENTORY недоступен, попробуем получить книги напрямую через Book
        try {
          const [booksResponse, shelvesResponse, authorsResponse] = await Promise.all([
            axios.get(API_BOOKS),
            axios.get(API_SHELVES),
            axios.get(API_AUTHORS), // Загружаем авторов
          ]);
          setBooks(
            booksResponse.data.filter(
              (book) => book.user_id === user.id && book.status === "in_hand"
            )
          );
          setShelves(shelvesResponse.data);
          setAuthors(authorsResponse.data || []); // Убедимся, что authors — это массив
        } catch (booksError) {
          toast({
            title: "Ошибка",
            description: "Не удалось загрузить ваш инвентарь",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          console.error("Ошибка загрузки инвентаря:", inventoryError, booksError);
          setBooks([]);
          setAuthors([]); // Устанавливаем пустой массив авторов в случае ошибки
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, user, toast, navigate]);

  const handleShelfChange = (bookId, shelfId) => {
    setSelectedShelf((prev) => ({
      ...prev,
      [bookId]: shelfId,
    }));
  };

  const releaseBook = async (bookId) => {
    const shelfId = selectedShelf[bookId];
    if (!shelfId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите безопасную ячейку для книги",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log("Отправка запроса на отпуск книги:", {
        user_id: user.id,
        status: "available",
        safe_shelf_id: parseInt(shelfId),
      });

      const response = await axios.put(`${API_BOOKS}/${bookId}/release`, {
        user_id: user.id,
        status: "available",
        safe_shelf_id: parseInt(shelfId), // Указываем выбранную ячейку
      });

      setBooks(books.filter((book) => book.id !== bookId));
      toast({
        title: "Книга отпущена",
        description: `Книга "${response.data.book.title}" отправлена в ячейку ${shelves.find((s) => s.id === parseInt(shelfId))?.name}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error || "Не удалось отпустить книгу";

      toast({
        title: "Ошибка",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Ошибка отпуска книги:", error, error.response?.data);
    }
  };

  if (loading || authLoading) {
    return (
      <Container maxW="600px" py={6} textAlign="center">
        <Spinner size="lg" color="teal.500" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="600px" py={6} textAlign="center">
        <Text color={textColor}>{error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="600px" py={6}>
      <Heading mb={4} color={textColor} textAlign="center">
        Мой инвентарь
      </Heading>

      <VStack
        spacing={4}
        align="stretch"
        bg={bgColor}
        p={6}
        borderRadius={8}
        borderWidth={1}
        borderColor={borderColor}
        boxShadow="md"
      >
        {books.length === 0 ? (
          <Text color={textColor}>У вас нет книг в инвентаре.</Text>
        ) : (
          <List spacing={3}>
            {books.map((book) => (
              <ListItem
                key={book.id}
                p={3}
                bg={useColorModeValue("gray.50", "gray.700")}
                borderRadius={4}
                borderWidth={1}
                borderColor={borderColor}
                _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
              >
                <Text color={textColor}>{book.title} (ISBN: {book.isbn})</Text>
                <Text color={textColor}>
                  Статус: {book.status || "Не указан"}
                </Text>
                <Text color={textColor}>
                  Автор: {book.author_id ? authors.find((a) => a.id === book.author_id)?.name || "Неизвестен" : "Неизвестен"}
                </Text>
                <Box mt={2}>
                  <Select
                    placeholder="Выберите ячейку"
                    value={selectedShelf[book.id] || ""}
                    onChange={(e) => handleShelfChange(book.id, e.target.value)}
                    bg={useColorModeValue("gray.100", "gray.600")}
                    color={textColor}
                    borderColor={borderColor}
                    _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                  >
                    {shelves.map((shelf) => (
                      <option key={shelf.id} value={shelf.id}>
                        {shelf.name} ({shelf.address})
                      </option>
                    ))}
                  </Select>
                </Box>
                <Button
                  colorScheme="teal"
                  onClick={() => releaseBook(book.id)}
                  size="sm"
                  mt={2}
                  _hover={{ bg: "teal.600" }}
                  isDisabled={!selectedShelf[book.id]}
                >
                  Отпустить книгу
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </VStack>
    </Container>
  );
};

export default Inventory;