// Payment controller for ScriptZon
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Affiliate = require('../models/Affiliate');

// Display pricing page
exports.showPricing = (req, res) => {
  res.render('pricing', {
    title: 'Pricing | ScriptZon',
    user: req.user,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
};

// Create checkout session for subscription
exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId, plan } = req.body;
    
    // Get the referring affiliate if any
    let referringAffiliateId = null;
    if (req.user.referredBy) {
      const referringUser = await User.findOne({ 'affiliate.referralCode': req.user.referredBy });
      if (referringUser && referringUser.affiliate) {
        referringAffiliateId = referringUser.affiliate._id;
      }
    }
    
    // Create a customer if this user doesn't have one yet
    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user._id.toString(),
          referringAffiliateId: referringAffiliateId
        }
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.BASE_URL || 'http://localhost:3000'}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:3000'}/payments/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        plan: plan,
        referringAffiliateId: referringAffiliateId
      }
    });
    
    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Handle successful subscription
exports.handleSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      req.flash('error_msg', 'Invalid session');
      return res.redirect('/dashboard');
    }
    
    // Retrieve the session to get subscription details
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Update user subscription status
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.plan': session.metadata.plan,
      'subscription.status': 'active',
      'subscription.stripeSubscriptionId': session.subscription
    });
    
    // Process affiliate commission if applicable
    if (session.metadata.referringAffiliateId) {
      await Affiliate.findByIdAndUpdate(session.metadata.referringAffiliateId, {
        $push: {
          referrals: {
            user: req.user._id,
            date: new Date(),
            status: 'active',
            plan: session.metadata.plan
          }
        }
      });
    }
    
    res.render('success', {
      title: 'Subscription Success | ScriptZon',
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error processing subscription');
    res.redirect('/dashboard');
  }
};

// Handle cancelled subscription
exports.handleCancel = (req, res) => {
  res.render('cancel', {
    title: 'Subscription Cancelled | ScriptZon',
    user: req.user
  });
};

// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Process the subscription (already handled in success route)
      break;
      
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      // Update subscription status
      if (subscription.metadata && subscription.metadata.userId) {
        await User.findByIdAndUpdate(subscription.metadata.userId, {
          'subscription.status': subscription.status
        });
      }
      break;
      
    case 'customer.subscription.deleted':
      const cancelledSubscription = event.data.object;
      // Update subscription status to cancelled
      if (cancelledSubscription.metadata && cancelledSubscription.metadata.userId) {
        await User.findByIdAndUpdate(cancelledSubscription.metadata.userId, {
          'subscription.status': 'cancelled',
          'subscription.plan': 'free'
        });
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
};

// Customer portal for managing subscription
exports.customerPortal = async (req, res) => {
  try {
    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeCustomerId,
      return_url: `${process.env.BASE_URL || 'http://localhost:3000'}/account`,
    });
    
    // Redirect to the customer portal
    res.redirect(session.url);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error accessing customer portal');
    res.redirect('/account');
  }
};
