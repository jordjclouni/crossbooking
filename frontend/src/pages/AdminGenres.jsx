import React, { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Input,
  Button,
  VStack,
  HStack,
  List,
  ListItem,
  IconButton,
  Text,
  Spinner,
  useToast,
  Box,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://127.0.0.1:5000/api/genres";

const AdminGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: null, name: "" });
  const [search, setSearch] = useState("");
  const toast = useToast();
  const { logout } = useAuth(); // Получаем logout из контекста

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setGenres(response.data);
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить жанры",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, name: e.target.value });
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    try {
      const response = e.target.value
        ? await axios.get(`${API_URL}/search?name=${e.target.value}`)
        : await axios.get(API_URL);
      setGenres(response.data);
    } catch (error) {
      toast({
        title: "Ошибка поиска",
        description: "Не удалось найти жанры",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Название жанра не может быть пустым!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, { name: form.name });
        toast({ title: "Жанр обновлен", status: "success", duration: 2000 });
      } else {
        await axios.post(API_URL, { name: form.name });
        toast({ title: "Жанр добавлен", status: "success", duration: 2000 });
      }

      setForm({ id: null, name: "" });
      fetchGenres();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить жанр",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот жанр?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast({ title: "Жанр удален", status: "info", duration: 2000 });
      fetchGenres();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить жанр",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // Используем logout из AuthContext
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
    }
  };

  return (
    <Flex minH="100vh">
      {/* Боковое меню */}
      <Box width="250px" bg="gray.100" p="4" minH="100vh">
        <Heading size="md" mb="4">
          Админ-панель
        </Heading>
        <VStack align="start" spacing="4">
          <Button as={Link} to="/admin/safe-shelves" colorScheme="blue" variant="ghost">
            Безопасные ячейки
          </Button>
          <Button as={Link} to="/admin/genres" colorScheme="blue" variant="ghost">
            Жанры
          </Button>
          <Button as={Link} to="/admin/authors" colorScheme="blue" variant="ghost">
            Авторы
          </Button>
          <Button as={Link} to="/admin/books" colorScheme="blue" variant="ghost">
            Книги
          </Button>
          <Button colorScheme="red" onClick={handleLogout}>
            Выйти
          </Button>
        </VStack>
      </Box>

      {/* Основное содержимое */}
      <Box flex="1" p="6">
        <Container maxW="600px" py={6}>
          <Heading mb={4}>Управление жанрами</Heading>

          <VStack spacing={3} align="stretch">
            <Input
              placeholder="Поиск по жанру"
              value={search}
              onChange={handleSearch}
            />
            <Input
              placeholder="Название жанра"
              value={form.name}
              onChange={handleChange}
            />
            <HStack>
              <Button colorScheme="blue" onClick={handleSubmit}>
                {form.id ? "Обновить" : "Добавить"}
              </Button>
              {form.id && (
                <Button colorScheme="gray" onClick={() => setForm({ id: null, name: "" })}>
                  Отмена
                </Button>
              )}
            </HStack>
          </VStack>

          {loading ? (
            <Spinner mt={6} />
          ) : (
            <List spacing={3} mt={6}>
              {genres.length > 0 ? (
                genres.map((genre) => (
                  <ListItem
                    key={genre.id}
                    p={2}
                    border="1px solid #ccc"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text>{genre.name}</Text>
                    <HStack>
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="yellow"
                        onClick={() => setForm({ id: genre.id, name: genre.name })}
                        aria-label="Редактировать"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => handleDelete(genre.id)}
                        aria-label="Удалить"
                      />
                    </HStack>
                  </ListItem>
                ))
              ) : (
                <Text mt={4} color="gray.500">Жанры не найдены</Text>
              )}
            </List>
          )}
        </Container>
      </Box>
    </Flex>
  );
};

export default AdminGenres;