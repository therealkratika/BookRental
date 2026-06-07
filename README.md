# 📚 BookRental

BookRental is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that allows users to discover books available for **rent** or **purchase**. Users can directly connect with book owners through **WhatsApp**, **phone calls**, and **email**, making book renting and buying simple, affordable, and accessible.

## 🌐 Live Demo

🔗 Live Website: https://book-rental-flame.vercel.app/

📂 GitHub Repository: https://github.com/therealkratika/BookRental

---

## ✨ Features

### 📖 Book Discovery
- Browse books available for rent or purchase
- View complete book details
- Explore book listings with images and descriptions
- Responsive and user-friendly interface

### 🔍 Search Functionality
- Search books by title
- Search books by author
- Quickly find desired books

### 📞 Direct Communication
Users can instantly connect with book owners through:
- WhatsApp
- Phone Call
- Email

### 📱 Responsive Design
- Mobile Friendly
- Tablet Friendly
- Desktop Friendly

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Deployment
- Frontend: Vercel
- Backend: Render

### Version Control
- Git
- GitHub

---

## 🏗️ System Architecture

```text
User
 │
 ▼
React Frontend (Vercel)
 │
 ▼
Express.js Backend API (Render)
 │
 ▼
MongoDB Atlas
```

---

## 📂 Project Structure

```text
BookRental/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── README.md
├── .env
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/therealkratika/BookRental.git
```

### 2. Navigate to Project Directory

```bash
cd BookRental
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 5. Start Backend Server

```bash
npm start
```

Backend will run at:

```text
http://localhost:5000
```

### 6. Install Frontend Dependencies

Open a new terminal:

```bash
cd client
npm install
```

### 7. Start Frontend Application

```bash
npm start
```

Frontend will run at:

```text
http://localhost:3000
```

---

## 📡 API Endpoints

### Get All Books

```http
GET /api/books
```

### Get Single Book

```http
GET /api/books/:id
```

### Add New Book

```http
POST /api/books
```

### Update Book

```http
PUT /api/books/:id
```

### Delete Book

```http
DELETE /api/books/:id
```

---

## 💾 Database Schema

```javascript
const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },

  rentPrice: {
    type: Number,
  },

  salePrice: {
    type: Number,
  },

  whatsapp: {
    type: String,
  },

  phone: {
    type: String,
  },

  email: {
    type: String,
  },
});
```

---

## 📚 Core Functionalities

### Book Listings

Each listing contains:

- Book Cover Image
- Book Title
- Author Name
- Description
- Rental Price
- Purchase Price
- Contact Information

### Search Books

Users can search books using:
- Book Title
- Author Name

### Contact Owner

#### WhatsApp

```javascript
window.open(`https://wa.me/${whatsappNumber}`, "_blank");
```

#### Phone Call

```javascript
window.location.href = `tel:${phoneNumber}`;
```

#### Email

```javascript
window.location.href = `mailto:${email}`;
```

---

## ☁️ Deployment

### Frontend Deployment (Vercel)

```bash
npm run build
```

Frontend URL:

```text
https://book-rental-flame.vercel.app/
```

### Backend Deployment (Render)

```bash
npm start
```

### Database

MongoDB Atlas

---

## 🔒 Security Features

- Environment Variables Protection
- MongoDB Connection Security
- Input Validation
- Error Handling Middleware
- RESTful API Architecture

---

## 🎯 Future Enhancements

- User Authentication (JWT)
- User Registration & Login
- Admin Dashboard
- Add/Edit/Delete Listings
- Wishlist Feature
- Ratings & Reviews
- Real-Time Chat
- Payment Gateway Integration
- Book Availability Tracking
- User Profiles

---

## 🤝 Contributing

Contributions are welcome!

### Fork Repository

```bash
git fork https://github.com/therealkratika/BookRental.git
```

### Create Feature Branch

```bash
git checkout -b feature-name
```

### Commit Changes

```bash
git commit -m "Added new feature"
```

### Push Changes

```bash
git push origin feature-name
```

### Open Pull Request

Submit your Pull Request through GitHub.

---

## 📥 Download Project

### Using Git Clone

```bash
git clone https://github.com/therealkratika/BookRental.git
```

### Using GitHub ZIP Download

1. Open the repository:
   https://github.com/therealkratika/BookRental

2. Click the green **Code** button.

3. Select **Download ZIP**.

4. Extract the ZIP file.

5. Follow the installation steps above.

---

## 👩‍💻 Author

**Kratika Gupta**

GitHub: https://github.com/therealkratika

LinkedIn: https://www.linkedin.com/in/therealkratika

---

## ⭐ Support

If you found this project useful:

- Star the repository
- Fork the repository
- Share it with others

---

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by Kratika Gupta
