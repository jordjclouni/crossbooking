import React from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";

const About = () => {
  return (
    <Container maxW="container.xl" py={4}>
      {/* Верхняя навигация с якорями */}
      <Box as="nav" bg="gray.100" py={2} mb={6} borderRadius="md" shadow="sm">
        <List
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={4}
          fontSize={{ base: "sm", md: "md" }}
          styleType="none"
        >
          <ListItem>
            <Link href="#intro" color="blue.600" fontWeight="bold">
              О буккроссинге
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#what-is" color="blue.600" fontWeight="bold">
              Что такое буккроссинг
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#process" color="blue.600" fontWeight="bold">
              Процесс буккроссинга
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#faq" color="blue.600" fontWeight="bold">
              Вопросы и ответы
            </Link>
          </ListItem>
        </List>
      </Box>

      {/* Основной контент */}
      <VStack align="start" spacing={8}>
        {/* Введение */}
        <Box id="intro">
          <Heading as="h1" size="xl" mb={4}>
            О буккроссинге
          </Heading>
          <Text fontSize="lg" mb={4}>
            Буккроссинг — это практика обмена книгами по всему миру. Он помогает
            распространять книги, делиться любимыми произведениями и находить
            новые для чтения. Это движение вдохновляет людей выпускать книги в
            «свободное плавание», делая их доступными для других.
          </Text>
          <Text fontSize="lg">
            Благодаря буккроссингу создаётся уникальная связь между людьми через
            книги, которые путешествуют по миру.
          </Text>
        </Box>

        {/* Что такое буккроссинг */}
        <Box id="what-is">
          <Heading as="h2" size="lg" mb={4}>
            Что такое буккроссинг
          </Heading>
          <Text fontSize="md" mb={4}>
            Буккроссинг (bookcrossing) возник в 2001 году по инициативе
            специалиста по интернет-технологиям, американца Рона Хорнбэкера.
            Движение из США переместилось в Европу и распространилось по всему
            миру. Сейчас более 2 миллионов участников и 10 миллионов книг
            участвуют в этой системе.
          </Text>
          <Text fontSize="md" mb={4}>
            Суть заключается в том, чтобы «освобождать» книги, позволяя им
            находить новых читателей. Каждая книга получает уникальный номер,
            который помогает отслеживать её путешествия и историю.
          </Text>
          <Text fontSize="md">
            Представьте, что через несколько лет после «освобождения» книги вы
            получаете уведомление о том, что она была найдена на другом конце
            света. Это невероятный способ связаться с людьми через литературу.
          </Text>
        </Box>

        {/* Процесс буккроссинга */}
        <Box id="process">
          <Heading as="h2" size="lg" mb={4}>
            Процесс буккроссинга
          </Heading>
          <Text fontSize="md" mb={4}>
            Процесс буккроссинга очень простой:
          </Text>
          <List spacing={3} pl={6} fontSize="md" styleType="decimal">
            <ListItem>
              Зарегистрируйте книгу на сайте, чтобы получить уникальный номер
              (КН).
            </ListItem>
            <ListItem>
              Напишите номер в книге вручную или приклейте специальную наклейку.
            </ListItem>
            <ListItem>
              Оставьте книгу в общественном месте: парке, кафе, вокзале или
              другом удобном месте.
            </ListItem>
            <ListItem>
              Отметьте на сайте место, где книга была оставлена.
            </ListItem>
            <ListItem>
              Отслеживайте её путь и узнавайте истории тех, кто её нашёл.
            </ListItem>
          </List>
          <Text fontSize="md" mt={4}>
            Таким образом, каждая книга становится частью глобальной
            «библиотеки», и вы можете наблюдать, как она соединяет людей по
            всему миру.
          </Text>
        </Box>

        {/* Часто задаваемые вопросы */}
        <Box id="faq">
          <Heading as="h2" size="lg" mb={4}>
            Часто задаваемые вопросы
          </Heading>
          <List spacing={4} fontSize="md">
            <ListItem>
              <Text as="b">Почему нужна регистрация?</Text>
              <br />
              Регистрация позволяет следить за книгами и участвовать в
              обсуждениях на форуме.
            </ListItem>
            <ListItem>
              <Text as="b">Как выглядит процесс?</Text>
              <br />
              Вы регистрируете книгу, оставляете её в общественном месте и
              наблюдаете за её путешествием.
            </ListItem>
            <ListItem>
              <Text as="b">Как вписать КН в книгу?</Text>
              <br />
              Вы можете написать номер вручную или использовать готовые
              наклейки, которые можно скачать на сайте.
            </ListItem>
            <ListItem>
              <Text as="b">Что делать, если я нашёл книгу?</Text>
              <br />
              Введите её номер на сайте, чтобы узнать её историю, оставить
              комментарий и продолжить её путешествие.
            </ListItem>
          </List>
        </Box>
      </VStack>
    </Container>
  );
};

export default About;
