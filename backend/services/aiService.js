import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini API if key is present
let aiModel = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Using gemini-1.5-flash as it is widely supported and fast
    aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Gemini AI Service initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Gemini Client: ', error.message);
  }
} else {
  console.warn('GEMINI_API_KEY not found in .env. AI service running in high-fidelity simulation mode.');
}

/**
 * Generate customized Digital Growth Report for business owners.
 */
export const generateBusinessReport = async (ownerName, businessName, businessType, challenges, customChallenges, digitalPresence) => {
  const challengeStr = [...challenges, customChallenges].filter(Boolean).join(', ');
  
  if (aiModel) {
    try {
      const prompt = `
        You are an expert digital marketing consultant and web developer.
        Analyze the following business and generate a JSON report with recommended website features and digital marketing strategies.
        
        Business Details:
        - Owner: ${ownerName}
        - Business Name: ${businessName}
        - Business Type: ${businessType}
        - Current Challenges: ${challengeStr}
        - Current Digital Presence: ${digitalPresence}
        
        Return ONLY a JSON object matching this exact schema (no markdown wrapper, no backticks):
        {
          "summary": "Short executive summary of the business's situation and how digital growth can help.",
          "websiteRecommendations": [
            {
              "featureName": "Name of proposed website feature (e.g. WhatsApp Cart, Local SEO Map)",
              "description": "Brief description of the feature.",
              "priority": "High" | "Medium" | "Low",
              "valueAdd": "How this feature solves their pain point."
            }
          ],
          "marketingStrategy": [
            {
              "channel": "e.g. Instagram Reels, Google Business Profile",
              "tactic": "What exactly they should do.",
              "roiExpectation": "e.g. 2x sales within 3 months, higher local visibility"
            }
          ],
          "estimatedCosts": {
            "websiteDevelopment": 15000,
            "monthlyMarketing": 5000
          },
          "nextSteps": [
            "Action item 1",
            "Action item 2"
          ]
        }
      `;
      
      const result = await aiModel.generateContent(prompt);
      const textResponse = result.response.text().trim();
      
      // Clean up text if LLM wrapped it in markdown code blocks
      const cleanJson = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Gemini API Error, falling back to simulation:', error.message);
    }
  }

  // Fallback / Simulation Mode
  return simulateBusinessReport(ownerName, businessName, businessType, challenges, customChallenges, digitalPresence);
};

/**
 * Generate AI-based competitor analysis and trending feature recommendations.
 */
export const generateCompetitorAnalysis = async (businessName, businessType, competitorNames) => {
  const compStr = competitorNames.filter(Boolean).join(', ');
  
  if (aiModel) {
    try {
      const prompt = `
        You are an AI competitive intelligence analyst. 
        Perform a SWOT analysis and recommend trending digital features for:
        - Business: ${businessName} (${businessType})
        - Competitors to analyze: ${compStr || 'General competitors in this industry'}
        
        Return ONLY a JSON object matching this exact schema (no markdown wrapper, no backticks):
        {
          "swotAnalysis": {
            "strengths": ["list of 3 strengths of digital transition"],
            "weaknesses": ["list of 3 weaknesses of not doing it"],
            "opportunities": ["list of 3 market opportunities"],
            "threats": ["list of 3 threats from online competitors"]
          },
          "recommendedFeatures": [
            {
              "featureName": "Unique trending website feature",
              "description": "What it is",
              "marketTrendDriver": "Why it is trending in 2026",
              "complexity": "Low" | "Medium" | "High"
            }
          ],
          "marketTrends": [
            "Industry trend 1",
            "Industry trend 2"
          ]
        }
      `;
      const result = await aiModel.generateContent(prompt);
      const textResponse = result.response.text().trim();
      const cleanJson = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Gemini Competitor API Error, falling back to simulation:', error.message);
    }
  }

  // Fallback Simulation Mode
  return simulateCompetitorAnalysis(businessName, businessType, competitorNames);
};

/**
 * AI-powered assistant to clear doubts of referral partners.
 */
