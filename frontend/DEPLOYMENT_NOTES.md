# Deployment Notes for Turnatoru Frontend

## Production Build

```bash
npm run build
```

Output: `dist/` folder with optimized bundle.

## Deployment Options

### Option 1: Static Hosting (Vercel, Netlify)

1. Build the app: `npm run build`
2. Connect `dist/` folder to Vercel/Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL=https://api.your-domain.com`

**Update vite.config.js**:
```js
proxy: {
  '/api': {
    target: process.env.VITE_API_URL || 'http://localhost:8000',
    changeOrigin: true
  }
}
```

### Option 2: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=0 /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build & run:
```bash
docker build -t turnatoru-frontend .
docker run -p 3000:3000 -e VITE_API_URL=http://backend:8000 turnatoru-frontend
```

### Option 3: Traditional Server (Nginx)

```nginx
server {
    listen 80;
    server_name turnatoru.your-domain.com;

    root /var/www/turnatoru/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://django-backend:8000;
        proxy_set_header Host $host;
    }
}
```

## Environment Variables

Create `.env.production` (not tracked):
```
VITE_API_URL=https://api.turnatoru.com
```

Update vite.config.js to read from env:
```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // ... config
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000'
        }
      }
    }
  }
})
```

## Performance Optimization

### Code Splitting
Add to vite.config.js:
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        pdf: ['jspdf', 'html2canvas'],
        vendor: ['react', 'react-dom', 'react-router-dom', 'axios']
      }
    }
  }
}
```

### CDN for Large Dependencies
Use unpkg/jsDelivr for optional packages. Update index.html:
```html
<script src="https://cdn.jsdelivr.net/npm/jspdf"></script>
```

## Security

1. **HTTPS Only**: Ensure all API calls go over HTTPS in production
2. **CORS**: Configure Django CORS middleware for frontend origin
3. **Token Storage**: Consider moving from localStorage to httpOnly cookies
4. **Rate Limiting**: Add rate limiting on token generation / feedback submission

### Django CORS Configuration:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://turnatoru.your-domain.com",
]

CSRF_TRUSTED_ORIGINS = [
    "https://turnatoru.your-domain.com",
]
```

## Monitoring

1. **Sentry** for error tracking:
```bash
npm install @sentry/react
```

2. **Google Analytics** for user tracking:
```bash
npm install react-ga4
```

## Rollback Strategy

Keep previous builds in S3/artifact storage:
```bash
# Save build with timestamp
aws s3 cp dist/ s3://turnatoru-builds/v1.0.0/
```

## CI/CD Pipeline Example (GitHub Actions)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: cd frontend && npm install -g vercel && vercel --prod --token $VERCEL_TOKEN
```

## Post-Deployment Checklist

- [ ] Build succeeds without warnings
- [ ] API proxy configured correctly
- [ ] Login/Register works
- [ ] Form creation flow works end-to-end
- [ ] Token generation works
- [ ] Anonymous token submission works
- [ ] PDF export works
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] HTTPS enforced
- [ ] Error handling tested (invalid tokens, network errors)
