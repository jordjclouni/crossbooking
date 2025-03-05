@echo off

:: Переменная для отслеживания ошибок
set "error_occurred="

echo [INFO] Активируем виртуальное окружение...
call backend\venv\Scripts\activate || set "error_occurred=1"

if "%error_occurred%"=="1" (
    echo [ERROR] Не удалось активировать виртуальное окружение.
    exit /b 1
)


echo [INFO] Переходим в папку frontend...
cd frontend || set "error_occurred=1"

if "%error_occurred%"=="1" (
    echo [ERROR] Папка frontend не найдена.
    exit /b 1
)


echo [INFO] Собираем frontend...
npm run build || set "error_occurred=1"

if "%error_occurred%"=="1" (
    echo [ERROR] Не удалось собрать frontend.
    exit /b 1
)

echo [INFO] Переносим сборку frontend в backend...
cd .. 
xcopy frontend\dist backend\static /E /H /C /I || set "error_occurred=1"

if "%error_occurred%"=="1" (
    echo [ERROR] Не удалось перенести frontend-сборку.
    exit /b 1
)

echo [INFO] Переходим в папку backend...
cd backend || set "error_occurred=1"

if "%error_occurred%"=="1" (
    echo [ERROR] Папка backend не найдена.
    exit /b 1
)


echo [INFO] Всё успешно обновлено и запущено!
