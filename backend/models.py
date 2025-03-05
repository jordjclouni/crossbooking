from app import db
import datetime


# Таблица "Роли"
class Role(db.Model):
    __tablename__ = 'Роли'
    id = db.Column("КодРоли", db.Integer, primary_key=True)
    name = db.Column("Название", db.String(100), nullable=False)
    functions = db.Column("Функции", db.String(200), nullable=True)
    access_level = db.Column("Доступ", db.String(100), nullable=True)

    users = db.relationship('User', backref='role', lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "functions": self.functions,
            "access_level": self.access_level
        }

# Таблица "Пользователи"
class User(db.Model):
    __tablename__ = 'Пользователи'
    id = db.Column("КодПользователя", db.Integer, primary_key=True)
    role_id = db.Column("КодРоли", db.Integer, db.ForeignKey('Роли.КодРоли'), nullable=False)
    name = db.Column("Имя", db.String(100), nullable=False)
    email = db.Column("Эл.Почта", db.String(150), unique=True, nullable=False)
    password = db.Column("Пароль", db.String(200), nullable=False)

    reviews = db.relationship('Review', backref='user', lazy=True)
    books = db.relationship('Book', backref='user', lazy=True)

    def __repr__(self):
        return f"<User {self.name}>"

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role_id": self.role_id
        }


# Таблица "Безопасные ячейки"
class SafeShelf(db.Model):
    __tablename__ = 'БезопасныеЯчейки'
    id = db.Column("КодЯчейки", db.Integer, primary_key=True)
    name = db.Column("Название", db.String(150), nullable=False)
    address = db.Column("Адрес", db.String(200), nullable=False)
    hours = db.Column("ЧасыРаботы", db.String(100), nullable=True)
    description = db.Column("Описание", db.Text, nullable=True)
    latitude = db.Column("Широта", db.Float, nullable=False)
    longitude = db.Column("Долгота", db.Float, nullable=False)

    books = db.relationship('Book', backref='safe_shelf', lazy=True)

    def __repr__(self):
        return f"<SafeShelf {self.name}>"





# Таблица "Автор"
class Author(db.Model):
    __tablename__ = 'Автор'
    id = db.Column("КодАвтора", db.Integer, primary_key=True)
    name = db.Column("ФИО", db.String(200), nullable=False)
    description = db.Column("Описание", db.Text, nullable=True)

    books = db.relationship('Book', backref='author', lazy=True)

    def __repr__(self):
        return f"<Author {self.name}>"


class Book(db.Model):
    __tablename__ = 'Книга'
    id = db.Column("КодКниги", db.Integer, primary_key=True)
    title = db.Column("Название", db.String(200), nullable=False)
    author_id = db.Column("КодАвтора", db.Integer, db.ForeignKey('Автор.КодАвтора'), nullable=False)
    description = db.Column("Описание", db.Text, nullable=False)
    safe_shelf_id = db.Column("КодЯчейки", db.Integer, db.ForeignKey('БезопасныеЯчейки.КодЯчейки'), nullable=True)
    user_id = db.Column("КодПользователя", db.Integer, db.ForeignKey('Пользователи.КодПользователя'), nullable=True)  # Изменено на nullable=True
    isbn = db.Column("ISBN", db.String(13), unique=True, nullable=False)
    status = db.Column("Статус", db.String(50), default="available")
    path = db.Column(db.Text, nullable=True)

    reviews = db.relationship('Review', backref='book', lazy=True)
    genres = db.relationship('BookGenre', backref='book', lazy=True)

    def __repr__(self):
        return f"<Book {self.title} (ISBN: {self.isbn})>"

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "author_id": self.author_id,
            "description": self.description,
            "safe_shelf_id": self.safe_shelf_id,
            "user_id": self.user_id,
            "isbn": self.isbn,
            "status": self.status,
            "path": self.path
        }


# Промежуточная таблица "ЖанрКниги" (многие ко многим)
class BookGenre(db.Model):
    __tablename__ = 'ЖанрКниги'
    book_id = db.Column("КодКниги", db.Integer, db.ForeignKey('Книга.КодКниги'), primary_key=True)
    genre_id = db.Column("КодЖанра", db.Integer, db.ForeignKey('Жанр.КодЖанра'), primary_key=True)

# Таблица "Жанр"
class Genre(db.Model):
    __tablename__ = 'Жанр'
    id = db.Column("КодЖанра", db.Integer, primary_key=True)
    name = db.Column("НазваниеЖанра", db.String(100), unique=True, nullable=False)

    books = db.relationship('BookGenre', backref='genre', lazy=True)

    def __repr__(self):
        return f"<Genre {self.name}>"

# Таблица "Отзыв"
class Review(db.Model):
    __tablename__ = 'Отзыв'
    book_id = db.Column("КодКниги", db.Integer, db.ForeignKey('Книга.КодКниги'), primary_key=True)
    user_id = db.Column("КодПользователя", db.Integer, db.ForeignKey('Пользователи.КодПользователя'), primary_key=True)
    name = db.Column("Имя", db.String(100), nullable=False)
    text = db.Column("ТекстОтзыва", db.Text, nullable=False)
    rating = db.Column("РейтингОтзыва", db.Integer, nullable=False)

    def __repr__(self):
        return f"<Review by {self.name}>"
    
class UserInventory(db.Model):
    __tablename__ = 'UserInventory'
    user_id = db.Column("КодПользователя", db.Integer, db.ForeignKey('Пользователи.КодПользователя'), primary_key=True)
    book_id = db.Column("КодКниги", db.Integer, db.ForeignKey('Книга.КодКниги'), primary_key=True)
    added_at = db.Column("ДатаДобавления", db.DateTime, default=datetime.datetime.utcnow)

    book = db.relationship('Book', backref='inventory_entries', lazy=True)

    def __repr__(self):
        return f"<UserInventory UserID: {self.user_id}, BookID: {self.book_id}>"

    def to_json(self):
        return {
            "user_id": self.user_id,
            "book_id": self.book_id,
            "book": self.book.to_json() if self.book else None,
            "added_at": self.added_at.isoformat()
        }
