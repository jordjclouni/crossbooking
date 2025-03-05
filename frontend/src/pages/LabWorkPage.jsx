import React, { useState } from "react";
import { Box, Heading, Text, VStack, Button, Input } from "@chakra-ui/react";

const LabWorkPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [array, setArray] = useState([12, 45, 78, 23, 89]);
  const [newArray, setNewArray] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [formulaResult, setFormulaResult] = useState(null);
  const [repeatCount, setRepeatCount] = useState(2 + 5); // п + 5
  const [nameOutput, setNameOutput] = useState("");

  // Функция для обновления текущей даты
  const updateDate = () => setCurrentDate(new Date());

  // Работа с массивом
  const handleArrayProcessing = () => {
    const minElement = Math.min(...array);
    const reversedArray = [...array].reverse();
    setNewArray(reversedArray);
    alert(`Минимальный элемент массива: ${minElement}`);
  };

  // Работа с пользовательской функцией
  const calculateFormula = () => {
    const x = parseFloat(customInput);
    if (isNaN(x)) {
      alert("Введите корректное число!");
      return;
    }

    try {
      const result = (x * 2 - 7) / (5 * x);
      if (!isFinite(result)) throw new Error("Некорректное значение (деление на ноль или NaN).");
      setFormulaResult(result);
    } catch (error) {
      alert(error.message);
    }
  };

  // Новая функция: вывод фамилии и имени
  const handleNameOutput = () => {
    const lastName = "Гапоник";
    const firstName = "Артур";
    
    const output = Array.from({ length: repeatCount }, (_, i) => `${i + 1}. ${lastName} ${firstName}`).join("\n");
    setNameOutput(output);
  };

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">
          Лабораторная работа №22
        </Heading>

        {/* Работа с датой */}
        <Box>
          <Heading size="md">Текущая дата и время</Heading>
          <Text>Формат: {currentDate.toISOString()}</Text>
          <Button mt={2} colorScheme="teal" onClick={updateDate}>
            Обновить дату
          </Button>
        </Box>

        {/* Работа с массивом */}
        <Box>
          <Heading size="md">Массив</Heading>
          <Text>Исходный массив: {array.join(", ")}</Text>
          <Text>Обратный массив: {newArray.join(", ")}</Text>
          <Button mt={2} colorScheme="teal" onClick={handleArrayProcessing}>
            Обработать массив
          </Button>
        </Box>

        {/* Работа со строками */}
        <Box>
          <Heading size="md">Работа со строками</Heading>
          <Text>Я люблю Беларусь</Text>
          <Text>Я учусь в Политехническом колледже</Text>
          <Text>Длина строки: {`Я учусь в Политехническом колледже`.length}</Text>
          <Text>Слово "Гродно" в строке: {"Я люблю Беларусь".includes("Гродно") ? "Да" : "Нет"}</Text>
          <Text>ASCII код символа '_': {" ".charCodeAt(0)}</Text>
        </Box>

        {/* Новая функция: вывод фамилии и имени */}
        <Box>
          <Heading size="md">Вывод фамилии и имени</Heading>
          <Text>Количество повторений: 7</Text>
          <Button mt={2} colorScheme="teal" onClick={handleNameOutput}>
            Показать имя и фамилию
          </Button>
          {nameOutput && (
            <Box mt={2} p={4} border="1px solid" borderColor="gray.200" borderRadius="md" bg="gray.50">
              <Text whiteSpace="pre-wrap">{nameOutput}</Text>
            </Box>
          )}
        </Box>

        {/* Пользовательская функция */}
        <Box>
          <Heading size="md">Пользовательская функция</Heading>
          <Text>Формула: (2 * x - 7) / (5 * x)</Text>
          <Input
            placeholder="Введите значение x"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
          <Button mt={2} colorScheme="teal" onClick={calculateFormula}>
            Рассчитать
          </Button>
          {formulaResult !== null && (
            <Text mt={2} color="green.500">
              Результат: {formulaResult}
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default LabWorkPage;
