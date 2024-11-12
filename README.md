# REST Service for To-Do App

This repository contains the server-side code for a **To-Do Application** built using **Express.js**. It provides endpoints for user authentication, managing to-do items, handling categories, and accessing user profiles. The application includes authentication and route protection to secure data and functionalities.

## Requirements

- Docker

## Usage

- Clone the repository.
- Create a `.env` file in the root directory
- Run `docker-compose up -d --build` to start the service.
- Run `docker-compose down` to stop the service.

## API Endpoints

### Authentication (/auth)

#### Register a new user

```http
POST /auth/signup

{
    "username": string,
    "password": string
}
```

#### Login

```http
POST /auth/login

{
    "username": string,
    "password": string
}
```

#### Logout

```http
POST /auth/logout
```

#### Verify Token

```http
POST /auth/verify-token
```

### To-Do Items (/todo)

#### Get all to-do items

```http
GET /todo
```

#### Create a new to-do item

```http
POST /todo

{
    "title": string,
    "dueDate": string?,
    "category": string?,
    "completed": boolean?
    "categoryId": int?
}
```

#### Get To-Do Item By Id

```http
GET /todo/:id
```

#### Update To-Do Item By Id

```http
PUT /todo/:id

{
    "title": string?,
    "dueDate": string?,
    "category": string?,
    "completed": boolean?
    "categoryId": int?
}
```

#### Delete To-Do Item By Id

```http
DELETE /todo/:id
```

### Categories (/category)

#### Get all categories

```http
GET /category
```

#### Create a new category

```http
POST /category

{
    "name": string
}
```

#### Get Category By Id

```http
GET /category/:id
```

#### Update Category By Id

```http
PUT /category/:id

{
    "name": string
}
```

#### Delete Category By Id

```http
DELETE /category/:id
```

### User (/user)

#### Get user profile

```http
GET /user/profile
```