export const getPartnerAnswer = async (partnerName, query) => {
  if (aiModel) {
    try {
      const prompt = `
        You are the 'Digital Growth Platform AI Support Partner'.
        Your job is to support referral partners (who may have NO formal education) in understanding and promoting website development and digital marketing services to local businesses (e.g., saree shops, kirana stores, cafes, salons).
        Keep your advice simple, encouraging, free of jargon, and highly practical. Provide step-by-step guidance on how to pitch or overcome objections.
        
        Partner Name: ${partnerName}
        Partner Query: "${query}"
        
        Answer their question directly in a friendly, conversational tone (Indian English / Hinglish style if appropriate, mentioning earning ₹1,000 commission).
      `;
      const result = await aiModel.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('Gemini Partner API Error, falling back to simulation:', error.message);
    }
  }

  // Fallback Simulation Mode
  return simulatePartnerAnswer(partnerName, query);
};

// ================= SIMULATION ENGINES =================

function simulateBusinessReport(ownerName, businessName, businessType, challenges, customChallenges, digitalPresence) {
  const normType = businessType.toLowerCase();
  
  // Custom templates depending on business type
  let customFeatures = [];
  let customMarketing = [];
  let summary = "";
  
  if (normType.includes('saree') || normType.includes('clothing') || normType.includes('boutique') || normType.includes('shop')) {
    summary = `Dear ${ownerName}, your clothing store '${businessName}' has an amazing legacy. However, offline sales are restricted by local footfall. Transitioning to a digital catalog and integrating order placement via WhatsApp can double your customer reach.`;
    customFeatures = [
      {
        featureName: "WhatsApp Catalog & Instant Checkout",
        description: "Customers browse your latest sarees online and click 'Order via WhatsApp' to send a pre-filled message with the item image directly to you.",
        priority: "High",
        valueAdd: "Enables customers to buy with zero friction, combining the personal touch of physical retail with digital convenience."
      },
      {
        featureName: "High-Definition Fabric Gallery & Lookbooks",
        description: "A fast-loading, mobile-friendly media grid showing saree fabrics, embroidery details, and styling guides.",
        priority: "High",
        valueAdd: "Builds trust and lets customers appreciate the quality of your sarees from their homes."
      },
      {
        featureName: "Virtual Video Consultation Scheduler",
        description: "A simple booking form where clients can book a live video call (WhatsApp/Zoom) to inspect sarees before purchasing.",
        priority: "Medium",
        valueAdd: "Perfect for high-value bridal and silk sarees, closing deals faster."
      }
    ];
    customMarketing = [
      {
        channel: "Instagram & Facebook Reels",
        tactic: "Post daily reels showing saree draping styles, fabric colors, and happy customer reviews.",
        roiExpectation: "High visual engagement leading to 30%+ increase in online enquiries."
      },
      {
        channel: "Google Business Profile & Local Maps",
        tactic: "Optimize your listing under terms like 'Best Saree Shop in [Your Area]' with reviews and phone number.",
        roiExpectation: "Brings 40% more walk-in store traffic from shoppers searching nearby."
      }
    ];
  } else {
    // Generic local business template (e.g. bakery, cafe, salon)
    summary = `Dear ${ownerName}, your business '${businessName}' has massive potential. In 2026, 85% of customers search for local services like yours online before visiting. Establishing a professional, fast website will give you local authority.`;
    customFeatures = [
      {
        featureName: "Mobile-First Service/Product Menu",
        description: "An interactive, beautiful menu of your services or products that loads under 1 second on mobile devices.",
        priority: "High",
        valueAdd: "Prevents customers from bouncing to competitors due to slow-loading PDFs or social media links."
      },
      {
        featureName: "One-Click WhatsApp Enquiry Button",
        description: "Floating action button on every page allowing instant chat with your business.",
        priority: "High",
        valueAdd: "Turns website traffic into active conversions instantly without complex registration forms."
      },
      {
        featureName: "Customer Testimonials & Google Reviews Sync",
        description: "A section automatically pulling glowing reviews from happy clients.",
        priority: "Medium",
        valueAdd: "Overcomes online trust hurdles instantly."
      }
    ];
    customMarketing = [
      {
        channel: "Local Search Optimization (SEO)",
        tactic: "Add local keywords (e.g. 'top ${businessType} nearby') to attract organic search traffic.",
        roiExpectation: "Consistent flow of organic local inquiries without paying for advertisements."
      },
      {
        channel: "WhatsApp Broadcast Marketing",
        tactic: "Offer a small discount in exchange for clients joining your VIP WhatsApp list, then send weekly updates.",
        roiExpectation: "Increases customer repeat rates by up to 50%."
      }
    ];
  }

  return {
    summary,
    websiteRecommendations: customFeatures,
    marketingStrategy: customMarketing,
    estimatedCosts: {
      websiteDevelopment: 12000,
      monthlyMarketing: 4500
    },
    nextSteps: [
      "Select your custom website package in our Pricing section.",
      "Get a custom WhatsApp integration configured.",
      "Launch a local Google Maps and Instagram profile to start driving traffic."
    ]
  };
}

