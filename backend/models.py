from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
        }

class SafeShelf(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)  # Название ячейки
    address = db.Column(db.String(200), nullable=False)  # Адрес
    hours = db.Column(db.String(100), nullable=True)  # Время работы
    description = db.Column(db.Text, nullable=True)  # Описание
    latitude = db.Column(db.Float, nullable=False)  # Широта для карты
    longitude = db.Column(db.Float, nullable=False)  # Долгота для карты

    def __repr__(self):
        return f"<SafeShelf {self.name}>"
    
class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return f"<Genre {self.name}>"

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name
        }

# Модель для книги
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    # Добавляем связь с жанром
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'), nullable=False)  # поле для жанра
    genre = db.relationship('Genre', backref=db.backref('books', lazy=True))

    def __repr__(self):
        return f"<Book {self.title}>"

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "description": self.description,
            "genre": self.genre.name  # Возвращаем жанр книги
        }