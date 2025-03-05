import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  VStack,
  Select,
  Button,
  useToast,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BOOKS = "http://127.0.0.1:5000/api/books";
const API_USERS = "http://127.0.0.1:5000/api/users";

const BookExchange = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    

    const fetchData = async () => {
      try {
        const response = await axios.get(API_BOOKS);
        setBooks(response.data.filter((book) => book.status === "available"));
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить книги для обмена",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, user, toast, navigate]);

  const handleExchange = () => {
    if (!selectedBook) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите книгу для обмена",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Обмен инициирован",
      description: `Вы выбрали книгу "${selectedBook.title}" для обмена. Пожалуйста, свяжитесь с администратором для завершения обмена.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  if (loading || authLoading) {
    return (
      <Container maxW="600px" py={6} textAlign="center">
        <Spinner size="lg" color="teal.500" />
      </Container>
    );
  }

  return (
    <Container maxW="600px" py={6}>
      <Heading mb={4} color={textColor} textAlign="center">
        Обмен книгами
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
        <Select
          placeholder="Выберите книгу для обмена"
          value={selectedBook?.id || ""}
          onChange={(e) =>
            setSelectedBook(books.find((b) => b.id === parseInt(e.target.value)))
          }
          bg={useColorModeValue("gray.100", "gray.600")}
          color={textColor}
          borderColor={borderColor}
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
        >
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </Select>

        <Button
          colorScheme="teal"
          onClick={handleExchange}
          isDisabled={!selectedBook}
          size="lg"
          width="full"
          mt={4}
          _hover={{ bg: "teal.600" }}
        >
          Инициировать обмен
        </Button>
      </VStack>
    </Container>
  );
};

export default BookExchange;