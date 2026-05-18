# GigFlow REST API Documentation

This document describes the endpoints, payloads, query parameters, and responses for the GigFlow Smart Leads Dashboard backend.

---

## 🔒 Authentication & Headers

All protected endpoints require a valid JWT token passed in the `Authorization` header as a Bearer token:

```text
Authorization: Bearer <your_jwt_token_here>
```

---

## 🔑 Authentication Endpoints

### 1. Register User
Registers a new user profile on the workspace.
*   **URL**: `/api/auth/register`
*   **Method**: `POST`
*   **Auth Required**: No
*   **Request Body**:
    ```json
    {
      "name": "Alex Johnson",
      "email": "alex@company.com",
      "password": "SecurePassword123",
      "role": "Sales User" 
    }
    ```
    *(Note: `role` can be `'Admin'` or `'Sales User'`, defaults to `'Sales User'` if omitted)*
*   **Response (201 Created)**:
    ```json
    {
      "_id": "66487bb0e9b282ca2f4ff063",
      "name": "Alex Johnson",
      "email": "alex@company.com",
      "role": "Sales User",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### 2. Login User
Logs in an existing user and retrieves a token.
*   **URL**: `/api/auth/login`
*   **Method**: `POST`
*   **Auth Required**: No
*   **Request Body**:
    ```json
    {
      "email": "admin@gigflow.com",
      "password": "Admin@123"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "_id": "66487bb0e9b282ca2f4ff061",
      "name": "GigFlow Admin",
      "email": "admin@gigflow.com",
      "role": "Admin",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### 3. Fetch Current Profile
Retrieves the logged-in user profile attributes.
*   **URL**: `/api/auth/me`
*   **Method**: `GET`
*   **Auth Required**: Yes
*   **Response (200 OK)**:
    ```json
    {
      "_id": "66487bb0e9b282ca2f4ff061",
      "name": "GigFlow Admin",
      "email": "admin@gigflow.com",
      "role": "Admin"
    }
    ```

---

## 📊 Lead Management Endpoints

### 1. Get Paginated & Filtered Leads
Retrieves a paginated list of leads with support for cumulative searching, filtering, and sorting.
*   **URL**: `/api/leads`
*   **Method**: `GET`
*   **Auth Required**: Yes
*   **Query Parameters**:

| Parameter | Type | Required | Description | Default |
| :--- | :--- | :--- | :--- | :--- |
| `page` | Integer | No | Current target page | `1` |
| `limit` | Integer | No | Count of leads returned per page | `10` |
| `search` | String | No | Search query matching `name` or `email` (regex) | `""` |
| `status` | String | No | Filter by status (`New`, `Contacted`, `Qualified`, `Lost`) | `"All"` |
| `source` | String | No | Filter by source channel (`Website`, `Instagram`, `Referral`) | `"All"` |
| `sort` | String | No | Sorting order (`latest` or `oldest` by creation date) | `"latest"` |

*   **Response (200 OK)**:
    ```json
    {
      "page": 1,
      "limit": 10,
      "totalLeads": 12,
      "totalPages": 2,
      "leads": [
        {
          "_id": "66487bb0e9b282ca2f4ff065",
          "name": "Rahul Sharma",
          "email": "rahul.sharma@gmail.com",
          "status": "Qualified",
          "source": "Instagram",
          "createdAt": "2026-05-17T11:15:08.000Z",
          "updatedAt": "2026-05-18T05:30:12.000Z",
          "__v": 0
        }
      ]
    }
    ```

### 2. Add New Lead
Registers a new lead in the system.
*   **URL**: `/api/leads`
*   **Method**: `POST`
*   **Auth Required**: Yes (Both Admin and Sales Roles)
*   **Request Body**:
    ```json
    {
      "name": "Emma Watson",
      "email": "emma@watsonmedia.co.uk",
      "status": "New", // Optional, defaults to "New"
      "source": "Instagram"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "_id": "66487bb0e9b282ca2f4ff088",
      "name": "Emma Watson",
      "email": "emma@watsonmedia.co.uk",
      "status": "New",
      "source": "Instagram",
      "createdAt": "2026-05-18T05:40:00.000Z",
      "updatedAt": "2026-05-18T05:40:00.000Z",
      "__v": 0
    }
    ```

### 3. Get Single Lead Details
Retrieves details of a specific lead by its MongoDB ObjectId.
*   **URL**: `/api/leads/:id`
*   **Method**: `GET`
*   **Auth Required**: Yes
*   **Response (200 OK)**:
    ```json
    {
      "_id": "66487bb0e9b282ca2f4ff065",
      "name": "Rahul Sharma",
      "email": "rahul.sharma@gmail.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdAt": "2026-05-17T11:15:08.000Z",
      "updatedAt": "2026-05-18T05:30:12.000Z",
      "__v": 0
    }
    ```

### 4. Update Lead
Modifies attributes of an existing lead.
*   **URL**: `/api/leads/:id`
*   **Method**: `PUT`
*   **Auth Required**: Yes (Both Admin and Sales Roles)
*   **Request Body**:
    ```json
    {
      "name": "Rahul K. Sharma",
      "status": "Contacted"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "_id": "66487bb0e9b282ca2f4ff065",
      "name": "Rahul K. Sharma",
      "email": "rahul.sharma@gmail.com",
      "status": "Contacted",
      "source": "Instagram",
      "createdAt": "2026-05-17T11:15:08.000Z",
      "updatedAt": "2026-05-18T05:45:00.000Z",
      "__v": 0
    }
    ```

### 5. Delete Lead
Permanently deletes a lead record.
*   **URL**: `/api/leads/:id`
*   **Method**: `DELETE`
*   **Auth Required**: Yes (Admin Only)
*   **Response (200 OK)**:
    ```json
    {
      "message": "Lead successfully deleted"
    }
    ```

### 6. Filtered CSV Export
Compiles and streams a downloadable CSV containing all leads matching the current filters (without pagination bounds).
*   **URL**: `/api/leads/export/csv`
*   **Method**: `GET`
*   **Auth Required**: Yes (Admin Only)
*   **Query Parameters**: Supports identical filter queries as the list endpoint (`search`, `status`, `source`, `sort`).
*   **Response (200 OK)**: File Stream with header `Content-Type: text/csv`.
