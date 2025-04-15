// Production environment configuration
module.exports = {
  NODE_ENV: 'production',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  LEMON_SQUEEZY_API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
  BASE_URL: process.env.BASE_URL || 'https://scriptzon.onrender.com'
};
