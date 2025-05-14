# Авто Форум 🚗💬

**Авто Форум** — это веб-приложение для обсуждения автомобилей 🚙, новостей автопрома 🔧 и обмена опытом между пользователями 💡. Проект построен на базе **Node.js** (Express) для серверной части и **React** для клиентского интерфейса. ОРМ базы данных **React**

---

## Структура проекта 📂
Проект разбит на две основные директории:

- **backend** – серверная часть, API, подключение к базе данных и логика.
- **frontend** – клиентская часть, созданная на React, представляет UI для пользователей.

---

## Технологии 🚀

### Frontend:
- React
- React DOM
- React Router v6
- Bootstrap
- axios
- jwt-decode
- JavaScript
- CSS

### Backend:
- Node.js
- nodemon
- Express
- Axios
- CORS
- Bcrypt
- Multer
- rethinkdb
- jsonwebtoken
- prisma

### Базы данных:
- SQLite3
- RethinkDB

### Аутентификация:
- JWT

---

## Установка 🔧

### 1. Клонирование репозитория 📥

Клонируйте репозиторий на ваш локальный компьютер:

```bash
git clone https://github.com/AbramchukVitalik/AutoForum.git
```
### 2. Установить зависимости 📦
Backend:
```
cd backend
npm install
```
Frontend:
```
cd ./frontend/my-app
npm install
```
### 3. Отредактировать .env файл ⚙️
backend/
```
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```
### 4. Устаноить свои данные базы данных реального времени RethinkDB 🔌
Откройте файл backend/src/prismaController/messagesController.js и измените следующие настройки
```
host: 'localhost',
port: 28015,
db: 'my_database',
```

---

## Запуск ▶️
backend
```
cd backend
npm start
```
frontend
```
cd ./frontend/my-app
npm start
```

---

## Автор ✍️
Абрамчук Виталий (студент 2 курса БрГТУ): [@abramchuk-vitalik](https://github.com/AbramchukVitalik)
