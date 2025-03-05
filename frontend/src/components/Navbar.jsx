import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  useColorMode,
  Text,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, HamburgerIcon } from "@chakra-ui/icons";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Проверка роли пользователя
  const roleId = user?.role_id || Number(localStorage.getItem("role_id")); // Используем user из контекста или localStorage
  const isAdmin = roleId === 1; // Предположим, что у админа role_id = 1

  const links = [
    { path: "/", label: "Главная" },
    { path: "/place", label: "Места" },
    { path: "/search", label: "Поиск книг" },
    { path: "/about", label: "О буккроссинге" },
  ];

  return (
    <Box
      as="nav"
      bg={colorMode === "light" ? "white" : "gray.800"}
      boxShadow="md"
      px={4}
      py={2}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Логотип */}
        <Link to="/">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, cyan.400, blue.500)"
            bgClip="text"
          >
            Кросбукинг
          </Text>
        </Link>

        {/* Навигация для ПК */}
        <HStack as="ul" display={{ base: "none", md: "flex" }} spacing={6}>
          {links.map((link) => (
            <Text
              as={Link}
              to={link.path}
              key={link.path}
              fontWeight={location.pathname === link.path ? "bold" : "normal"}
              color={location.pathname === link.path ? "blue.400" : "gray.500"}
              _hover={{ color: "blue.400" }}
            >
              {link.label}
            </Text>
          ))}

          {/* Обычный пользователь может добавлять книги и видеть инвентарь */}
          {user && !isAdmin && (
            <>
              <Button as={Link} to="/addbook" colorScheme="blue" size="md">
                Добавить книгу
              </Button>
              <Button as={Link} to="/inventory" colorScheme="teal" size="md">
                Инвентарь
              </Button>
            </>
          )}

          {/* Состояние загрузки */}
          {loading ? (
            <Spinner size="md" color="blue.500" />
          ) : user ? (
            <>
              <Button
                as={Link}
                to={isAdmin ? "/admin" : "/profile"}
                colorScheme="teal"
                size="md"
              >
                {isAdmin ? "Админ-панель" : "Личный кабинет"}
              </Button>
              <Button onClick={logout} colorScheme="red" size="md">
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsRegisterOpen(true)}
                colorScheme="teal"
                size="md"
              >
                Зарегистрироваться
              </Button>
              <Button
                onClick={() => setIsLoginOpen(true)}
                colorScheme="cyan"
                size="md"
              >
                Войти
              </Button>
            </>
          )}
        </HStack>

        {/* Переключатель темы и мобильное меню */}
        <Flex alignItems="center" gap={2}>
          <IconButton
            aria-label="Toggle Theme"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            size="sm"
            variant="ghost"
          />
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            size="sm"
            variant="ghost"
            display={{ base: "block", md: "none" }}
            onClick={onOpen}
          />
        </Flex>
      </Flex>

      {/* Мобильное меню */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <VStack spacing={4} mt={8}>
              {links.map((link) => (
                <Button
                  as={Link}
                  to={link.path}
                  key={link.path}
                  width="full"
                  justifyContent="flex-start"
                  colorScheme={location.pathname === link.path ? "blue" : "gray"}
                  onClick={onClose}
                >
                  {link.label}
                </Button>
              ))}

              {/* "Добавить книгу" и "Инвентарь" в мобильном меню (только для пользователей) */}
              {user && !isAdmin && (
                <>
                  <Button
                    as={Link}
                    to="/addbook"
                    colorScheme="blue"
                    width="full"
                    onClick={onClose}
                  >
                    Добавить книгу
                  </Button>
                  <Button
                    as={Link}
                    to="/inventory"
                    colorScheme="teal"
                    width="full"
                    onClick={onClose}
                  >
                    Инвентарь
                  </Button>
                </>
              )}

              {/* Админ-панель (только для админов) */}
              {isAdmin && (
                <Button
                  as={Link}
                  to="/admin"
                  colorScheme="purple"
                  width="full"
                  onClick={onClose}
                >
                  Админ-панель
                </Button>
              )}

              {/* Кнопки входа и выхода */}
              {loading ? (
                <Spinner size="lg" color="blue.500" />
              ) : user ? (
                <>
                  <Button
                    as={Link}
                    to={isAdmin ? "/admin" : "/profile"}
                    colorScheme="teal"
                    width="full"
                    onClick={onClose}
                  >
                    {isAdmin ? "Админ-панель" : "Личный кабинет"}
                  </Button>
                  <Button colorScheme="red" width="full" onClick={logout}>
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setIsRegisterOpen(true);
                      onClose();
                    }}
                    colorScheme="teal"
                    width="full"
                  >
                    Зарегистрироваться
                  </Button>
                  <Button
                    onClick={() => {
                      setIsLoginOpen(true);
                      onClose();
                    }}
                    colorScheme="cyan"
                    width="full"
                  >
                    Войти
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Модальные окна */}
      {isRegisterOpen && (
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
        />
      )}
      {isLoginOpen && (
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}
    </Box>
  );
};

export default Navbar;