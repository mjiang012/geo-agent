# API Documentation

## Overview

Citify AI API provides programmatic access to all GEO optimization capabilities.

Base URL: `http://localhost:8000/api/v1`

## Authentication

Authentication details coming soon.

## Monitor API

### Query Monitor

Monitor keyword references across AI search engines.

**Endpoint:** `POST /api/v1/monitor/query`

**Request Body:**
```json
{
  "keyword": "artificial intelligence",
  "sources": ["perplexity", "bing_copilot"],
  "query_templates": ["What is {keyword}"]
}
```

**Response:**
```json
{
  "keyword": "artificial intelligence",
  "timestamp": "2024-01-20T10:00:00Z",
  "sources": [...],
  "total_references": 42,
  "sentiment_score": 0.78,
  "competitor_references": {
    "competitor1.com": 12,
    "competitor2.com": 8
  }
}
```

### Get Monitor Status

Get monitoring status for a keyword.

**Endpoint:** `GET /api/v1/monitor/status/{keyword}`

### Get Monitor History

Get historical monitoring data.

**Endpoint:** `GET /api/v1/monitor/history/{keyword}?limit=30`

## Analyze API

### Analyze Content

Analyze content for RAG friendliness and optimization opportunities.

**Endpoint:** `POST /api/v1/analyze/content`

**Request Body:**
```json
{
  "content": "Your content here...",
  "content_type": "text",
  "analyze_features": ["structure", "keywords", "sentiment"]
}
```

### Analyze Document

Analyze an uploaded document.

**Endpoint:** `POST /api/v1/analyze/document`

**Content-Type:** `multipart/form-data`

## Optimize API

### Optimize Content

Optimize content for RAG friendliness.

**Endpoint:** `POST /api/v1/optimize/content`

**Request Body:**
```json
{
  "content": "Your content here...",
  "target_keywords": ["artificial intelligence", "AI"],
  "optimization_type": "balanced"
}
```

### Enhance with Data

Enhance content with industry data and statistics.

**Endpoint:** `POST /api/v1/optimize/enhance/data`

### Enhance with Quotes

Enhance content with expert quotes.

**Endpoint:** `POST /api/v1/optimize/enhance/quotes`

## Generate API

### Generate Questions

Generate long-tail questions based on a topic.

**Endpoint:** `POST /api/v1/generate/questions`

**Request Body:**
```json
{
  "topic": "artificial intelligence",
  "industry": "technology"
}
```

### Generate Content

Generate optimized content based on a topic.

**Endpoint:** `POST /api/v1/generate/content`

### Get Templates

Get content templates for specific industry and content type.

**Endpoint:** `POST /api/v1/generate/templates`

## Error Handling

All API responses include standard HTTP status codes:

- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

Rate limiting details coming soon.
