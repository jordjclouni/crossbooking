// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Image,
  Container,
  useColorModeValue,
  SimpleGrid,
  Link,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowForwardIcon, AtSignIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Импортируем AuthContext
import { useToast } from "@chakra-ui/react"; // Добавляем импорт useToast

const API_STATS = "http://127.0.0.1:5000/api/stats";
const API_BOOKS_AVAILABLE = "http://127.0.0.1:5000/api/books/available";
const API_INVENTORY = "http://127.0.0.1:5000/api/inventory";

const Home = () => {
  const [stats, setStats] = useState(null); // Инициализируем null, чтобы проверить наличие данных
  const { user, loading } = useAuth(); // Получаем user и loading из AuthContext
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const navigate = useNavigate();
  const toast = useToast(); // Инициализируем useToast

  // Загрузка статистики
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(API_STATS);
        setStats(response.data);
      } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
        setStats({
          registeredUsers: 789,
          totalSafeshelves: 50,
          availableBooks: 1200,
          reservedBooks: 100,
          inHandBooks: 50,
          totalBooks: 1350,
        });
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await axios.get(API_BOOKS_AVAILABLE);
        // Здесь можно добавить логику, если нужно использовать данные доступных книг
      } catch (error) {
        if (error.response?.status === 500) {
          toast({
            title: "Ошибка сервера",
            description: "Не удалось загрузить доступные книги. Пожалуйста, попробуйте позже.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchStats();
    fetchBooks();
  }, []);

  // Навигация к списку доступных книг
  const handleExploreBooks = () => {
    navigate("/search");
  };

  // Навигация к инвентарю (только для авторизованных пользователей)
  const handleViewInventory = async () => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, войдите в систему, чтобы просмотреть инвентарь",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    try {
      await axios.get(API_INVENTORY); // Проверяем доступ к инвентарю
      navigate("/inventory");
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
          description: "Не удалось загрузить инвентарь",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error("Ошибка при загрузке инвентаря:", error);
      }
    }
  };

  // Показываем загрузку, если статистика ещё не загружена
  if (!stats) {
    return (
      <Container maxW="container.xl" py={10}>
        <Box p={8} borderRadius={8} boxShadow="lg" bg={bgColor} borderWidth={1} borderColor={borderColor}>
          <VStack spacing={6} align="center">
            <Text color={textColor}>Загрузка статистики...</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box
        p={8}
        borderRadius={8}
        boxShadow="lg"
        bg={bgColor}
        borderWidth={1}
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          {/* Заголовок и описание */}
          <Heading as="h1" size="2xl" color={textColor} textAlign="center">
            Добро пожаловать в Кросбукинг
          </Heading>
          <Text fontSize="lg" color={textColor} textAlign="center">
            Участвуйте в кросбукинг, находите книги, обменивайтесь находками и оставляйте книги для других. Создавайте сообщество книголюбов по всему!
          </Text>

          {/* Статистика */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={8}>
            <Stat
              px={{ base: 2, md: 4 }}
              py={5}
              borderRadius={8}
              boxShadow="md"
              bg={useColorModeValue("gray.50", "gray.700")}
            >
              <StatLabel fontWeight="medium" color={textColor}>
                Участников
              </StatLabel>
              <StatNumber fontSize="2xl" color={textColor}>
                {stats.registeredUsers?.toLocaleString() || "0"}
              </StatNumber>
              <StatHelpText color={textColor}>
                Зарегистрированных пользователей
              </StatHelpText>
            </Stat>

            <Stat
              px={{ base: 2, md: 4 }}
              py={5}
              borderRadius={8}
              boxShadow="md"
              bg={useColorModeValue("gray.50", "gray.700")}
            >
              <StatLabel fontWeight="medium" color={textColor}>
                Безопасных ячеек
              </StatLabel>
              <StatNumber fontSize="2xl" color={textColor}>
                {stats.totalSafeshelves?.toLocaleString() || "0"}
              </StatNumber>
              <StatHelpText color={textColor}>
                Мест хранения книг
              </StatHelpText>
            </Stat>

            <Stat
              px={{ base: 2, md: 4 }}
              py={5}
              borderRadius={8}
              boxShadow="md"
              bg={useColorModeValue("gray.50", "gray.700")}
            >
              <StatLabel fontWeight="medium" color={textColor}>
                Доступных книг
              </StatLabel>
              <StatNumber fontSize="2xl" color={textColor}>
                {stats.availableBooks?.toLocaleString() || "0"}
              </StatNumber>
              <StatHelpText color={textColor}>
                Книг в ячейках
              </StatHelpText>
            </Stat>

            <Stat
              px={{ base: 2, md: 4 }}
              py={5}
              borderRadius={8}
              boxShadow="md"
              bg={useColorModeValue("gray.50", "gray.700")}
            >
              <StatLabel fontWeight="medium" color={textColor}>
                Зарезервированных книг
              </StatLabel>
              <StatNumber fontSize="2xl" color={textColor}>
                {stats.reservedBooks?.toLocaleString() || "0"}
              </StatNumber>
              <StatHelpText color={textColor}>
                Книг, ожидающих забора
              </StatHelpText>
            </Stat>

            <Stat
              px={{ base: 2, md: 4 }}
              py={5}
              borderRadius={8}
              boxShadow="md"
              bg={useColorModeValue("gray.50", "gray.700")}
            >
              <StatLabel fontWeight="medium" color={textColor}>
                Книг в руках
              </StatLabel>
              <StatNumber fontSize="2xl" color={textColor}>
                {stats.inHandBooks?.toLocaleString() || "0"}
              </StatNumber>
              <StatHelpText color={textColor}>
                Книг, забранных пользователями
              </StatHelpText>
            </Stat>

            <Stat
              px={{ base: 2, md: 4 }}
              py={5}
              borderRadius={8}
              boxShadow="md"
              bg={useColorModeValue("gray.50", "gray.700")}
            >
              <StatLabel fontWeight="medium" color={textColor}>
                Всего книг
              </StatLabel>
              <StatNumber fontSize="2xl" color={textColor}>
                {stats.totalBooks?.toLocaleString() || "0"}
              </StatNumber>
              <StatHelpText color={textColor}>
                Все зарегистрированные книги
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Кнопки действий */}
          <HStack spacing={4} mt={8} justify="center">
            <Button
              colorScheme="blue"
              size="lg"
              rightIcon={<ArrowForwardIcon />}
              onClick={handleExploreBooks}
            >
              Найти книги
            </Button>
            {user && (
              <IconButton
                colorScheme="teal"
                aria-label="Просмотреть инвентарь"
                icon={<AtSignIcon />}
                size="lg"
                onClick={handleViewInventory}
              />
            )}
          </HStack>

          {/* Изображение и призыв к действию */}
          <Box mt={10} textAlign="center">
            <Image
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000" // Замените на реальное изображение
              alt="Книги для буккроссинга"
              borderRadius={8}
              maxW="100%"
              h="auto"
              objectFit="cover"
            />
            <Text fontSize="md" color={textColor} mt={4}>
              Присоединяйтесь к сообществу и начните своё путешествие с книгами уже сегодня!
            </Text>
            {!user && (
              <Button
                mt={4}
                colorScheme="blue"
                size="lg"
                rightIcon={<ArrowForwardIcon />}
                as={Link}
                to="/register" // Предполагаемый маршрут для регистрации
              >
                Зарегистрироваться
              </Button>
            )}
          </Box>

          {/* Краткое описание */}
          <Text fontSize="md" color={textColor} mt={8} textAlign="center">
            Кросбукинг — это платформа для обмена книгами, где каждый может оставить книгу в общественном месте, зарегистрировать её и отслеживать её путешествие по миру. Найдите книгу, оставьте свою и станьте частью глобального движения!
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Home;