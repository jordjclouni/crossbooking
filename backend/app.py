from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Импортируем CORS
from flask_migrate import Migrate
import os

app = Flask(__name__)

CORS(app)

# Конфигурация базы данных crossbooking
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///crossbooking.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db) 

frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")


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

# Импорт маршрутов
import routes  # Убедитесь, что этот файл существует и правильно подключен

# Создание базы данных и таблиц
with app.app_context():
    db.create_all()

# Запуск сервера
if __name__ == "__main__":
    app.run(debug=True)