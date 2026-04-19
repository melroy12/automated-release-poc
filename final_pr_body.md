## 🚀 Release Summary
This PR was auto-generated from the `dev` branch. It contains all code ready for the production environment.

## 📝 Endpoint Details (Auto-Parsed from Swagger)
### `PUT /v2/projects/{project_id}/keyword/user-trigger`

**Summary:** Rewrite Article User Trigger

**Expected Success:** `200` - Returns currentStatus: PROCESSING and dynamodbInserted: true

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "currentStatus": "PROCESSING",
    "dynamodbInserted": true
  },
  "timestamp": "2026-04-19T10:30:00Z"
}
```

**Error Cases (Verified in dev):**
* `400`: Missing subKeywordId OR rewrite_user_trigger_generation_count is 0
  ```json
  {
    "status": "error",
    "error": {
      "code": "MISSING_REQUIRED_FIELD",
      "message": "Missing subKeywordId"
    },
    "timestamp": "2026-04-19T10:30:00Z"
  }
  ```
* `401`: Unauthorized - Invalid or missing authentication token
* `403`: Forbidden - User does not have permission to access this project
* `404`: Project not found
* `429`: Rate limit exceeded - Too many requests
* `500`: Internal server error - Failed to process request

---

### `GET /v2/projects/{project_id}/articles`

**Summary:** List All Articles for Project

**Expected Success:** `200` - Returns array of articles with metadata

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "articles": [
      {
        "id": "<string>",
        "title": "<string>",
        "status": "<string>"
      }
    ],
    "total": 42
  },
  "timestamp": "2026-04-19T10:30:00Z"
}
```

**Error Cases (Verified in dev):**
* `400`: Invalid pagination parameters (limit/offset out of range)
  ```json
  {
    "status": "error",
    "error": {
      "code": "INVALID_PAGINATION",
      "message": "Invalid pagination parameters"
    },
    "timestamp": "2026-04-19T10:30:00Z"
  }
  ```
* `401`: Unauthorized - Invalid or missing authentication token
* `403`: Forbidden - User does not have permission to access this project
* `404`: Project not found
* `500`: Internal server error - Database query failed

---

### `POST /v2/projects/{project_id}/articles`

**Summary:** Create New Article

**Expected Success:** `201` - Article created successfully with generated ID

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "articleId": "art_abc123",
    "slug": "my-new-article"
  },
  "timestamp": "2026-04-19T10:30:00Z"
}
```

**Error Cases (Verified in dev):**
* `400`: Invalid article data - Missing required fields (title, content) or invalid format
  ```json
  {
    "status": "error",
    "error": {
      "code": "MISSING_REQUIRED_FIELD",
      "message": "Missing required fields: title, content"
    },
    "timestamp": "2026-04-19T10:30:00Z"
  }
  ```
* `401`: Unauthorized - Invalid or missing authentication token
* `403`: Forbidden - User does not have permission to create articles in this project
* `409`: Conflict - Article with same slug already exists
* `413`: Payload too large - Article content exceeds maximum size
* `500`: Internal server error - Failed to create article
* `503`: Service unavailable - Database connection timeout

---

### `GET /v2/projects/{project_id}/articles/{article_id}`

**Summary:** Get Article by ID

**Expected Success:** `200` - Returns article details with full content

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "id": "art_abc123",
    "title": "How to Build APIs",
    "content": "Full article content...",
    "status": "published",
    "createdAt": "2026-04-15T09:00:00Z",
    "updatedAt": "2026-04-19T10:30:00Z"
  },
  "timestamp": "2026-04-19T10:30:00Z"
}
```

**Error Cases (Verified in dev):**
* `401`: Unauthorized - Invalid or missing authentication token
  ```json
  {
    "status": "error",
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid or missing authentication token"
    },
    "timestamp": "2026-04-19T10:30:00Z"
  }
  ```
* `403`: Forbidden - User does not have permission to view this article
* `404`: Article not found or project not found
* `500`: Internal server error - Failed to retrieve article

---

### `PUT /v2/projects/{project_id}/articles/{article_id}`

**Summary:** Update Article

