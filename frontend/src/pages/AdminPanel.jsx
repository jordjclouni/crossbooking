import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Box, Heading, Button, VStack, Flex } from "@chakra-ui/react";

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    navigate("/admin-login");
  };

  return (
    <Flex>
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

      {/* Контент */}
      <Box flex="1" p="6">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default AdminPanel;
