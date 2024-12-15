from app import app, db
from flask import request, jsonify
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from models import SafeShelf
from models import Book, Genre
import jwt
import datetime




@app.route('/api/safeshelves', methods=['GET'])
def get_safe_shelves():
    shelves = SafeShelf.query.all()
    return jsonify([
        {
            "id": shelf.id,
            "name": shelf.name,
            "address": shelf.address,
            "hours": shelf.hours,
            "description": shelf.description,
            "latitude": shelf.latitude,
            "longitude": shelf.longitude,
        }
        for shelf in shelves
    ])

@app.route('/api/safeshelves', methods=['POST'])
def add_safe_shelf():
    data = request.get_json()
    new_shelf = SafeShelf(
        name=data['name'],
        address=data['address'],
        hours=data.get('hours'),
        description=data.get('description'),
        latitude=data['latitude'],
        longitude=data['longitude']
    )
    db.session.add(new_shelf)
    db.session.commit()
    return jsonify({"message": "Safe shelf added successfully!"}), 201

@app.route('/api/safeshelves/<int:id>', methods=['PUT'])
def update_safe_shelf(id):
    # Ищем ячейку по ID
    shelf = SafeShelf.query.get(id)
    
    if shelf:
        # Если ячейка найдена, обновляем поля
        data = request.get_json()
        shelf.name = data.get('name', shelf.name)
        shelf.address = data.get('address', shelf.address)
        shelf.hours = data.get('hours', shelf.hours)
        shelf.description = data.get('description', shelf.description)
        shelf.latitude = data.get('latitude', shelf.latitude)
        shelf.longitude = data.get('longitude', shelf.longitude)

        # Сохраняем изменения
        db.session.commit()
        return jsonify({"message": "Safe shelf updated successfully!"}), 200
    else:
        # Если ячейка не найдена, создаем новую
        data = request.get_json()
        new_shelf = SafeShelf(
            name=data['name'],
            address=data['address'],
            hours=data.get('hours'),
            description=data.get('description'),
            latitude=data['latitude'],
            longitude=data['longitude']
        )
        db.session.add(new_shelf)
        db.session.commit()
        return jsonify({"message": "Safe shelf added successfully!"}), 201


# Get all users
@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    result = [user.to_json() for user in users]
    return jsonify(result), 200

# Register a new user
@app.route("/api/users", methods=["POST"])
def register_user():
    try:
        data = request.json

        # Validations
        required_fields = ["name", "email", "password"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 400

        # Hash the password for security
        hashed_password = generate_password_hash(password)

        new_user = User(name=name, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify(new_user.to_json()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete a user
@app.route("/api/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User deleted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Update user profile
@app.route("/api/users/<int:id>", methods=["PATCH"])
def update_user(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        data = request.json

        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)

        if "password" in data and data["password"]:
            user.password = generate_password_hash(data["password"])

        db.session.commit()
        return jsonify(user.to_json()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
SECRET_KEY = "your_secret_key"  # секретный ключ для подписи токенов

@app.route("/api/login", methods=["POST"])
def login_user():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email и пароль обязательны"}), 400

        # Находим пользователя по email
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "Пользователь не найден"}), 404

        # Проверяем пароль
        if not check_password_hash(user.password, password):
            return jsonify({"error": "Неверный пароль"}), 401

        # Генерация JWT токена
        token = jwt.encode(
            {"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            SECRET_KEY,
            algorithm="HS256"
        )

        # Возвращаем информацию о пользователе и токен
        return jsonify({
            "message": "Успешный вход",
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200

    except Exception as e:
        return jsonify({"error": f"Произошла ошибка: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)

    
@app.route("/api/user", methods=["GET"])
def get_user():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Token is missing"}), 403

    try:
        # Убираем "Bearer " из строки токена
        token = token.split(" ")[1]
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        user_id = decoded_token["user_id"]
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user.to_json()}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 403


from flask import request, jsonify
from app import app, db
from models import Book, Genre

@app.route('/api/add_book', methods=['POST'])
def add_book():
    # Получаем данные для книги из запроса
    data = request.get_json()

    # Проверяем, существует ли жанр в базе
    genre_name = data.get('genre')
    genre = Genre.query.filter_by(name=genre_name).first()

    # Если жанра нет, создаем его
    if not genre:
        genre = Genre(name=genre_name)
        db.session.add(genre)
        db.session.commit()

    # Создаем новую книгу с привязанным жанром
    new_book = Book(
        title=data.get('title'),
        author=data.get('author'),
        description=data.get('description'),
        genre_id=genre.id  # Привязываем книгу к жанру через его id
    )

    db.session.add(new_book)
    db.session.commit()

    # Возвращаем успешный ответ
    return jsonify(new_book.to_json()), 201

@app.route('/api/genres', methods=['GET'])
def get_genres():
    genres = Genre.query.all()
    return jsonify([genre.name for genre in genres])

@app.route('/api/add_genre', methods=['POST'])
def add_genre():
    data = request.get_json()
    genre_name = data.get('name')

    if not genre_name:
        return jsonify({'error': 'Название жанра обязательно'}), 400

    # Проверка на существование жанра с таким названием
    existing_genre = Genre.query.filter_by(name=genre_name).first()
    if existing_genre:
        return jsonify({'error': 'Жанр уже существует'}), 400

    # Создаем новый жанр и сохраняем в базе данных
    new_genre = Genre(name=genre_name)
    db.session.add(new_genre)
    db.session.commit()

    return jsonify(new_genre.to_json()), 201
