// OpenAI configuration
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to generate script using OpenAI
const generateScriptContent = async (productName, tone, highlights) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter for Amazon product videos. Create engaging scripts that convert viewers into buyers."
        },
        {
          role: "user",
          content: `Create a 30-60 second video script for an Amazon product with the following structure:
          
          PRODUCT: ${productName}
          TONE: ${tone}
          KEY HIGHLIGHTS: ${highlights}
          
          Format the script with these three distinct sections:
          1. HOOK (5-10 seconds): An attention-grabbing opening that makes viewers stop scrolling
          2. BODY (15-40 seconds): Highlight the key product features and benefits
          3. CTA (5-10 seconds): A clear call-to-action encouraging viewers to check out the product using their affiliate link
          
          Make the script conversational, engaging, and optimized for short-form video.`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please try again.');
  }
};

module.exports = {
  generateScriptContent
};
