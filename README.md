# Product Listing App - Backend

## Overview
This is the backend component of the product listing application, designed to handle data storage, processing, and API requests for the frontend. It provides endpoints for managing products, user authentication, and more.

## Features
- **Product Management**: CRUD operations for products.
- **User Authentication**: Secure login and registration functionality.
- **API Endpoints**: RESTful API for frontend communication.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: SQL
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/product-listing-app.git
   ```
2. **Install dependencies**:
   ```bash
   cd product-list-backend
   npm install
   ```
3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your database connection string and JWT secret.
4. **Run the application**:
   ```bash
   npm start
   ```

## API Endpoints
- **GET /products**: Retrieve a list of products.
- **POST /products**: Add a new product.
- **PUT /products/:id**: Update an existing product.
- **DELETE /products/:id**: Delete a product.
- **POST /register**: Register a new user.
- **POST /login**: Authenticate a user and return a JWT.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License.