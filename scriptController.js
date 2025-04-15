// Script controller for ScriptZon
const Script = require('../models/Script');
const User = require('../models/User');
const openai = require('../config/openai');

// Display script generation form
exports.showGenerateForm = (req, res) => {
  res.render('generate-script', {
    title: 'Generate Script | ScriptZon',
    user: req.user
  });
};

// Generate a new script using OpenAI
exports.generateScript = async (req, res) => {
  try {
    const { productName, tone, highlights } = req.body;
    
    // Check if user has reached their script limit (if on free plan)
    if (req.user.subscription.plan === 'free') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Count scripts generated this month
      const scriptsThisMonth = await Script.countDocuments({
        user: req.user._id,
        createdAt: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1)
        }
      });
      
      if (scriptsThisMonth >= 3) {
        req.flash('error_msg', 'You have reached your monthly limit of 3 scripts. Please upgrade to the Pro plan for unlimited scripts.');
        return res.redirect('/scripts/generate');
      }
    }
    
    // Prepare prompt for OpenAI
    const prompt = `Create a short-form Amazon product video script (30-60 seconds) for ${productName}. 
    The tone should be ${tone}. 
    Key product highlights: ${highlights}.
    
    Format the script with:
    1. A compelling hook to grab attention
    2. Main body highlighting key benefits
    3. Strong call-to-action
    
    Make it engaging, concise, and optimized for Amazon influencers.`;
    
    // Call OpenAI API
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const scriptContent = completion.data.choices[0].text.trim();
    
    // Save script to database
    const newScript = new Script({
      title: productName,
      content: scriptContent,
      tone: tone,
      highlights: highlights,
      user: req.user._id
    });
    
    await newScript.save();
    
    // Redirect to the script detail page
    res.redirect(`/scripts/${newScript._id}`);
    
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error generating script. Please try again.');
    res.redirect('/scripts/generate');
  }
};

// Display all scripts for the current user
exports.getAllScripts = async (req, res) => {
  try {
    const scripts = await Script.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.render('scripts', {
      title: 'My Scripts | ScriptZon',
      scripts,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error retrieving scripts');
    res.redirect('/dashboard');
  }
};

// Display a single script
exports.getScriptById = async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);
    
    // Check if script exists and belongs to the current user
    if (!script || script.user.toString() !== req.user._id.toString()) {
      req.flash('error_msg', 'Script not found');
      return res.redirect('/scripts');
    }
    
    res.render('script-detail', {
      title: `${script.title} | ScriptZon`,
      script,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error retrieving script');
    res.redirect('/scripts');
  }
};

// Delete a script
exports.deleteScript = async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);
    
    // Check if script exists and belongs to the current user
    if (!script || script.user.toString() !== req.user._id.toString()) {
      req.flash('error_msg', 'Script not found');
      return res.redirect('/scripts');
    }
    
    await Script.findByIdAndDelete(req.params.id);
    
    req.flash('success_msg', 'Script deleted successfully');
    res.redirect('/scripts');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting script');
    res.redirect('/scripts');
  }
};

// Regenerate a script
exports.regenerateScript = async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);
    
    // Check if script exists and belongs to the current user
    if (!script || script.user.toString() !== req.user._id.toString()) {
      req.flash('error_msg', 'Script not found');
      return res.redirect('/scripts');
    }
    
    // Check if user has reached their script limit (if on free plan)
    if (req.user.subscription.plan === 'free') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Count scripts generated this month
      const scriptsThisMonth = await Script.countDocuments({
        user: req.user._id,
        createdAt: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1)
        }
      });
      
      if (scriptsThisMonth >= 3) {
        req.flash('error_msg', 'You have reached your monthly limit of 3 scripts. Please upgrade to the Pro plan for unlimited scripts.');
        return res.redirect(`/scripts/${script._id}`);
      }
    }
    
    // Prepare prompt for OpenAI
    const prompt = `Create a short-form Amazon product video script (30-60 seconds) for ${script.title}. 
    The tone should be ${script.tone}. 
    Key product highlights: ${script.highlights}.
    
    Format the script with:
    1. A compelling hook to grab attention
    2. Main body highlighting key benefits
    3. Strong call-to-action
    
    Make it engaging, concise, and optimized for Amazon influencers.`;
    
    // Call OpenAI API
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const scriptContent = completion.data.choices[0].text.trim();
    
    // Update script in database
    script.content = scriptContent;
    script.updatedAt = Date.now();
    await script.save();
    
    req.flash('success_msg', 'Script regenerated successfully');
    res.redirect(`/scripts/${script._id}`);
    
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error regenerating script');
    res.redirect('/scripts');
  }
};
