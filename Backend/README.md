# Backend API Documentation

## User Registration Endpoint

### Endpoint

`POST /users/register`

### Description

Registers a new user in the system. The endpoint validates the input, hashes the password, stores the user in the database, and returns a JWT token along with the user details.

### Request Body

The request body must be JSON and include:

- `fullname.firstname` (string, required): User's first name (minimum 3 characters).
- `fullname.lastname` (string, optional): User's last name (minimum 3 characters if provided).
- `email` (string, required): Valid and unique email address.
- `password` (string, required): Password (minimum 6 characters).

#### Example

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Validation

- `email` must be a valid email.
- `fullname.firstname` must be at least 3 characters.
- `password` must be at least 6 characters.

### Responses

#### Success

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```

#### Validation Error

- **Status:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "FirstName should must be 3 or grater than 3 chartecster long",
        "param": "fullname.firstname",
        "location": "body"
      },
      {
        "msg": "Password must be 6 or more  than 6 character long.",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

#### Missing Required Fields

- **Status:** `400 Bad Request`
- **Body:**
  ```json
  {
    "message": "All fields are required"
  }
  ```

### Notes

- The email must be unique.
- Passwords are hashed before storage.
- The returned JWT token can be used for authenticated requests.

---

## User Login Endpoint

### Endpoint

`POST /users/login`

### Description

Authenticates a user using their email and password. If the credentials are valid, returns a JWT token and user details.

### Request Body

The request body must be JSON and include:

- `email` (string, required): The user's registered email address.
- `password` (string, required): The user's password (minimum 6 characters).

#### Example

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Validation

- `email` must be a valid email.
- `password` must be at least 6 characters.

### Responses

#### Success

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```

#### Validation Error

- **Status:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "password is too short, password must be 6 or more  than 6 character long.",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

#### Invalid Credentials

- **Status:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### Notes

- The password is compared securely using bcrypt.
- The returned JWT token can be used for authenticated requests.

---

## User Profile Endpoint

### Endpoint

`GET /users/profile`

### Description

Returns the authenticated user's profile information. This endpoint requires a valid JWT token to be sent in the request (usually as a cookie or Authorization header).

### Authentication

- Requires JWT authentication (token must be provided).

### Responses

#### Success

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
  ```

#### Unauthorized

- **Status:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

---

## User Logout Endpoint

### Endpoint

`GET /users/logout`

### Description

Logs out the authenticated user by blacklisting the current JWT token. Requires a valid JWT token to be sent in the request.

### Authentication

- Requires JWT authentication (token must be provided).

### Responses

#### Success

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Logged out"
  }
  ```

#### Unauthorized

- **Status:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

---

## Blacklisted Tokens (Logout Security)

### Description

To enhance security, the backend uses a blacklist database collection to store JWT tokens that have been invalidated (for example, after a user logs out). This prevents the reuse of tokens after logout, even if the token is still within its expiry period.

### How It Works

- When a user logs out, their JWT token is added to the `BlacklistToken` collection in the database.
- Each blacklisted token document contains:
  - `token`: The JWT token string (unique and required).
  - `createdAt`: The timestamp when the token was blacklisted.
- The `createdAt` field is set to expire after 24 hours (86400 seconds), automatically removing the token from the database after its validity period.

### Example Document

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "createdAt": "2024-04-23T12:34:56.789Z"
}
```

### Security Note

- Every authenticated request checks if the provided JWT token is present in the blacklist. If it is, access is denied.
- This mechanism ensures that logging out immediately invalidates the token, even if it has not yet expired.

---

## Captain Routes Documentation

### Registration

**Endpoint:**  
`POST /captains/register`

Registers a new captain (driver) with vehicle details. Validates all fields, hashes the password, and returns a JWT token with captain info.

**Request Body:**
- `fullname.firstname` (string, required): Captain's first name (min 3 chars)
- `fullname.lastname` (string, optional): Captain's last name (min 3 chars if provided)
- `email` (string, required): Unique, valid email
- `password` (string, required): Min 6 chars
- `vehicle.color` (string, required): Min 3 chars
- `vehicle.plate` (string, required): Min 3 chars
- `vehicle.capacity` (integer, required): Min 1
- `vehicle.vehicleType` (string, required): One of `car`, `motorcycle`, `auto`

**Example:**
```json
{
  "fullname": { "firstname": "Alex", "lastname": "Rider" },
  "email": "alex.rider@example.com",
  "password": "captainPass123",
  "vehicle": {
    "color": "Red",
    "plate": "XYZ1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Success Response:**  
- `201 Created`
```json
{
  "token": "jwt_token_string",
  "captain": {
    "_id": "captain_id",
    "fullname": { "firstname": "Alex", "lastname": "Rider" },
    "email": "alex.rider@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

**Validation Error:**  
- `400 Bad Request`
```json
{
  "errors": [
    { "msg": "Invalid Email", "param": "email", "location": "body" },
    { "msg": "name must be at least 3 characters long", "param": "fullname.firstname", "location": "body" },
    { "msg": "Password must be at least 6 characters long", "param": "password", "location": "body" },
    { "msg": "Vehicle color must be at least 3 characters long", "param": "vehicle.color", "location": "body" },
    { "msg": "Vehicle plate must be at least 3 characters long", "param": "vehicle.plate", "location": "body" },
    { "msg": "Vehicle capacity must be at least 1", "param": "vehicle.capacity", "location": "body" },
    { "msg": "Vehicle type must be one of the following: car, motorcycle, auto", "param": "vehicle.vehicleType", "location": "body" }
  ]
}
```

**Already Exists:**  
- `400 Bad Request`
```json
{ "message": "Captain already exist" }
```

**Missing Fields:**  
- `400 Bad Request`
```json
{ "message": "All fields are required" }
```

---

### Login

**Endpoint:**  
`POST /captains/login`

Authenticates a captain using email and password. Returns JWT token and captain info.

**Request Body:**
- `email` (string, required)
- `password` (string, required, min 6 chars)

**Example:**
```json
{
  "email": "alex.rider@example.com",
  "password": "captainPass123"
}
```

**Success Response:**  
- `200 OK`
```json
{
  "token": "jwt_token_string",
  "captain": {
    "_id": "captain_id",
    "fullname": { "firstname": "Alex", "lastname": "Rider" },
    "email": "alex.rider@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

**Invalid Credentials:**  
- `401 Unauthorized`
```json
{ "message": "Invalid email or password" }
```

---

### Profile

**Endpoint:**  
`GET /captains/profile`

Returns the authenticated captain's profile. Requires JWT token.

**Success Response:**  
- `200 OK`
```json
{
  "_id": "captain_id",
  "fullname": { "firstname": "Alex", "lastname": "Rider" },
  "email": "alex.rider@example.com",
  "vehicle": {
    "color": "Red",
    "plate": "XYZ1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Unauthorized:**  
- `401 Unauthorized`
```json
{ "message": "Unauthorized" }
```

---

### Logout

**Endpoint:**  
`GET /captains/logout`

Logs out the captain by blacklisting the JWT token. Requires JWT token.

**Success Response:**  
- `200 OK`
```json
{ "message": "Logged out" }
```

**Unauthorized:**  
- `401 Unauthorized`
```json
{ "message": "Unauthorized" }
```

