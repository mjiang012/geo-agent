# Citify AI - GEO Workflow Engine

Citify AI is a comprehensive platform for optimizing content for AI search engines and RAG (Retrieval-Augmented Generation) systems. It provides tools for monitoring, analyzing, optimizing, and generating content that is highly visible and quotable by modern AI systems.

## Features

### 1. AI Context Monitor (Monitor)
- Monitor keyword references across multiple AI search engines
- Daily automated checks using industry-standard query templates
- Multi-model comparison analysis (GPT-4, Claude, Mistral)
- Sentiment analysis and competitor association mapping

### 2. RAG Insight Analyzer (Analyze)
- Content feature extraction (headings, data visualizations, quotes)
- Semantic analysis (information entropy, viewpoint uniqueness, EEAT compliance)
- Gap analysis using BERTopic
- Industry benchmark comparison

### 3. GEO Optimizer (Optimize)
- Automatic insertion of industry benchmark data
- Expert quote recommendations from Semantic Scholar
- Markdown conversion engine with multiple content templates
- Real-time collaboration via browser extension
- Paragraph-by-paragraph scoring system

### 4. Long-tail Generator (Generate)
- Industry-specific prompt pattern identification
- User intent classification
- COST principle compliance
- Search volume estimation and competitor coverage analysis

## Architecture

### Tech Stack

**Backend**
- Python 3.11+
- FastAPI (Web Framework)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Pinecone (Vector Database)

**Frontend**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

**AI Integration**
- OpenAI API (GPT-4, text-embedding-3-large)
- Anthropic API (Claude 3)
- BERTopic (Topic Modeling)

**Browser Extension**
- Manifest V3
- Chrome/Edge support

## Project Structure

```
citify-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── monitor/
│   │   │       ├── analyze/
│   │   │       ├── optimize/
│   │   │       └── generate/
│   │   ├── services/
│   │   │   ├── collector/
│   │   │   ├── analyzer/
│   │   │   ├── optimizer/
│   │   │   └── generator/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── config/
│   │   └── main.py
│   ├── database/
│   ├── data/
│   ├── logs/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   ├── components/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── analyze/
│   │   ├── optimize/
│   │   └── generate/
│   ├── lib/
│   ├── types/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── extension/
│   ├── src/
│   │   ├── background/
│   │   ├── content/
│   │   ├── popup/
│   │   └── options/
│   ├── icons/
│   ├── manifest.json
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)
- API Keys:
  - OpenAI API Key
  - Anthropic API Key (optional)
  - Pinecone API Key
  - Statista API Key (optional)
  - Semantic Scholar API Key (optional)

### Quick Start with Docker

1. Clone the repository
```bash
git clone <repository-url>
cd citify-ai
```

2. Copy the environment example file
```bash
cp .env.example .env
```

3. Edit the `.env` file and add your API keys

4. Start the services with Docker Compose
```bash
docker-compose up -d
```

5. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Local Development Setup

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Browser Extension Setup

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` directory from this project

## API Documentation

The API documentation is available at `http://localhost:8000/docs` when running the backend. It includes detailed information about all endpoints, request/response schemas, and interactive testing capability.

### Main Endpoints

**Monitor**
- `POST /api/v1/monitor/query` - Monitor keyword references
- `GET /api/v1/monitor/status/{keyword}` - Get monitoring status
- `GET /api/v1/monitor/history/{keyword}` - Get historical monitoring data

**Analyze**
- `POST /api/v1/analyze/content` - Analyze content
- `POST /api/v1/analyze/document` - Analyze uploaded document

**Optimize**
- `POST /api/v1/optimize/content` - Optimize content
- `POST /api/v1/optimize/enhance/data` - Enhance with data
- `POST /api/v1/optimize/enhance/quotes` - Enhance with quotes

**Generate**
- `POST /api/v1/generate/questions` - Generate questions
- `POST /api/v1/generate/content` - Generate content
- `POST /api/v1/generate/templates` - Get templates

## Configuration

### Environment Variables

See `.env.example` for all configurable environment variables. Key configurations include:

- Database connection details
- Vector database (Pinecone) settings
- AI API keys
- Logging configuration
- Data storage paths

## Development Guide

### Adding New Features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make your changes in the appropriate directory
3. Add tests for your changes
4. Submit pull request

### Code Style

**Backend**
- Follow PEP 8 guidelines
- Use type hints
- Document functions and classes

**Frontend**
- Follow TypeScript best practices
- Use functional components with hooks
- Keep components small and focused

## Pricing Model

- **Basic**: $99/month - 10 keyword monitoring
- **Professional**: $499/month - 50 keywords + competitor analysis
- **Enterprise**: Custom pricing - API access, private deployment

## Quality Assurance

- **Monitoring Accuracy**: 95%+ accuracy requirement with manual sampling
- **Optimization Effectiveness**: Integrated A/B testing framework
- **System Stability**: 99.9% uptime SLA guarantee

## Support

For support, please contact support@citify.ai or visit our documentation at https://docs.citify.ai.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT License - see LICENSE file for details.

## Roadmap

**Q1 - MVP**
- Core monitoring dashboard
- Basic analysis features

**Q2 - Browser Extension**
- RAG insight analyzer
- Real-time optimization suggestions
- Browser extension release

**Q3 - Enterprise API**
- API documentation and SDKs
- CMS integrations
- Batch processing capabilities

**Q4 - Industry Solutions**
- 200+ industry benchmark datasets
- Industry-specific templates
- Advanced reporting features
