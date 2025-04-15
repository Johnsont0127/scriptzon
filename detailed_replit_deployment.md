# Detailed Scriptli Deployment Guide for Replit (2025 Edition)

This comprehensive guide will walk you through deploying Scriptli on Replit step-by-step, using the latest versions of all services as of April 2025. Follow these instructions carefully to get your Amazon influencer SaaS up and running quickly.

## Table of Contents
1. [Setting Up Your Replit Account](#1-setting-up-your-replit-account)
2. [Creating a New Repl](#2-creating-a-new-repl)
3. [Uploading the Scriptli Files](#3-uploading-the-scriptli-files)
4. [Setting Up MongoDB Atlas](#4-setting-up-mongodb-atlas)
5. [Configuring OpenAI API](#5-configuring-openai-api)
6. [Setting Up Stripe](#6-setting-up-stripe)
7. [Setting Up Lemon Squeezy](#7-setting-up-lemon-squeezy)
8. [Configuring Environment Variables](#8-configuring-environment-variables)
9. [Running the Application](#9-running-the-application)
10. [Testing Your Application](#10-testing-your-application)
11. [Connecting a Custom Domain](#11-connecting-a-custom-domain)
12. [Troubleshooting](#12-troubleshooting)

## 1. Setting Up Your Replit Account

1. **Create a Replit Account**:
   - Go to [replit.com](https://replit.com)
   - Click "Sign Up" in the top-right corner
   - You can sign up with Google, GitHub, or email
   - Complete the registration process

2. **Verify Your Email**:
   - Check your inbox for a verification email from Replit
   - Click the verification link to activate your account

## 2. Creating a New Repl

1. **Create a New Repl**:
   - After logging in, click the "+ Create Repl" button in the top-right corner
   - In the template selection screen, choose "Node.js"
   - Name your repl "scriptli" (or any name you prefer)
   - Click "Create Repl"

2. **Familiarize Yourself with the Replit Interface**:
   - Left sidebar: File explorer
   - Center: Code editor
   - Right: Preview window (shows your running application)
   - Bottom: Shell/console

## 3. Uploading the Scriptli Files

### Option 1: Using the Provided ZIP File (Recommended)

1. **Download the ZIP File**:
   - Save the scriptli.zip file I've provided to your local computer

2. **Upload to Replit**:
   - In your Replit project, look for the "Files" panel on the left side
   - Click the three dots (⋮) next to "Files"
   - Select "Upload file"
   - Choose the scriptli.zip file from your computer
   - Wait for the upload to complete

3. **Extract the ZIP File**:
   - In the Replit shell (bottom panel), run:
     ```bash
     unzip scriptli.zip -d .
     ```
   - If prompted to overwrite any files, type "A" to overwrite all
   - After extraction, you can delete the ZIP file:
     ```bash
     rm scriptli.zip
     ```

### Option 2: Manual File Creation (Alternative)

If you prefer to set up the files manually or are having issues with the ZIP file:

1. **Create the Directory Structure**:
   ```bash
   mkdir -p public/css public/js public/img views routes controllers models config middleware docs
   ```

2. **Copy and Paste Each File**:
   - For each file in the project, create a new file in the appropriate directory
   - Copy the content from the provided files and paste it into the corresponding file in Replit

## 4. Setting Up MongoDB Atlas

MongoDB Atlas is a cloud database service that we'll use to store all application data.

1. **Create a MongoDB Atlas Account**:
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Click "Try Free" and sign up for an account
   - Complete the registration process

2. **Create a New Cluster**:
   - After logging in, click "Build a Database"
   - Choose the "FREE" tier (M0 Sandbox)
   - Select your preferred cloud provider (AWS, Google Cloud, or Azure)
   - Choose the region closest to your users
   - Click "Create Cluster" (this may take a few minutes to provision)

3. **Set Up Database Access**:
   - In the left sidebar, click "Database Access" under SECURITY
   - Click "Add New Database User"
   - Create a username and password (use a strong password and save it securely)
   - Set "Database User Privileges" to "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**:
   - In the left sidebar, click "Network Access" under SECURITY
   - Click "Add IP Address"
   - For development purposes, click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Your Connection String**:
   - Once your cluster is created, click "Connect"
   - Select "Connect your application"
   - Choose "Node.js" as your driver and the latest version
   - Copy the connection string (it will look like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your database user's password
   - Save this connection string for later use in the environment variables

## 5. Configuring OpenAI API

1. **Create an OpenAI Account**:
   - Go to [platform.openai.com](https://platform.openai.com)
   - Click "Sign Up" and create an account
   - Complete the registration process

2. **Get Your API Key**:
   - After logging in, click on your profile icon in the top-right corner
   - Select "View API keys"
   - Click "Create new secret key"
   - Give your key a name (e.g., "Scriptli")
   - Copy the API key and save it securely (you won't be able to see it again)

3. **Set Up Billing (Required for API Usage)**:
   - In the left sidebar, click "Billing"
   - Add a payment method
   - Add credits to your account (OpenAI requires a paid account to use the API)

## 6. Setting Up Stripe

1. **Create a Stripe Account**:
   - Go to [stripe.com](https://stripe.com)
   - Click "Start now" and sign up for an account
   - Complete the registration process

2. **Get Your API Keys**:
   - After logging in, make sure you're in "Test Mode" (toggle in the top-right)
   - In the left sidebar, click "Developers" > "API keys"
   - You'll see your "Publishable key" and "Secret key"
   - Copy both keys and save them securely

3. **Set Up Webhook Endpoint**:
   - In the left sidebar, click "Developers" > "Webhooks"
   - Click "Add endpoint"
   - For the endpoint URL, you'll need your Replit URL + "/payments/webhook"
     (You'll get your Replit URL after running the app for the first time, so you may need to come back to this step)
   - For now, you can use a placeholder like "https://scriptli.yourusername.repl.co/payments/webhook"
   - Under "Events to listen to", select:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Click "Add endpoint"

4. **Get Your Webhook Secret**:
   - After creating the webhook, click on it in the list
   - Click "Reveal" next to "Signing secret"
   - Copy this secret and save it securely

5. **Create Products and Prices**:
   - In the left sidebar, click "Products"
   - Click "Add product"
   - Create two products:
     
     **Product 1: Pro Monthly**
     - Name: "Scriptli Pro Monthly"
     - Description: "Unlimited AI-generated video scripts for Amazon influencers"
     - Pricing: Recurring, $19.00 USD / month
     
     **Product 2: Pro Annual**
     - Name: "Scriptli Pro Annual"
     - Description: "Unlimited AI-generated video scripts for Amazon influencers"
     - Pricing: Recurring, $99.00 USD / year

## 7. Setting Up Lemon Squeezy

1. **Create a Lemon Squeezy Account**:
   - Go to [lemonsqueezy.com](https://lemonsqueezy.com)
   - Click "Sign Up" and create an account
   - Complete the registration process

2. **Set Up Your Store**:
   - After logging in, create a new store if prompted
   - Fill in your store details

3. **Get Your API Key**:
   - In the left sidebar, click "Settings" > "API"
   - Click "Create API Key"
   - Give your key a name (e.g., "Scriptli")
   - Copy the API key and save it securely

4. **Set Up Affiliate Program**:
   - In the left sidebar, click "Affiliates"
   - Click "Create Affiliate Program"
   - Configure your program with:
     - Name: "Scriptli Affiliate Program"
     - Commission Rate: 30%
     - Cookie Duration: 30 days
   - Click "Create Affiliate Program"

## 8. Configuring Environment Variables

In Replit, environment variables are stored securely as "Secrets":

1. **Access Secrets**:
   - In your Replit project, click on the "Secrets" tool in the left sidebar (lock icon)
   - If you don't see it, click on "Tools" first, then find "Secrets"

2. **Add the Following Secrets**:
   - Click "Add new secret" for each of these:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `PORT` | `3000` | The port your application will run on |
   | `MONGODB_URI` | Your MongoDB connection string | From MongoDB Atlas setup |
   | `SESSION_SECRET` | A random string | For securing sessions (e.g., `scriptli_session_secret_123`) |
   | `OPENAI_API_KEY` | Your OpenAI API key | From OpenAI setup |
   | `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | From Stripe setup |
   | `STRIPE_SECRET_KEY` | Your Stripe secret key | From Stripe setup |
   | `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret | From Stripe webhook setup |
   | `LEMON_SQUEEZY_API_KEY` | Your Lemon Squeezy API key | From Lemon Squeezy setup |
   | `BASE_URL` | Your Replit URL | Will be available after first run (e.g., `https://scriptli.yourusername.repl.co`) |

   Note: For the `BASE_URL`, you'll need to run the application first to get your Replit URL, then come back and add this secret.

## 9. Running the Application

1. **Install Dependencies**:
   - In the Replit shell (bottom panel), run:
     ```bash
     npm install
     ```
   - This will install all the required packages defined in package.json
   - Wait for the installation to complete (this may take a few minutes)

2. **Start the Application**:
   - Click the "Run" button at the top of the Replit interface
   - Alternatively, in the shell, run:
     ```bash
     npm start
     ```
   - You should see output indicating that the server has started

3. **Get Your Replit URL**:
   - Once the application is running, you'll see a browser window open in the right panel
   - The URL in this browser is your Replit URL (e.g., `https://scriptli.yourusername.repl.co`)
   - Copy this URL and add it as the `BASE_URL` environment variable in Secrets
   - Also update your Stripe webhook endpoint with this URL + "/payments/webhook"

## 10. Testing Your Application

1. **Test User Registration**:
   - Visit your Replit URL in a browser
   - Click "Sign Up" or "Get Started"
   - Create a test account

2. **Test Script Generation**:
   - After logging in, go to the dashboard
   - Click "Create New Script"
   - Fill in the product details and generate a script
   - Verify that the script is generated correctly

3. **Test Subscription (Using Stripe Test Cards)**:
   - Go to the pricing page
   - Select a subscription plan
   - Use Stripe test card numbers for payment:
     - Test successful payment: `4242 4242 4242 4242`
     - Test card decline: `4000 0000 0000 0002`
     - Expiration date: Any future date
     - CVC: Any 3 digits
     - ZIP: Any 5 digits

4. **Test Affiliate System**:
   - Go to your account page
   - Find the "Refer a Friend" section
   - Copy your referral link
   - Open an incognito/private browser window
   - Paste the referral link and sign up as a new user
   - Verify that the referral is tracked correctly

## 11. Connecting a Custom Domain

If you want to use your own domain instead of the Replit URL:

1. **Purchase a Domain** (if you don't already have one):
   - Use a domain registrar like Namecheap, GoDaddy, or Google Domains

2. **Connect Domain to Replit**:
   - In your Replit project, click on the webview (browser preview)
   - Click the settings icon (gear) in the top-right corner
   - Select "Custom domains"
   - Click "Add a custom domain"
   - Enter your domain name and follow the instructions
   - You'll need to add DNS records at your domain registrar:
     - Type: `CNAME`
     - Name: `www` or `@` (for root domain)
     - Value: Your Replit URL (without https://)
     - TTL: 3600 or default

3. **Update Environment Variables**:
   - Once your domain is connected, update the `BASE_URL` environment variable to use your custom domain
   - Also update your Stripe webhook endpoint with your custom domain

## 12. Troubleshooting

### Common Issues and Solutions

1. **Application Won't Start**:
   - Check the console for error messages
   - Verify all environment variables are set correctly
   - Make sure MongoDB connection string is correct and includes your password
   - Check that all required packages are installed

2. **MongoDB Connection Issues**:
   - Verify your IP whitelist in MongoDB Atlas includes 0.0.0.0/0
   - Check that your connection string is correct
   - Make sure your MongoDB user has the correct permissions

3. **OpenAI API Errors**:
   - Verify your API key is correct
   - Check that you have billing set up and credits available
   - If you're getting rate limit errors, you may need to upgrade your OpenAI plan

4. **Stripe Integration Issues**:
   - Make sure you're using test mode keys during development
   - Verify webhook endpoint is correctly configured
   - Check that products and prices are set up correctly

5. **Replit-Specific Issues**:
   - If your application stops after closing the Replit tab, enable "Always On" in the Replit settings
   - If you're experiencing performance issues, consider upgrading to a paid Replit plan

### Getting Help

If you encounter issues not covered in this guide:

1. Check the Replit documentation: [docs.replit.com](https://docs.replit.com)
2. Search for solutions on Stack Overflow
3. Join the Replit Discord community for real-time help
4. Reach out to me for additional assistance

## Next Steps After Deployment

Once your application is successfully deployed:

1. **Customize Your Branding**:
   - Update the logo and images in the `public/img` directory
   - Modify text content in the EJS templates to match your brand voice

2. **Set Up Analytics**:
   - Add Google Analytics or another analytics tool to track user behavior

3. **Implement Email Notifications**:
   - Set up an email service like SendGrid or Mailgun for user notifications

4. **Move to Production**:
   - When ready to launch, switch Stripe to production mode
   - Update your OpenAI API usage limits as needed
   - Consider upgrading your MongoDB Atlas and Replit plans for better performance

Congratulations! You now have a fully functional SaaS application for Amazon influencers to generate AI-optimized video scripts.
