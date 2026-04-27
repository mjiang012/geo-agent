# Deployment Guide

This document provides instructions for deploying Citify AI to production.

## Prerequisites

- Docker and Docker Compose (for containerized deployment)
- PostgreSQL database (managed instance recommended)
- Pinecone vector database account
- API keys for all external services
- SSL certificate (for HTTPS)
- Domain name

## Docker Deployment

1. Clone the repository
```bash
git clone <repository-url>
cd citify-ai
```

2. Create production environment file
```bash
cp .env.example .env
# Edit with production configuration
```

3. Build and start containers
```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. Verify the deployment
```bash
docker-compose ps
```

## Environment Variables

Key production settings:

```env
DEBUG=false
SERVER_HOST=0.0.0.0
SERVER_PORT=8000

# Database
DATABASE_URL=postgresql://user:password@db/citify_ai

# Pinecone
PINECONE_API_KEY=your-api-key
PINECONE_ENVIRONMENT=your-environment

# AI APIs
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Security
SECRET_KEY=your-secret-key-keep-it-safe!

# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/citify-ai.log
```

## Database Setup

For production, use a managed PostgreSQL service. The application will automatically initialize the database on first startup.

## Scaling

### Horizontal Scaling

For high-traffic deployments:

1. Use a load balancer (e.g., Nginx, AWS ALB)
2. Deploy multiple backend instances
3. Use Redis for session storage and caching
4. Configure database read replicas

### Vertical Scaling

- Increase Docker container resources
- Use larger compute instances

## Monitoring

### Application Logs

```bash
# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend
```

### Health Checks

- Backend: `http://localhost:8000/health`
- Frontend: Built-in Next.js health status

## Backup

### Database Backup

Schedule regular PostgreSQL backups:

```bash
docker-compose exec postgres pg_dump -U citify citify_ai > backup_$(date +%Y%m%d).sql
```

### Application Files

Backup:
- Configuration files
- Generated data
- User uploads

## Security Checklist

- [ ] Use HTTPS with valid SSL certificate
- [ ] Rotate API keys and secrets regularly
- [ ] Enable firewall for database
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Set up logging and monitoring
- [ ] Implement rate limiting
- [ ] Backup strategy in place
- [ ] Security headers configured
- [ ] Regular security audits performed

## Performance Optimization

1. Enable response compression
2. Configure CDN for static assets
3. Implement database query optimization
4. Use Redis caching
5. Optimize Docker images
6. Configure horizontal autoscaling
