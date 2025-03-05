from flask import Flask, send_from_directory, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Импортируем CORS
from flask_migrate import Migrate  # Импортируем Flask-Migrate
import os


# Создаём экземпляр приложения Flask
app = Flask(__name__)


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5000"}})
# Настройка CORS с поддержкой куки
CORS(app, supports_credentials=True)  # Поддержка передачи куки

# Конфигурация базы данных crossbooking
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///crossbooking.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECRET_KEY'] = "your-secret-key-here"  # Добавляем SECRET_KEY для сессий

# Инициализация базы данных и миграций
db = SQLAlchemy(app)
migrate = Migrate(app, db)  # Инициализируем Flask-Migrate

# Путь к фронтенду
frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

# Маршрут для установки тестовых куки
@app.route("/set-cookie")
def set_cookie():
    """
    Маршрут для установки тестового куки с флагами Secure и SameSite=None.
    """
    response = make_response(jsonify({"message": "Cookie установлено"}))
    response.set_cookie(
        "session_id", 
        "secure_cookie_value", 
        secure=True,      # Куки доступны только через HTTPS
        httponly=True,    # Куки недоступны через JavaScript
        samesite="None"   # Разрешает передачу куки между доменами
    )
    return response

# Тестовый маршрут API
@app.route("/api/data")
def get_data():
    """
    Простой тестовый API для демонстрации передачи данных.
    """
    return jsonify({"message": "Это данные с сервера"})

# Отдача статических файлов и главной страницы
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_static_files(path):
    """
    Обрабатывает все маршруты:
    1. Возвращает существующий статический файл (JS, CSS, изображения и т.д.)
    2. Возвращает index.html для всех остальных путей
    """
    if path and os.path.exists(os.path.join(dist_folder, path)):
        # Если файл существует, отдаем его
        return send_from_directory(dist_folder, path)
    else:
        # Если файл не найден, отдаем index.html
        return send_from_directory(dist_folder, "index.html")

# Импорт маршрутов после инициализации app, чтобы избежать циклических импортов
try:
    from routes import *  # Импортируем все маршруты из routes.py
except ImportError as e:
    print(f"Routes файл не найден или произошла ошибка импорта: {e}")

# Создание базы данных и таблиц
with app.app_context():
    db.create_all()

# Запуск сервера
if __name__ == "__main__":
    app.run(debug=True, ssl_context="adhoc")  # Временный SSL для тестирования