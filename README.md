# URL Shortener

A robust, Firebase-backed URL shortening service built with Next.js. This project provides a scalable API for creating, managing, and retrieving shortened URLs.

## Features

- **Shorten URLs**: Generate concise aliases for long URLs.
- **Data Persistence**: Uses Firebase Firestore for reliable data storage.
- **API Security**: Authenticated API endpoints using API keys.
- **Validation**: Strict URL validation and host blocking capabilities.
- **Reachability Check**: Verifies that the target URL is reachable before shortening.

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
API_KEY=your_secure_api_key
```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## API Documentation

All API endpoints require authentication via the `x-api-key` header.

### 1. Shorten URL

Creates a new shortened URL.

- **Endpoint**: `POST /api/shorten`
- **Headers**:
    - `x-api-key`: Your API key
    - `Content-Type`: `application/json`
- **Body**:
    ```json
    {
      "longUrl": "https://example.com/very/long/url",
      "uid": "user_identifier"
    }
    ```
- **Response**:
    ```json
    {
      "shortUrl": "http://localhost:3000/AbCdEf"
    }
    ```

### 2. Get User URLs

Retrieves all shortened URLs created by a specific user.

- **Endpoint**: `GET /api/urls`
- **Headers**:
    - `x-api-key`: Your API key
- **Query Parameters**:
    - `uid`: The user identifier
- **Response**:
    ```json
    [
      {
        "code": "AbCdEf",
        "longUrl": "https://example.com/very/long/url",
        "uid": "user_identifier",
        "clicks": 0,
        "createdAt": 1672531200000
      }
    ]
    ```

### 3. Delete URL

Deletes a shortened URL.

- **Endpoint**: `DELETE /api/delete`
- **Headers**:
    - `x-api-key`: Your API key
    - `Content-Type`: `application/json`
- **Body**:
    ```json
    {
      "code": "AbCdEf",
      "uid": "user_identifier"
    }
    ```
- **Response**:
    ```json
    {
      "success": true
    }
    ```

## Security

This project enforces API key validation for all write and read operations. Ensure your `API_KEY` is kept secret and not exposed in client-side code.

## License

[MIT](LICENSE)
