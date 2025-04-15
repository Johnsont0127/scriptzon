# Scriptli - AI-Powered Video Scripts for Amazon Influencers

Scriptli is a full-stack SaaS application that helps Amazon influencers generate optimized video scripts for their product reviews. Built with Node.js and Express, this application provides a complete solution with authentication, AI script generation, subscription management, and affiliate tracking.

## Features

### Core Features
- **AI Script Generator**: Create 30-60 second product video scripts with hook → body → CTA format
- **Tiered Subscription Plans**:
  - Free: 3 scripts per month
  - Pro Monthly: $19/month for unlimited scripts
  - Pro Annual: $99/year (Save $129)
- **User Authentication**: Secure signup and login system
- **Script Management**: Save, edit, regenerate, and download scripts
- **Dashboard**: Track script usage and manage account
- **Stripe Integration**: Handle payments and subscription management
- **Affiliate System**: 30% recurring commission for referrals

### Bonus Features
- **Refer-a-Friend Program**: Earn rewards for referring new users
- **Onboarding Flow**: First-time user guidance
- **Email Capture**: Newsletter subscription on landing page
- **Mobile Responsive**: Works on all device sizes

## UI Design

Scriptli features a modern, minimalistic premium aesthetic designed specifically for Amazon influencers:

- **Color Palette**:
  - Primary: Amazon Gold (#FF9900)
  - Accent/Contrast: Jet Black (#0F0F0F)
  - Background: Snow White (#FAFAFA)
  - Card Backgrounds: Soft Gray (#F3F4F6)
  - Text: Charcoal Gray (#1F2937)

- **UI Style**:
  - Clean, card-based layout for dashboard and script history
  - Bold, rounded, high-contrast buttons (black with gold text)
  - Generous white space for modern feel
  - Clean sans-serif fonts (Inter, Poppins)
  - Sleek, responsive, and user-friendly interface

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: EJS templates, HTML, CSS, JavaScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Passport.js, bcrypt
- **Payments**: Stripe API
- **AI Integration**: OpenAI API
- **Affiliate Tracking**: Custom implementation (compatible with Lemon Squeezy)

## Project Structure

```
scriptli/
├── config/             # Configuration files
│   ├── passport.js     # Authentication configuration
│   └── openai.js       # OpenAI API configuration
├── controllers/        # Route controllers
│   ├── indexController.js
│   ├── userController.js
│   ├── scriptController.js
│   ├── paymentController.js
│   └── affiliateController.js
├── middleware/         # Custom middleware
│   └── auth.js         # Authentication middleware
├── models/             # Database models
│   ├── User.js
│   ├── Script.js
│   └── Affiliate.js
├── public/             # Static assets
│   ├── css/
│   ├── js/
│   └── img/
├── routes/             # Express routes
│   ├── index.js
│   ├── users.js
│   ├── scripts.js
│   ├── payments.js
│   └── affiliates.js
├── views/              # EJS templates
│   ├── landing.ejs
│   ├── dashboard.ejs
│   └── ...
├── docs/               # Documentation
│   └── detailed_replit_deployment.md
├── app.js              # Main application file
└── package.json        # Dependencies and scripts
```

## Deployment

### Quick Start with Replit

For the easiest deployment experience:

1. Download the provided `scriptli.zip` file
2. Create a new Node.js project on Replit
3. Upload and extract the ZIP file
4. Follow the detailed deployment guide in `docs/detailed_replit_deployment.md`

The deployment guide includes comprehensive instructions for:
- Setting up MongoDB Atlas (latest 2025 version)
- Configuring OpenAI API
- Setting up Stripe with the latest dashboard
- Integrating Lemon Squeezy for affiliate tracking
- Configuring all necessary environment variables
- Testing the application
- Connecting a custom domain

### Local Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   SESSION_SECRET=your_session_secret
   OPENAI_API_KEY=your_openai_api_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   LEMON_SQUEEZY_API_KEY=your_lemon_squeezy_api_key
   BASE_URL=http://localhost:3000
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Key Functionality

### Authentication System

- User registration and login
- Password reset functionality
- Session management
- Protected routes

### Script Generator

- Input form for product details, tone, and highlights
- OpenAI integration for AI-powered script generation
- Script saving and management
- Download scripts as text files

### Payment Processing

- Stripe Checkout integration
- Subscription management
- Webhook handling for subscription events
- Customer portal for managing billing

### Affiliate System

- Unique referral links for each user
- 30% recurring commission tracking
- Affiliate dashboard with statistics
- Social sharing functionality

## Customization

### Branding

To customize the branding:
1. Update the logo and favicon in the `public/img` directory
2. Modify the color scheme in the CSS files
3. Update the text content in the EJS templates

### Pricing

To change the pricing structure:
1. Update the subscription plans in `controllers/paymentController.js`
2. Modify the pricing display in `views/pricing.ejs`
3. Update the plan references throughout the application

## Support and Maintenance

For support or questions about this application, please contact the developer who provided this code.

## License

This project is licensed for your personal use only. Redistribution or resale is not permitted.
