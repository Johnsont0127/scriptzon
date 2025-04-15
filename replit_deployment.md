# Scriptli - Deployment Instructions for Replit

This document provides step-by-step instructions for deploying the Scriptli application on Replit. Follow these instructions carefully to get your SaaS up and running quickly.

## Prerequisites

Before you begin, make sure you have:

1. A Replit account (sign up at [replit.com](https://replit.com) if you don't have one)
2. An OpenAI API key (sign up at [platform.openai.com](https://platform.openai.com))
3. A Stripe account (sign up at [stripe.com](https://stripe.com))
4. A Lemon Squeezy account (sign up at [lemonsqueezy.com](https://lemonsqueezy.com)) or Rewardful account for affiliate tracking

## Step 1: Create a New Repl

1. Log in to your Replit account
2. Click the "+" button to create a new repl
3. Select "Node.js" as the template
4. Name your repl "scriptli" or any name you prefer
5. Click "Create Repl"

## Step 2: Upload the Code

There are two ways to upload the code to Replit:

### Option 1: Upload ZIP File (Recommended)

1. Download the ZIP file containing the Scriptli code
2. In your Replit project, click on the three dots (...) next to "Files" in the sidebar
3. Select "Upload file"
4. Upload the ZIP file
5. Once uploaded, right-click on the ZIP file and select "Extract"

### Option 2: Manual File Creation

1. In your Replit project, create the folder structure as shown in the project
2. Copy and paste the code from each file into the corresponding file in Replit

## Step 3: Set Up Environment Variables

1. In your Replit project, click on the "Secrets" tool in the left sidebar (lock icon)
2. Add the following environment variables:

```
PORT=3000
MONGODB_URI=your_mongodb_uri
SESSION_SECRET=your_session_secret
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
BASE_URL=your_replit_url
```

For the `BASE_URL`, you'll need to use the URL of your Replit app. This will be available after you run the app for the first time. It will look something like `https://scriptli.yourusername.repl.co`.

## Step 4: Set Up MongoDB

1. Sign up for a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient)
3. Click "Connect" on your cluster
4. Select "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Add this connection string as the `MONGODB_URI` in your Replit Secrets

## Step 5: Set Up OpenAI API

1. Log in to your OpenAI account at [platform.openai.com](https://platform.openai.com)
2. Navigate to the API keys section
3. Create a new API key
4. Copy the API key
5. Add this key as the `OPENAI_API_KEY` in your Replit Secrets

## Step 6: Set Up Stripe

1. Log in to your Stripe account at [dashboard.stripe.com](https://dashboard.stripe.com)
2. Make sure you're in test mode (toggle in the top-right corner)
3. Go to Developers > API keys
4. Copy the Secret key
5. Add this key as the `STRIPE_SECRET_KEY` in your Replit Secrets
6. For the webhook secret:
   - Go to Developers > Webhooks
   - Click "Add endpoint"
   - For the endpoint URL, use your Replit URL + "/payments/webhook" (e.g., `https://scriptli.yourusername.repl.co/payments/webhook`)
   - Select events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Click "Add endpoint"
   - Click "Reveal" to see the signing secret
   - Add this secret as the `STRIPE_WEBHOOK_SECRET` in your Replit Secrets

## Step 7: Install Dependencies and Run the App

1. In your Replit project, open the Shell tab
2. Run the following command to install dependencies:

```bash
npm install
```

3. Once the installation is complete, click the "Run" button at the top of the Replit interface
4. Your app should now be running! You'll see the URL in the webview

## Step 8: Set Up Your Custom Domain (Optional)

If you want to use a custom domain instead of the Replit URL:

1. In your Replit project, click on the "Webview" tab
2. Click on the settings icon (gear) in the top-right corner
3. Select "Custom domains"
4. Follow the instructions to connect your domain

## Step 9: Test the Application

1. Visit your Replit URL in a browser
2. Test the following features:
   - User registration and login
   - Script generation
   - Subscription management (use Stripe test cards)
   - Affiliate system
   - Refer-a-friend functionality

## Troubleshooting

If you encounter any issues:

1. **Application won't start**: Check the console for error messages. Common issues include:
   - Missing environment variables
   - MongoDB connection issues
   - Port conflicts

2. **OpenAI API errors**: Verify your API key is correct and has sufficient credits

3. **Stripe integration issues**: Make sure you've set up the webhook correctly and are using test mode

4. **Database connection issues**: Ensure your MongoDB Atlas IP whitelist includes Replit's IP ranges

## Moving to Production

When you're ready to move to production:

1. Update your Stripe keys to production keys
2. Set up proper error logging
3. Implement additional security measures
4. Consider upgrading your Replit plan for better performance

## Need Help?

If you need further assistance, please reach out through the contact information provided with this project.
