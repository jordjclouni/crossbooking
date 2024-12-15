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

  const links = [
    { path: "/", label: "Главная" },
    { path: "/place", label: "Места" },
    { path: "/search", label: "Поиск книг" },
    { path: "/about", label: "О буккроссинге" },
  ];

  const handleLogout = () => {
    logout();
    onClose(); // Закрытие мобильного меню после выхода
  };

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
            CrossBooking
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

          {/* Состояние загрузки */}
          {loading ? (
            <Spinner size="md" color="blue.500" />
          ) : user ? (
            <>
              <Button as={Link} to="/profile" colorScheme="teal" size="md">
                Личный кабинет
              </Button>
              <Button onClick={handleLogout} colorScheme="red" size="md">
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

        {/* Переключатель темы и меню для мобильной версии */}
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

              {/* Кнопки входа и регистрации */}
              {loading ? (
                <Spinner size="lg" color="blue.500" />
              ) : user ? (
                <>
                  <Button
                    as={Link}
                    to="/profile"
                    colorScheme="teal"
                    width="full"
                    onClick={onClose}
                  >
                    Личный кабинет
                  </Button>
                  <Button
                    colorScheme="red"
                    width="full"
                    onClick={handleLogout}
                  >
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
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
    </Box>
  );
};

export default Navbar;