function simulateCompetitorAnalysis(businessName, businessType, competitorNames) {
  const cleanComps = competitorNames.length > 0 ? competitorNames : ["Local competitors"];
  
  return {
    swotAnalysis: {
      strengths: [
        "Strong offline trust and relationships with local buyers",
        "Personalized customer support and catalog curation",
        "Unique quality inventory not found on massive e-commerce sites"
      ],
      weaknesses: [
        "Zero visibility on Google Maps and search queries",
        "No structured display of products online, forcing manual photo sharing",
        "No automated mechanism to capture customer contact info for remarketing"
      ],
      opportunities: [
        "First-mover advantage in local search by launching a dedicated mobile-optimized catalog website",
        "Targeting young shoppers who prefer online browsing before shop visits",
        "Lower advertisement cost on local Facebook/Instagram ads compared to national targets"
      ],
      threats: [
        `Competitors like ${cleanComps.join(' & ')} capturing digital share via social pages and online delivery apps`,
        "Aggressive national platforms offering fast shipping, drawing customers away",
        "Decline in physical market footfall as digital convenience rises"
      ]
    },
    recommendedFeatures: [
      {
        featureName: "Interactive Virtual Storefront",
        description: "A web page displaying high-resolution photos and videos of your actual store shelves, grouped in categories.",
        marketTrendDriver: "Customers increasingly want a 'digital walk-through' experience of local shops before traveling.",
        complexity: "Low"
      },
      {
        featureName: "AI-Powered WhatsApp Bot",
        description: "An automated helper that answers standard questions (store hours, address, availability of standard stock) over WhatsApp 24/7.",
        marketTrendDriver: "Hyper-convenience and 24/7 responsiveness are now expected by digital shoppers.",
        complexity: "Medium"
      },
      {
        featureName: "Loyalty Referral Program",
        description: "Let customers share a coupon code with friends online to earn discounts on their next purchase.",
        marketTrendDriver: "Word-of-mouth is amplified heavily by digital sharing tools like WhatsApp groups.",
        complexity: "Medium"
      }
    ],
    marketTrends: [
      "80% of local retail purchases are preceded by digital discovery.",
      "Mobile-responsive pages with direct chat (WhatsApp) checkout have a 4x higher conversion rate than traditional multi-step carts in India.",
      "Video-first content (Reels/Shorts) drives 75% of search intent in consumer retail."
    ]
  };
}

