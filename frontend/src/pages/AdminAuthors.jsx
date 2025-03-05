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
  Textarea,
  Spinner,
  useToast,
  Box,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://127.0.0.1:5000/api/authors";

const AdminAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: null, name: "", description: "" });
  const [search, setSearch] = useState("");
  const toast = useToast();
  const { logout } = useAuth(); // Получаем logout из контекста

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setAuthors(response.data);
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить авторов",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    try {
      const response = e.target.value
        ? await axios.get(`${API_URL}?search=${e.target.value}`)
        : await axios.get(API_URL);
      setAuthors(response.data);
    } catch (error) {
      toast({
        title: "Ошибка поиска",
        description: "Не удалось найти авторов",
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
        description: "Имя автора не может быть пустым!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, {
          name: form.name,
          description: form.description,
        });
        toast({ title: "Автор обновлен", status: "success", duration: 2000 });
      } else {
        await axios.post(API_URL, {
          name: form.name,
          description: form.description,
        });
        toast({ title: "Автор добавлен", status: "success", duration: 2000 });
      }

      setForm({ id: null, name: "", description: "" });
      fetchAuthors();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить автора",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого автора?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast({ title: "Автор удален", status: "info", duration: 2000 });
      fetchAuthors();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить автора",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
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
          <Heading mb={4}>Управление авторами</Heading>

          <VStack spacing={3} align="stretch">
            <Input
              placeholder="Поиск автора"
              value={search}
              onChange={handleSearch}
            />
            <Input
              placeholder="Имя автора"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <Textarea
              placeholder="Описание автора"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            <HStack>
              <Button colorScheme="blue" onClick={handleSubmit}>
                {form.id ? "Обновить" : "Добавить"}
              </Button>
              {form.id && (
                <Button colorScheme="gray" onClick={() => setForm({ id: null, name: "", description: "" })}>
                  Отмена
                </Button>
              )}
            </HStack>
          </VStack>

          {loading ? (
            <Spinner mt={6} />
          ) : (
            <List spacing={3} mt={6}>
              {authors.length > 0 ? (
                authors.map((author) => (
                  <ListItem
                    key={author.id}
                    p={2}
                    border="1px solid #ccc"
                    borderRadius="md"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Text fontWeight="bold">{author.name}</Text>
                    <Text fontSize="sm" color="gray.600">{author.description || "Нет описания"}</Text>
                    <HStack mt={2}>
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="yellow"
                        onClick={() => setForm({ id: author.id, name: author.name, description: author.description })}
                        aria-label="Редактировать"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => handleDelete(author.id)}
                        aria-label="Удалить"
                      />
                    </HStack>
                  </ListItem>
                ))
              ) : (
                <Text mt={4} color="gray.500">Авторы не найдены</Text>
              )}
            </List>
          )}
        </Container>
      </Box>
    </Flex>
  );
};

export default AdminAuthors;