# ScriptZon Deployment Configuration for Render.com

This file contains instructions for deploying ScriptZon to Render.com as a Web Service.

## Deployment Steps

1. Create a new Web Service on Render.com
2. Connect to your GitHub repository or use the manual deploy option
3. Configure the following settings:

### Basic Settings
- **Name**: scriptzon
- **Environment**: Node
- **Region**: Choose the region closest to your users

### Build & Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `node app.js`
- **Auto-Deploy**: Yes

### Environment Variables
Add the following environment variables:
- `NODE_ENV`: production
- `PORT`: 10000
- `MONGODB_URI`: Your MongoDB connection string
- `SESSION_SECRET`: A random string for session security
- `OPENAI_API_KEY`: Your OpenAI API key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `LEMON_SQUEEZY_API_KEY`: Your Lemon Squeezy API key
- `BASE_URL`: Will be automatically set to your Render URL

## Custom Domain Setup
After deployment, follow the instructions in custom_domain_setup.md to connect your custom domain.