function simulatePartnerAnswer(partnerName, query) {
  const lowerQuery = query.toLowerCase().trim();
  
  // Greetings / Vague helper
  if (lowerQuery === 'hi' || lowerQuery === 'hello' || lowerQuery === 'hey' || lowerQuery.includes('who are you') || lowerQuery.includes('how can i get') || lowerQuery.includes('get started') || lowerQuery.includes('help')) {
    return `Hello ${partnerName}! 👋 I am your JhaTech AI Growth Advisor. I am here to help you understand our services and make sales.

You can ask me questions like:
1. "How do I earn ₹1,000?" (Referral Program details)
2. "What are the website prices?" (Showcase vs Catalog vs E-Commerce cost details)
3. "Give me a pitch script for a Saree Shop" (Sales scripts)
4. "How to handle objections like 'A website is too expensive'?"

What would you like to start with?`;
  }
  
  // Pricing / Cost / Packages
  if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('charge') || lowerQuery.includes('rate') || lowerQuery.includes('package') || lowerQuery.includes('fee') || lowerQuery.includes('how much')) {
    return `Here is our transparent pricing structure, ${partnerName}. We have 3 main packages:
1. **Single Page Showcase (₹8,000 one-time)**: Perfect for basic local shops. Includes Google Maps setup, phone/address listing, and a simple WhatsApp query button.
2. **Multi-Page Business Catalog (₹15,000 one-time)**: Our most popular plan. Fits Saree shops, boutiques, and cafes. Displays a complete categorized catalog (up to 150 items) with instant WhatsApp order links.
3. **Full E-commerce Shop (₹25,000 one-time)**: Standard digital store. Includes shopping cart, checkout, UPI QR payments, and order tracking.

*Note:* All websites are mobile-optimized, fast-loading, and we take a 50% advance / 50% after live launch. You earn ₹1,000 commission on any package!`;
  }

  // Referral Earning / Payout / Commission
  if (lowerQuery.includes('earn') || lowerQuery.includes('payout') || lowerQuery.includes('money') || lowerQuery.includes('rupees') || lowerQuery.includes('paisa') || lowerQuery.includes('commission') || lowerQuery.includes('refer') || lowerQuery.includes('upi')) {
    return `Earning with JhaTech is simple and open to everyone, ${partnerName}!
1. Share your **Referral Link** (found in your partner dashboard) with local business owners.
2. If they fill out the audit form using your link and buy any website package, you earn **flat ₹1,000 commission**.
3. Payouts are sent **directly to your UPI ID** as soon as the client makes their advance payment.
4. There are NO limits—refer 10 shops, earn ₹10,000!

*Tip:* You can use the "Simulate Sale" box on your dashboard to see how referred sales are logged and how your earnings increase!`;
  }
  
  // Saree / Clothes / Shop pitches
  if (lowerQuery.includes('saree') || lowerQuery.includes('clothes') || lowerQuery.includes('cloth') || lowerQuery.includes('shop') || lowerQuery.includes('pitch') || lowerQuery.includes('script') || lowerQuery.includes('boutique') || lowerQuery.includes('kirana')) {
    return `Here is a simple, winning script to pitch to a **Saree Shop / Boutique** owner, ${partnerName}:

*"Bhaiya/Didi, standard walk-in customers only come from nearby lanes. If you have an online catalog website, people from all over the city can view your saree collection on their phones. 
Instead of you manually sending 50 photos to customers on WhatsApp every day, they can browse your categorized collections, click on a saree they like, and it sends a pre-filled WhatsApp order straight to you! This will save you hours and double your sales!"*

*Next Step:* If they show interest, offer to run a free "AI Business Audit" with them. Open our Growth Analyzer tool, input their details, and show them the recommendations!`;
  }

  // Objections (expensive, no need, too small)
  if (lowerQuery.includes('expensive') || lowerQuery.includes('no need') || lowerQuery.includes('why') || lowerQuery.includes('objection') || lowerQuery.includes('excuse') || lowerQuery.includes('offline')) {
    return `Excellent question! If a business owner says:
- **"It's too expensive"**: Say: *"Bhaiya, a one-time cost of ₹8,000 is less than the price of a local newspaper flyer. But this digital banner stays open 24 hours a day, 365 days a year!"*
- **"I don't need a website, my offline shop is doing fine"**: Say: *"Didi, 85% of shoppers search Google Maps before visiting shops. If your shop isn't online, Google will direct customers to your competitor across the street. A website protects your business!"*
- **"I don't know how to run a website"**: Say: *"You don't need to! JhaTech manages all hosting, server maintenance, and support. All you do is receive orders directly on your WhatsApp!"*`;
  }

  // Default general guide response
  return `Hi ${partnerName}! 🚀 I am here to help you clear any doubts and make sales. Here are a few quick tips to pitch our digital services:
- Start with businesses you already know: your local grocery store, favorite restaurant, or salon.
- Tell them: "Get your shop on Google Maps and get a website where customers can order directly via WhatsApp."
- There are NO qualifications required for this job. You earn ₹1,000 directly into your UPI wallet for every business that signs up!
What business are you planning to pitch to today? Tell me, and I'll give you a simple Hindi/English sales script!`;
}
