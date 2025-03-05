// src/pages/MapBooks.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Button,
  Checkbox,
  useToast,
  useColorModeValue, // Добавлен импорт
} from "@chakra-ui/react";
import axios from "axios";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useNavigate } from "react-router-dom";
import { CheckIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const API_BOOKS_AVAILABLE = "http://127.0.0.1:5000/api/books/available";
const API_BOOKS_RESERVE = "http://127.0.0.1:5000/api/books/reserve";
const API_BOOKS_TAKE = "http://127.0.0.1:5000/api/books/take";

const MapBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const token = localStorage.getItem("token") || "";
  const toast = useToast();
  const navigate = useNavigate();
  const apiKey = "6ad7e365-54e3-4482-81b5-bd65125aafbf"; // Ваш API-ключ Яндекс.Карт
  const bgColor = useColorModeValue("white", "gray.800"); // Используем хук
  const textColor = useColorModeValue("gray.800", "white"); // Используем хук
  const borderColor = useColorModeValue("gray.200", "gray.700"); // Используем хук

  useEffect(() => {
    fetchBooks();
  }, [token]);

  const fetchBooks = async () => {
    if (!token) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, войдите в систему",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(API_BOOKS_AVAILABLE, {
        headers: { Authorization: token },
      });
      setBooks(response.data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить доступные книги",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Ошибка загрузки книг:", error);
    }
  };

  const toggleBookSelection = (bookId) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const reserveBooks = async () => {
    if (selectedBooks.length === 0) {
      toast({
        title: "Ошибка",
        description: "Выберите хотя бы одну книгу",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post(
        API_BOOKS_RESERVE,
        { book_ids: selectedBooks },
        { headers: { Authorization: token } }
      );
      toast({
        title: "Успех",
        description: "Книги зарезервированы",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedBooks([]);
      fetchBooks(); // Обновляем список книг
      navigate("/inventory"); // Переходим в инвентарь
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.error || "Не удалось зарезервировать книги",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Ошибка резервирования книг:", error);
    }
  };

  const takeBooks = async () => {
    if (selectedBooks.length === 0) {
      toast({
        title: "Ошибка",
        description: "Выберите хотя бы одну книгу",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post(
        API_BOOKS_TAKE,
        { book_ids: selectedBooks },
        { headers: { Authorization: token } }
      );
      toast({
        title: "Успех",
        description: "Книги успешно забраны",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedBooks([]);
      fetchBooks(); // Обновляем список книг
      navigate("/inventory"); // Переходим в инвентарь
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.error || "Не удалось забрать книги",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Ошибка забора книг:", error);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Box p={8} borderRadius={8} boxShadow="lg" bg={bgColor} borderWidth={1} borderColor={borderColor}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" color={textColor}>
            Книги на карте
          </Heading>
          {books.length === 0 ? (
            <Text color={textColor}>
              Нет доступных книг. Попробуйте позже.
            </Text>
          ) : (
            <>
              <YMaps query={{ apikey: apiKey }}>
                <Map
                  defaultState={{
                    center: [53.669353, 23.813131], // Центр карты: Гродно (или другой регион СНГ)
                    zoom: 13,
                  }}
                  width="100%"
                  height="400px"
                >
                  {books.map((book) => {
                    const shelf = book.shelf_location;
                    if (shelf && shelf.latitude && shelf.longitude) {
                      return (
                        <Placemark
                          key={book.id}
                          geometry={[shelf.latitude, shelf.longitude]}
                          properties={{
                            balloonContent: `
                              <strong>${book.title}</strong><br/>
                              ISBN: ${book.isbn}<br/>
                              Ячейка: ${shelf.name}<br/>
                              Адрес: ${shelf.address}
                            `,
                            hintContent: book.title,
                          }}
                          options={{
                            preset: "islands#greenDotIcon",
                            iconColor: selectedBooks.includes(book.id) ? "#FF0000" : "#00FF00",
                          }}
                          modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                        />
                      );
                    }
                    return null;
                  })}
                </Map>
              </YMaps>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                {books.map((book) => (
                  <Box
                    key={book.id}
                    p={4}
                    borderRadius={8}
                    boxShadow="md"
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderWidth={1}
                    borderColor={borderColor}
                  >
                    <Text fontWeight="bold" color={textColor}>
                      {book.title}
                    </Text>
                    <Text color={textColor}>
                      ISBN: {book.isbn}
                    </Text>
                    <Text color={textColor}>
                      Ячейка: {book.shelf_location?.name || "Не указано"}
                    </Text>
                    <Checkbox
                      mt={2}
                      isChecked={selectedBooks.includes(book.id)}
                      onChange={() => toggleBookSelection(book.id)}
                      colorScheme="teal"
                    >
                      Выбрать для забора
                    </Checkbox>
                  </Box>
                ))}
              </SimpleGrid>

              <HStack spacing={4} mt={4} justify="center">
                <Button
                  colorScheme="teal"
                  size="lg"
                  leftIcon={<CheckIcon />}
                  onClick={reserveBooks}
                  isDisabled={selectedBooks.length === 0}
                >
                  Зарезервировать книги
                </Button>
                <Button
                  colorScheme="green"
                  size="lg"
                  leftIcon={<CheckIcon />}
                  onClick={takeBooks}
                  isDisabled={selectedBooks.length === 0}
                >
                  Забрать книги
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </Box>
    </Container>
  );
};

export default MapBooks;