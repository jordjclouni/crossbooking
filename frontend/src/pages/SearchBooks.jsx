import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Text,
  Box,
  List,
  ListItem,
  Input,
  Select,
  HStack,
  Button,
  useToast,
  useColorModeValue,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import axios from "axios";
import { SearchIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BOOKS = "http://127.0.0.1:5000/api/books";
const API_AUTHORS = "http://127.0.0.1:5000/api/authors";
const API_SHELVES = "http://127.0.0.1:5000/api/safeshelves";
const API_GENRES = "http://127.0.0.1:5000/api/genres";
const API_INVENTORY = "http://127.0.0.1:5000/api/inventory";
const API_LOGIN = "http://127.0.0.1:5000/api/login";
const API_LOGOUT = "http://127.0.0.1:5000/api/logout";
const API_SEND_EMAIL = "http://127.0.0.1:5000/api/send-email";

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    author_id: "",
    safe_shelf_id: "",
    genre_id: "",
  });
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [emailData, setEmailData] = useState({
    email: "",
    message: "",
  });
  const refs = useRef([]);
  const apiKey = "6ad7e365-54e3-4482-81b5-bd65125aafbf";
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchBooks(),
          fetchAuthors(),
          fetchShelves(),
          fetchGenres(),
        ]);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchData();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `${API_BOOKS}?status=available&search=${filters.search}&author_id=${filters.author_id}&safe_shelf_id=${filters.safe_shelf_id}&genre_id=${filters.genre_id}`
      );
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error.response?.status === 500) {
        toast({
          title: "Ошибка сервера",
          description: "Не удалось загрузить книги. Пожалуйста, попробуйте позже.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Ошибка",
          description: error.response?.data?.error || "Не удалось загрузить книги",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      console.error("Ошибка загрузки книг:", error);
      setBooks([]);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(API_AUTHORS);
      setAuthors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Ошибка загрузки авторов:", error);
      setAuthors([]);
    }
  };

  const fetchShelves = async () => {
    try {
      const response = await axios.get(API_SHELVES);
      setShelves(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Ошибка загрузки полок:", error);
      setShelves([]);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(API_GENRES);
      setGenres(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Ошибка загрузки жанров:", error);
      setGenres([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchBooks();
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      author_id: "",
      safe_shelf_id: "",
      genre_id: "",
    });
    setSelectedBookId(null);
    fetchBooks();
  };

  const handleListItemClick = (id) => {
    setSelectedBookId(id);
    scrollToBook(id);
  };

  const handlePlacemarkClick = (bookId) => {
    setSelectedBookId(bookId);
    scrollToBook(bookId);
  };

  const scrollToBook = (id) => {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1 && refs.current[index]) {
      refs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const addToInventory = async (bookId) => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, войдите в систему, чтобы добавить книгу в инвентарь",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    try {
      await axios.post(API_INVENTORY, { book_id: bookId });
      toast({
        title: "Успех",
        description: "Книга добавлена в ваш инвентарь",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchBooks();
    } catch (error) {
      if (error.response?.status === 401) {
        toast({
          title: "Ошибка",
          description: "Пожалуйста, войдите в систему",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
      } else {
        toast({
          title: "Ошибка",
          description: error.response?.data?.error || "Не удалось добавить книгу в инвентарь",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      console.error("Ошибка добавления в инвентарь:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(API_LOGOUT);
      navigate("/login");
      toast({
        title: "Успех",
        description: "Вы вышли из системы",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из системы",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Ошибка выхода:", error);
    }
  };

  const handleEmailChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const sendEmailWithTable = async () => {
    if (!emailData.email || !emailData.message) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните email и сообщение",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Формируем список книг с полной информацией
    const booksToSend = books.map((book) => ({
      title: book.title,
      author: authors.find((a) => a.id === book.author_id)?.name || "Неизвестен",
      isbn: book.isbn,
      genres: book.genres
        .map((genreId) => genres.find((genre) => genre.id === genreId)?.name)
        .filter(Boolean)
        .join(", ") || "Не указаны",
      shelf: shelves.find((s) => s.id === book.safe_shelf_id)?.name || "Не указано",
    }));

    const payload = {
      email: emailData.email,
      message: emailData.message,
      books: booksToSend,
    };

    try {
      const response = await axios.post(API_SEND_EMAIL, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      toast({
        title: "Успех",
        description: "Письмо с таблицей успешно отправлено",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEmailData({ email: "", message: "" });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.error || "Не удалось отправить письмо",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Ошибка отправки email:", error);
    }
  };

  return (
    <Container maxW="1200px" my={4}>
      <Text fontSize="4xl" fontWeight="bold" mb={4} color={textColor}>
        Поиск книг
      </Text>

      

      <HStack spacing={3} mb={4}>
        <Input
          placeholder="Поиск по названию..."
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
        />
        <Select
          placeholder="Выберите автора"
          name="author_id"
          value={filters.author_id}
          onChange={handleFilterChange}
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
        >
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Выберите жанр"
          name="genre_id"
          value={filters.genre_id}
          onChange={handleFilterChange}
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
        >
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Выберите место хранения"
          name="safe_shelf_id"
          value={filters.safe_shelf_id}
          onChange={handleFilterChange}
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
        >
          {shelves.map((shelf) => (
            <option key={shelf.id} value={shelf.id}>
              {shelf.name}
            </option>
          ))}
        </Select>
        <Button
          colorScheme="blue"
          leftIcon={<SearchIcon />}
          onClick={handleSearch}
          bg={useColorModeValue("blue.500", "blue.300")}
          color="white"
          aria-label="Поиск"
        />
        <Button
          variant="outline"
          leftIcon={<CloseIcon />}
          onClick={resetFilters}
          color={textColor}
          borderColor={borderColor}
          aria-label="Сброс"
        />
      </HStack>

      <YMaps query={{ apikey: apiKey }}>
        <Map
          defaultState={{
            center: [53.669353, 23.813131],
            zoom: 13,
          }}
          width="100%"
          height="400px"
        >
          {shelves
            .filter((shelf) => shelf.latitude && shelf.longitude)
            .map((shelf) => {
              const booksOnShelf = books.filter(
                (book) => book.safe_shelf_id === shelf.id
              );
              if (booksOnShelf.length === 0) return null;
              return booksOnShelf.map((book) => (
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
                    preset:
                      selectedBookId === book.id
                        ? "islands#redDotIcon"
                        : "islands#greenDotIcon",
                  }}
                  onClick={() => handlePlacemarkClick(book.id)}
                />
              ));
            })}
        </Map>
      </YMaps>

      <Box mt={4}>
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          Кликните на маркер на карте или выберите книгу из списка!
        </Text>
      </Box>

      <Box mt={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Список книг
        </Text>
        <List spacing={3} mt={4} overflowY="auto" maxH="400px">
          {books.length === 0 ? (
            <Text color={textColor}>Книги не найдены</Text>
          ) : (
            books.map((book, index) => (
              <ListItem
                key={book.id}
                ref={(el) => (refs.current[index] = el)}
                p={4}
                borderWidth={1}
                borderColor={selectedBookId === book.id ? "teal.300" : borderColor}
                borderRadius="md"
                bg={selectedBookId === book.id ? "teal.700" : useColorModeValue("gray.800", "gray.700")}
                color="white"
                _hover={{
                  bg: "teal.600",
                  color: "white",
                }}
                onClick={() => handleListItemClick(book.id)}
              >
                <Text fontSize="lg" fontWeight="semibold" color="white">
                  {book.title}
                </Text>
                <Text color="white">
                  Автор: {authors.find((a) => a.id === book.author_id)?.name || "Неизвестен"}
                </Text>
                <Text color="white">ISBN: {book.isbn}</Text>
                <Text color="white">
                  Жанры:{" "}
                  {book.genres
                    .map((genreId) => genres.find((genre) => genre.id === genreId)?.name)
                    .filter(Boolean)
                    .join(", ") || "Не указаны"}
                </Text>
                <Text color="white">
                  Место хранения:{" "}
                  {shelves.find((s) => s.id === book.safe_shelf_id)?.name || "Не указано"}
                </Text>
                <Text fontSize="sm" color="white">
                  {book.description || "Описание отсутствует"}
                </Text>
                <Button
                  colorScheme="teal"
                  leftIcon={<AddIcon />}
                  mt={2}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToInventory(book.id);
                  }}
                  isDisabled={book.status !== "available"}
                >
                  Добавить в инвентарь
                </Button>
              </ListItem>
            ))
          )}
        </List>
      </Box>

      <Box mt={6} p={4} borderWidth={1} borderRadius="md" borderColor={borderColor}>
        <Text fontSize="xl" fontWeight="bold" mb={4} color={textColor}>
          Отправить список книг на email
        </Text>
        <VStack spacing={4}>
          <Input
            placeholder="Введите email"
            name="email"
            value={emailData.email}
            onChange={handleEmailChange}
            bg={useColorModeValue("gray.100", "gray.600")}
            color={textColor}
          />
          <Textarea
            placeholder="Введите сообщение"
            name="message"
            value={emailData.message}
            onChange={handleEmailChange}
            bg={useColorModeValue("gray.100", "gray.600")}
            color={textColor}
          />
          <Button
            colorScheme="teal"
            onClick={sendEmailWithTable}
            isDisabled={books.length === 0}
          >
            Отправить таблицу на email
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default SearchBooks;