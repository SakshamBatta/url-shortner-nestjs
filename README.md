# 🔗 URL Shortener API - NestJS + MongoDB

This is a simple and scalable URL shortener service built using **NestJS**, **MongoDB**, and **Mongoose**.

It allows users to shorten long URLs, optionally define a custom short code, get analytics for shortened URLs, and handle redirection.

---

## 🚀 Features

- Shorten long URLs
- Define custom short codes (optional)
- Auto-generate unique short codes
- Track number of clicks
- Get analytics for shortened URLs
- URL redirection
- Swagger API Documentation

---

## 🧰 Tech Stack

| Layer     | Tech       |
| --------- | ---------- |
| Framework | [NestJS]   |
| Database  | [MongoDB]  |
| ODM       | [Mongoose] |
| API Docs  | [Swagger]  |

---

## 📦 Installation & Setup

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/url-shortener-nestjs.git
cd url-shortener-nestjs
npm install
```

Create a .env file:

MONGODB_URI=mongodb://localhost:27017/url-shortener,
BASE_URL=http://localhost:3000,
PORT=3000

```bash
npm run start:dev
```

### Swagger docs are available at:

http://localhost:3000/docs

## 📡 API Endpoints

🔗 POST /api/shorten

Request Body:
{
"url": "https://www.example.com/a-very-long-url",
"customCode": "my-link" // optional
}

Success Response:
{
"originalUrl": "https://www.example.com/a-very-long-url",
"shortUrl": "http://localhost:3000/r/my-link"
}

### 🚀 GET /r/:shortCode

Redirects to the original long URL

If short code exists → 302 redirect

If not found → 404

### 📊 GET /api/stats/:shortCode

Fetch analytics for a short URL

Response:
{
"originalUrl": "https://www.example.com",
"shortUrl": "http://localhost:3000/r/my-link",
"clicks": 5
}
