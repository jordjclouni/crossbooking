import React, { useState, useEffect, useRef } from "react";
import { Container, Text, Box, List, ListItem } from "@chakra-ui/react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import axios from "axios";

const place = () => {
  const [safeCells, setSafeCells] = useState([]); // Состояние для безопасных ячеек
  const [selectedCellId, setSelectedCellId] = useState(null); // Состояние для отслеживания выбранной ячейки
  const refs = useRef([]); // Массив рефов для каждой ячейки
  const apiKey = "6ad7e365-54e3-4482-81b5-bd65125aafbf"; // Ваш API-ключ Яндекс.Карт

  // Функция для загрузки данных о безопасных ячейках из API
  const fetchSafeCells = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/safeshelves");
      setSafeCells(response.data); // Обновляем состояние безопасных ячеек
    } catch (error) {
      console.error("Ошибка при загрузке данных о безопасных ячейках:", error);
    }
  };

  // Загружаем безопасные ячейки при монтировании компонента
  useEffect(() => {
    fetchSafeCells();
  }, []);

  // Обработчик для выбора ячейки из списка
  const handleListItemClick = (id) => {
    setSelectedCellId(id); // Устанавливаем ID выбранной ячейки
    scrollToCell(id); // Прокручиваем к ячейке
  };

  // Обработчик для клика по метке на карте
  const handlePlacemarkClick = (id) => {
    setSelectedCellId(id); // Устанавливаем ID выбранной ячейки при клике на метку
    scrollToCell(id); // Прокручиваем к ячейке
  };

  // Функция для прокрутки к выбранной ячейке
  const scrollToCell = (id) => {
    const index = safeCells.findIndex((cell) => cell.id === id);
    if (index !== -1 && refs.current[index]) {
      refs.current[index].scrollIntoView({
        behavior: "smooth", // Плавная прокрутка
        block: "center", // Размещаем ячейку в центре экрана
      });
    }
  };

  return (
    <Container maxW="1200px" my={4}>
      <Text fontSize="4xl" fontWeight="bold" mb={4}>
        Безопасные ячейки для книг
      </Text>

      <YMaps query={{ apikey: apiKey }}>
        <Map
          defaultState={{
            center: [53.669353, 23.813131], // Центр карты: Гродно
            zoom: 13,
          }}
          width="100%"
          height="400px"
        >
          {safeCells.map((cell) => (
            <Placemark
              key={cell.id}
              geometry={[cell.latitude, cell.longitude]} // Используем координаты из API
              properties={{
                balloonContent: `<strong>${cell.name}</strong><br/>Безопасное место для книг.`,
                hintContent: cell.name,
              }}
              options={{
                preset: selectedCellId === cell.id ? "islands#redDotIcon" : "islands#greenDotIcon", // Подсветка метки
              }}
              onClick={() => handlePlacemarkClick(cell.id)} // При клике на метку
            />
          ))}
        </Map>
      </YMaps>

      <Box mt={4}>
        <Text fontSize="lg">
          Кликните на маркер на карте или выберите ячейку из списка!
        </Text>
      </Box>

      <Box mt={4}>
        <Text fontSize="xl" fontWeight="bold">Список безопасных ячеек</Text>
        <List spacing={3} mt={4} overflowY="auto" maxH="400px">
          {safeCells.map((cell, index) => (
          <ListItem
            key={cell.id}
            ref={(el) => (refs.current[index] = el)} // Присваиваем реф для текущей ячейки
            p={4}
            borderWidth={1}
            borderColor={selectedCellId === cell.id ? "teal.300" : "gray.600"} // Граница подсвечивается для выбранной ячейки
            borderRadius="md"
            bg={selectedCellId === cell.id ? "teal.700" : "gray.800"} // Подсветка фона для выбранной ячейки
            color={selectedCellId === cell.id ? "white" : "gray.300"} // Цвет текста: белый или менее насыщенный серый
            _hover={{
              bg: "teal.600", // Подсветка при наведении
              color: "white", // Контрастный текст при наведении
            }}
            onClick={() => handleListItemClick(cell.id)} // При клике на элемент списка
          >
            <Text fontSize="lg" fontWeight="semibold">{cell.name}</Text>
            <Text>{cell.address}</Text>
            <Text>{cell.hours}</Text>
            <Text fontSize="sm" color="gray.400">{cell.description}</Text> {/* Менее насыщенный текст для описания */}
          </ListItem>
          ))}
        </List>

      </Box>
    </Container>
  );
};

export default place;
