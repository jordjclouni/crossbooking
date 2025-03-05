import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Box,
  Flex,
} from "@chakra-ui/react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@chakra-ui/react";

const AdminSafeShelves = () => {
  const [shelves, setShelves] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    address: "",
    hours: "",
    description: "",
    latitude: 53.669353, // Координаты по умолчанию (Гродно)
    longitude: 23.813131,
  });
  const apiKey = "6ad7e365-54e3-4482-81b5-bd65125aafbf"; // API-ключ Яндекс.Карт
  const { logout } = useAuth(); // Получаем logout из контекста
  const toast = useToast();

  useEffect(() => {
    fetchShelves();
  }, []);

  // Загрузка списка безопасных ячеек
  const fetchShelves = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/safeshelves");
      setShelves(response.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные о ячейках",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Обработчик клика по карте для установки координат
  const handleMapClick = (e) => {
    const coords = e.get("coords");
    setForm({ ...form, latitude: coords[0], longitude: coords[1] });
  };

  // Обработчик клика по метке для редактирования ячейки
  const handlePlacemarkClick = (shelf) => {
    setForm({ ...shelf });
  };

  // Обновление полей формы
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Добавление или обновление ячейки
  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`http://127.0.0.1:5000/api/safeshelves/${form.id}`, form);
        toast({
          title: "Ячейка обновлена",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await axios.post("http://127.0.0.1:5000/api/safeshelves", form);
        toast({
          title: "Ячейка добавлена",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      setForm({ id: null, name: "", address: "", hours: "", description: "", latitude: 53.669353, longitude: 23.813131 });
      fetchShelves();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить ячейку",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Удаление ячейки
  const handleDelete = async () => {
    if (!form.id) return;
    if (!window.confirm("Вы уверены, что хотите удалить эту ячейку?")) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/api/safeshelves/${form.id}`);
      toast({
        title: "Ячейка удалена",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      setForm({ id: null, name: "", address: "", hours: "", description: "", latitude: 53.669353, longitude: 23.813131 });
      fetchShelves();
    } catch (error) {
      console.error("Ошибка удаления:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить ячейку",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Очистка формы
  const handleClear = () => {
    setForm({ id: null, name: "", address: "", hours: "", description: "", latitude: 53.669353, longitude: 23.813131 });
  };

  // Обработчик выхода
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
        <Container maxW="1200px" py={6}>
          <Heading mb={4}>Управление безопасными ячейками</Heading>

          {/* Карта с метками */}
          <YMaps query={{ apikey: apiKey }}>
            <Map
              defaultState={{ center: [53.669353, 23.813131], zoom: 13 }}
              width="100%"
              height="400px"
              onClick={handleMapClick}
            >
              {shelves.map((shelf) => (
                <Placemark
                  key={shelf.id}
                  geometry={[shelf.latitude, shelf.longitude]}
                  properties={{ hintContent: shelf.name }}
                  options={{
                    preset: form.id === shelf.id ? "islands#redDotIcon" : "islands#blueDotIcon",
                  }}
                  onClick={() => handlePlacemarkClick(shelf)}
                />
              ))}
            </Map>
          </YMaps>

          {/* Форма для добавления/изменения ячеек */}
          <VStack mt={6} spacing={3} align="stretch">
            <Input placeholder="Название" name="name" value={form.name} onChange={handleChange} />
            <Input placeholder="Адрес" name="address" value={form.address} onChange={handleChange} />
            <Input placeholder="Часы работы" name="hours" value={form.hours} onChange={handleChange} />
            <Textarea placeholder="Описание" name="description" value={form.description} onChange={handleChange} />
            <HStack>
              <Input placeholder="Широта" name="latitude" value={form.latitude} onChange={handleChange} readOnly />
              <Input placeholder="Долгота" name="longitude" value={form.longitude} onChange={handleChange} readOnly />
            </HStack>
            <HStack mt={4}>
              <Button colorScheme="blue" onClick={handleSubmit}>
                {form.id ? "Обновить" : "Добавить"}
              </Button>
              {form.id && (
                <Button colorScheme="red" onClick={handleDelete}>
                  Удалить
                </Button>
              )}
              <Button colorScheme="gray" onClick={handleClear}>
                Очистить
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
};

export default AdminSafeShelves;