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