**Expected Success:** `200` - Article updated successfully

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "articleId": "art_abc123",
    "updatedFields": [
      "title",
      "content"
    ]
  },
  "timestamp": "2026-04-19T10:30:00Z"
}
```

**Error Cases (Verified in dev):**
* `400`: Invalid update data - Invalid field values or format
  ```json
  {
    "status": "error",
    "error": {
      "code": "INVALID_INPUT",
      "message": "Invalid field values or format"
    },
    "timestamp": "2026-04-19T10:30:00Z"
  }
  ```
* `401`: Unauthorized - Invalid or missing authentication token
* `403`: Forbidden - User does not have permission to update this article
* `404`: Article not found
* `409`: Conflict - Version mismatch (optimistic locking)
* `500`: Internal server error - Failed to update article

---

### `DELETE /v2/projects/{project_id}/articles/{article_id}`

**Summary:** Delete Article

**Expected Success:** `204` - Article deleted successfully

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "deletedId": "art_abc123"
  },
  "timestamp": "2026-04-19T10:30:00Z"
}
```

**Error Cases (Verified in dev):**
* `401`: Unauthorized - Invalid or missing authentication token
  ```json
  {
    "status": "error",
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid or missing authentication token"
    },
    "timestamp": "2026-04-19T10:30:00Z"
  }
  ```
* `403`: Forbidden - User does not have permission to delete this article
* `404`: Article not found
* `409`: Conflict - Article has dependent resources that must be deleted first
* `500`: Internal server error - Failed to delete article

---

### `GET /v2/projects/{project_id}/analytics`

**Summary:** Get Project Analytics

**Expected Success:** `200` - Returns analytics data including views, engagement metrics

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "totalViews": 15234,
    "uniqueVisitors": 8421,
    "avgEngagementTime": 127.5,
    "dateRange": {
      "start": "2026-04-01",
      "end": "2026-04-19"
    }
  },
  "timestamp": "2026-04-19T10:30:00Z"
}
```

**Error Cases (Verified in dev):**
* `400`: Invalid date range or analytics parameters
  ```json
  {
    "status": "error",
    "error": {
      "code": "INVALID_DATE_RANGE",
      "message": "Invalid date range or analytics parameters"
    },
    "timestamp": "2026-04-19T10:30:00Z"
  }
  ```
* `401`: Unauthorized - Invalid or missing authentication token
* `403`: Forbidden - User does not have analytics access for this project
* `404`: Project not found
* `500`: Internal server error - Analytics processing failed
* `504`: Gateway timeout - Analytics query took too long

---

### `GET /v2/users/{user_id}/preferences`

**Summary:** Get User Preferences

**Expected Success:** `200` - Returns user preference settings

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "theme": "dark",
    "notifications": true,
    "language": "en-US",
    "timezone": "America/New_York"
  },
  "timestamp": "2026-04-19T10:30:00Z"
}
```

**Error Cases (Verified in dev):**
* `401`: Unauthorized - Invalid or missing authentication token
  ```json
  {
    "status": "error",
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid or missing authentication token"
    },
    "timestamp": "2026-04-19T10:30:00Z"
  }
  ```
* `403`: Forbidden - Cannot access another user's preferences
* `404`: User not found
* `500`: Internal server error - Failed to retrieve preferences

---

### `PATCH /v2/users/{user_id}/preferences`

**Summary:** Update User Preferences

**Expected Success:** `200` - Preferences updated successfully

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "updatedPreferences": [
      "theme",
      "notifications"
    ]
  },
  "timestamp": "2026-04-19T10:30:00Z"
}
```

**Error Cases (Verified in dev):**
* `400`: Invalid preference values or unsupported preference keys
  ```json
  {
    "status": "error",
    "error": {
      "code": "INVALID_PREFERENCE",
      "message": "Invalid preference values or unsupported keys"
    },
    "timestamp": "2026-04-19T10:30:00Z"
  }
  ```
* `401`: Unauthorized - Invalid or missing authentication token
* `403`: Forbidden - Cannot modify another user's preferences
* `404`: User not found
* `422`: Unprocessable entity - Preference validation failed
* `500`: Internal server error - Failed to update preferences

---



## ✅ Tech Lead Sign-Off
- [ ] Automated tests in `dev` have passed.
- [ ] All 400/500 error cases were verified in the `dev` environment.
- [ ] Response structures conform to the standard format (verified below).
- [ ] API documentation is up-to-date.
- [ ] Ready to trigger Fargate deployment.