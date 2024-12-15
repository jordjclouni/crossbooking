import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const Home = () => {
  return (
    <Box p={8}>
      <VStack spacing={6}>
        <Heading>Добро пожаловать в BookCrossing СНГ</Heading>
        <Text fontSize="lg">
          Здесь вы можете участвовать в буккроссинге, искать книги, делиться своими находками и оставлять книги для других.
        </Text>
        <Text fontSize="md" color="gray.600">
          На данный момент зарегистрировано:
        </Text>
        <VStack spacing={3}>
          <Text>Книг в системе: 1,234</Text>
          <Text>Активных охот: 456</Text>
          <Text>Зарегистрированных участников: 789</Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Home;
