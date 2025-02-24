# Recipe App

## 📌 Project Goals
Recipe App is a web application designed to provide users with a platform to explore, save, and like various recipes. The application follows a **Role-Based Access Control (RBAC)** system, ensuring that only administrators can add, modify, and delete recipes, while users can interact with recipes by liking and saving them.

## 🚀 Features
### For Admin:
- 📝 **Create Recipes**
- ✏️ **Update Recipes**
- 🗑 **Delete Recipes**
- 🔍 **Search Recipes**

### For User:
- 📖 **Browse Recipes** – Explore a variety of recipes.
- ❤️ **Like Recipes** – Interact with recipes by adding likes.
- ⭐ **Save to Favorites** – Save preferred recipes to the favorites list.
- 🔍 **Search Recipes** – Easily find recipes based on keywords or ingredients.


## 🏛️ System Architecture Overview
The Recipe App follows a **Model-View-Controller (MVC) pattern**:
The system is divided into three key layers:

1️⃣ **Backend – API & Database**
 Node.js, Express.js for the server-side application  
- MongoDB (Mongoose ORM) for data storage  
- JWT Authentication and bcrypt for password protection  
- RESTful API for handling users, recipes, likes, and favorites  
- CORS to prevent unauthorized API access  


2️⃣ **Frontend – User & Admin Interface**
- HTML/CSS/JavaScript  
- Dynamic interaction with API  
- Page-based structure (Home, Dashboard, Recipe Details, Favorites, etc.)  

3️⃣ **Middleware & Security**
- RBAC (Role-Based Access Control) to restrict admin access  
- CORS for API protection  
- Input Validation before saving data  



  
## 📊 ERD
<img width="625" alt="image" src="https://github.com/user-attachments/assets/607850ac-8f97-4ddb-89e0-f013c41f9d70" />


## 🛠️ Features & Technologies Used
| Feature          | Technologies |
|----------------|------------|
| Frontend       | HTML, CSS, JavaScript |
| Backend        | Node.js, Express.js |
| Database       | MongoDB (Mongoose ORM) |
| Authentication | JWT (JSON Web Tokens) |
| Security       | bcrypt |

## 📂 Project Structure
```
recipe-app/
│── backend/               # Server-side application
│   ├── models/            # Mongoose models (User, Recipe, Favorite, Like)
│   ├── routes/            # API routes
│   ├── controllers/       # Controllers handling logic
│   ├── middleware/        # Authentication & security middleware
│   ├── config/            # Configuration files
│   ├── server.js          # Main server file
│
│── frontend/              # Client-side application
│   ├── public/
│   │   ├── index.html     # Main page
│   │   ├── dashboard.html # User dashboard
│   │   ├── recipe.html    # Recipe details page
│   │   ├── styles/        # CSS styles
│   │   ├── scripts/       # JavaScript scripts
│
│── .env                   # Environment variables
│── README.md              # Project documentation
│── package.json           # Dependencies & scripts
```

## 🛠️ Installation

### 1️⃣ Clone the repository
```sh
  git clone https://github.com/Aknniyet/recipe-app.git
  cd RecipeApp
```

### 2️⃣ Set up Environment Variables (`.env`)
Create a .env file inside the backend folder and add:
```sh
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

### 3️⃣ Install Dependencies
```sh
cd backend
npm install
```

### 4️⃣ Start the Server
```sh
npm run dev
```

### 5️⃣ Start the Frontend
```sh
cd frontend
npm install
npm start
```

## 🔐 Security & Authentication
- **User authentication** is handled via **JWT tokens**.
- **Password hashing** is done using **bcrypt**.
- **CORS policy** is enabled to prevent unauthorized access.
- **Helmet.js** is used to secure HTTP headers.

## 🚀 Recipe App API Documentation

## 🔑 Authentication API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/register | POST | Register a new user |
| /api/auth/login | POST | Log in and obtain a JWT token |
| /api/auth/logout | POST | Log out the user and invalidate the token |
| /api/auth/forgot-password | POST | Request a password reset link |
| /api/auth/reset-password | POST | Reset the user password using a token |

## 📖 Recipe API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/recipes | GET | Retrieve all available recipes |
| /api/recipes/:id | GET | Retrieve a specific recipe by ID |
| /api/recipes | POST | Add a new recipe (Admin only) |
| /api/recipes/:id | PUT | Update an existing recipe (Admin only) |
| /api/recipes/:id | DELETE | Remove a recipe (Admin only) |

## ⭐️ Favorites API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/users/favorites | GET | Retrieve all favorite recipes for a user |
| /api/users/favorites/:recipeId | POST | Add a recipe to favorites |
| /api/users/favorites/:recipeId | DELETE | Remove a recipe from favorites |

## ❤️ Likes API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/users/likes | GET | Retrieve all liked recipes for a user |
| /api/users/likes/:recipeId | POST | Like a recipe |
| /api/users/likes/:recipeId | DELETE | Remove like from a recipe |

## 🔍 Search & Filtering API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/recipes/search | GET | Search recipes by title, ingredients, or category |
| /api/recipes/filter | GET | Filter recipes based on dietary preferences |

## 📊 Admin API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/admin/users | GET | Retrieve all registered users (Admin only) |
| /api/admin/users/:id | DELETE | Remove a user account (Admin only) |
| /api/admin/analytics/recipes | GET | Retrieve recipe analytics (likes, saves, etc.) |
| /api/admin/analytics/users | GET | Retrieve user activity statistics |



## 📢 Additional Information
- Recipe data can be stored in **MongoDB Atlas** for cloud-based persistence.

## 🚀 Future Enhancements
- 🌍 **Multi-language Support**
- 📹 **Video Tutorials for Recipes**
- 👥 **Community Feature – Allow User Comments**
- 🛎️ **Push Notifications for New Recipes**


---
Made with ❤️ by Akniyet & Danel & Darina 🚀

