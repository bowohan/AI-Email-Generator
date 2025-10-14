import express from 'express';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate email endpoint
router.post('/generate', async (req, res) => {
  try {
    const { 
      subject, 
      tone = 'professional', 
      purpose, 
      recipient, 
      length = 'medium',
      userId 
    } = req.body;

    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    // Create the AI prompt
    const prompt = createEmailPrompt({
      subject,
      tone,
      purpose,
      recipient,
      length
    });

    // Dynamic mock response generator
    const generateMockEmail = (subject, tone, purpose, recipient, length) => {
      const greetings = {
        professional: ["Dear", "Hello", "Good day"],
        casual: ["Hi", "Hey", "Hello"],
        friendly: ["Hi there", "Hello", "Hey"],
        formal: ["Dear", "To whom it may concern"],
        persuasive: ["Dear", "Hello", "I hope this finds you well"]
      };

      const closings = {
        professional: ["Best regards", "Sincerely", "Kind regards"],
        casual: ["Thanks", "Best", "Cheers"],
        friendly: ["Best wishes", "Take care", "Warm regards"],
        formal: ["Respectfully", "Sincerely", "Yours truly"],
        persuasive: ["Best regards", "Looking forward to your response", "Thank you for your consideration"]
      };

      const greeting = greetings[tone]?.[Math.floor(Math.random() * greetings[tone].length)] || "Hello";
      const closing = closings[tone]?.[Math.floor(Math.random() * closings[tone].length)] || "Best regards";

      let content = "";
      
      // Generate content based on subject and parameters with tone-specific language
      const toneStyles = {
        professional: {
          opening: "I hope this email finds you well.",
          connector: "I wanted to reach out regarding",
          body: "I believe this would be a valuable opportunity for both of us to connect and discuss our respective areas of expertise.",
          request: "Would you be available for a meeting? I'm flexible with timing and can accommodate your schedule.",
          ending: "Please let me know what works best for you."
        },
        casual: {
          opening: "Hope you're doing well!",
          connector: "I wanted to touch base about",
          body: "I think it would be great to connect and chat about our respective areas.",
          request: "Are you free for a meeting sometime? I'm pretty flexible with timing.",
          ending: "Let me know what works for you!"
        },
        friendly: {
          opening: "I hope you're having a great day!",
          connector: "I wanted to reach out about",
          body: "I'd love the chance to connect and share some ideas with you - I think we could both benefit from the conversation.",
          request: "Would you be interested in meeting up? I'm happy to work around your schedule.",
          ending: "I'd really appreciate hearing your thoughts!"
        },
        formal: {
          opening: "I trust this correspondence finds you in good health.",
          connector: "I am writing to you regarding",
          body: "I believe this presents a mutually beneficial opportunity for us to engage in meaningful discourse about our respective professional domains.",
          request: "I would be honored to schedule a meeting at your convenience. I am entirely flexible with regard to timing.",
          ending: "I respectfully await your response at your earliest convenience."
        },
        persuasive: {
          opening: "I hope this message finds you well.",
          connector: "I'm reaching out because",
          body: "This is an exceptional opportunity that could provide significant value for both of us. I'm confident we can create something remarkable together.",
          request: "I strongly encourage you to consider meeting with me. This could be a game-changing opportunity for your business.",
          ending: "I'm excited about the potential here and look forward to your positive response."
        }
      };

      const style = toneStyles[tone] || toneStyles.professional;

      // Generate more natural, context-aware emails
      if (subject.toLowerCase().includes("meeting") || subject.toLowerCase().includes("coffee") || subject.toLowerCase().includes("chat")) {
        const meetingTemplates = {
          professional: {
            intro: `I hope this email finds you well. I would like to schedule a ${subject.toLowerCase()} to discuss potential collaboration opportunities.`,
            body: `I believe there could be significant mutual benefits from connecting and sharing insights about our respective areas of expertise.`,
            request: `Would you be available for a meeting in the coming weeks? I'm flexible with timing and can accommodate your schedule.`,
            close: `I look forward to hearing from you and the possibility of working together.`
          },
          casual: {
            intro: `Hope you're doing well! I'd love to grab a coffee and chat about ${purpose || 'some ideas I have'}.`,
            body: `I think it would be great to connect and share some thoughts - I'm sure we could both benefit from the conversation.`,
            request: `Are you free for coffee sometime this week or next? I'm pretty flexible with timing.`,
            close: `Let me know what works for you - I'm excited about the possibility of connecting!`
          },
          friendly: {
            intro: `I hope you're having a wonderful day! I'd love the chance to meet up for a coffee and chat about ${purpose || 'some exciting opportunities'}.`,
            body: `I think we could have a really valuable conversation and I'd love to share some ideas with you.`,
            request: `Would you be interested in meeting up for coffee? I'm happy to work around your schedule.`,
            close: `I'd really appreciate the chance to connect - looking forward to hearing from you!`
          },
          formal: {
            intro: `I trust this correspondence finds you in good health. I am writing to request a meeting to discuss ${purpose || 'potential business opportunities'}.`,
            body: `I believe this presents a mutually beneficial opportunity for us to engage in meaningful discourse about our respective professional domains.`,
            request: `I would be honored to schedule a meeting at your convenience. I am entirely flexible with regard to timing and location.`,
            close: `I respectfully await your response and look forward to the possibility of a productive collaboration.`
          },
          persuasive: {
            intro: `I hope this message finds you well. I'm reaching out because I have an exciting opportunity that I believe could provide significant value for your business.`,
            body: `This could be a game-changing opportunity for both of us. I'm confident we can create something remarkable together.`,
            request: `I strongly encourage you to consider meeting with me. This could be the breakthrough you've been looking for.`,
            close: `I'm excited about the potential here and look forward to your positive response.`
          }
        };
        
        const template = meetingTemplates[tone] || meetingTemplates.professional;
        content = `${greeting} ${recipient || "there"},

${template.intro}

${template.body}

${template.request} ${template.close}

${closing},
[Your Name]`;
      } else if (subject.toLowerCase().includes("follow")) {
        const followUpTemplates = {
          professional: {
            intro: `I wanted to follow up on our previous conversation regarding ${subject.toLowerCase()}.`,
            body: `I believe we have a solid foundation to build upon and I'm excited about the potential for collaboration.`,
            request: `I'd like to schedule a follow-up meeting to discuss next steps and how we can move forward together.`,
            close: `Please let me know your availability and I'll coordinate accordingly.`
          },
          casual: {
            intro: `Just wanted to check in about our conversation regarding ${subject.toLowerCase()}.`,
            body: `I think we're onto something good here and I'd love to keep the momentum going.`,
            request: `How about we grab coffee again to discuss where we go from here?`,
            close: `Let me know when you're free - I'm excited to continue this conversation!`
          },
          friendly: {
            intro: `I was thinking about our chat regarding ${subject.toLowerCase()} and wanted to follow up.`,
            body: `I really enjoyed our conversation and I think we have some great opportunities ahead.`,
            request: `Would you be interested in meeting up again to discuss how we can take this forward?`,
            close: `I'd love to continue this conversation - let me know what works for you!`
          },
          formal: {
            intro: `I am following up on our prior correspondence concerning ${subject.toLowerCase()}.`,
            body: `I believe we have established a strong foundation for potential collaboration and mutual benefit.`,
            request: `I would like to schedule a follow-up meeting to discuss the next phase of our potential partnership.`,
            close: `I respectfully await your response regarding your availability for further discussion.`
          },
          persuasive: {
            intro: `I'm reaching out again because I'm confident we have something special here with ${subject.toLowerCase()}.`,
            body: `This could be the breakthrough opportunity that transforms both our businesses.`,
            request: `I strongly encourage you to schedule a follow-up meeting - this could be the turning point you've been waiting for.`,
            close: `I'm excited about the potential and look forward to your positive response.`
          }
        };
        
        const template = followUpTemplates[tone] || followUpTemplates.professional;
        content = `${greeting} ${recipient || "there"},

${template.intro}

${template.body}

${template.request} ${template.close}

${closing},
[Your Name]`;
      } else if (subject.toLowerCase().includes("thank")) {
        const thankTemplates = {
          professional: {
            intro: `Thank you for your time and consideration during our recent meeting.`,
            body: `I truly appreciate the opportunity to connect with you and discuss ${purpose || 'our potential collaboration'}.`,
            request: `I look forward to our continued partnership and the positive outcomes we can achieve together.`,
            close: `Thank you again for your time and I hope to speak with you soon.`
          },
          casual: {
            intro: `Thanks so much for taking the time to meet with me!`,
            body: `I really appreciated our conversation about ${purpose || 'everything'} and I think we're going to do great things together.`,
            request: `I'm excited about what we discussed and can't wait to see where this leads.`,
            close: `Thanks again and talk to you soon!`
          },
          friendly: {
            intro: `I really appreciate you taking the time to meet with me!`,
            body: `Our conversation about ${purpose || 'everything'} was fantastic and I'm so excited about the possibilities.`,
            request: `I can't wait to continue this journey with you and see what amazing things we can create together.`,
            close: `Thanks again for everything - you're awesome to work with!`
          },
          formal: {
            intro: `I extend my sincere gratitude for your time and consideration during our recent meeting.`,
            body: `I am deeply appreciative of the opportunity to engage with you regarding ${purpose || 'our potential collaboration'}.`,
            request: `I look forward to our continued professional relationship and the mutual benefits it will bring.`,
            close: `I thank you once again for your time and look forward to our future correspondence.`
          },
          persuasive: {
            intro: `I'm incredibly grateful for the opportunity you provided during our recent meeting.`,
            body: `This could be the breakthrough moment that transforms both our businesses and creates something truly remarkable.`,
            request: `I'm excited about the potential we've uncovered and confident this will be a game-changing partnership.`,
            close: `Thank you for believing in this opportunity - I can't wait to show you what we can achieve together.`
          }
        };
        
        const template = thankTemplates[tone] || thankTemplates.professional;
        content = `${greeting} ${recipient || "there"},

${template.intro}

${template.body}

${template.request} ${template.close}

${closing},
[Your Name]`;
      } else {
        // Generic email with much better structure
        const genericTemplates = {
          professional: {
            intro: `I hope this email finds you well. I am writing to you regarding ${subject}.`,
            body: `I believe this presents an excellent opportunity for us to connect and explore potential collaboration.`,
            request: `I would appreciate the opportunity to discuss this matter with you in greater detail.`,
            close: `I look forward to your response and the possibility of working together.`
          },
          casual: {
            intro: `Hope you're doing well! I wanted to reach out about ${subject}.`,
            body: `I think this could be a great opportunity for us to connect and share some ideas.`,
            request: `Would you be interested in chatting about this? I think we could both benefit from the conversation.`,
            close: `Let me know what you think - I'm excited about the possibilities!`
          },
          friendly: {
            intro: `I hope you're having a wonderful day! I wanted to reach out about ${subject}.`,
            body: `I'd love the chance to connect with you and share some thoughts about this opportunity.`,
            request: `Would you be interested in meeting up to discuss this? I think we could have a really valuable conversation.`,
            close: `I'd really appreciate the chance to connect - let me know what works for you!`
          },
          formal: {
            intro: `I trust this correspondence finds you in good health. I am writing to you regarding ${subject}.`,
            body: `I believe this presents a mutually beneficial opportunity for us to engage in meaningful professional discourse.`,
            request: `I would be honored to schedule a meeting to discuss this matter in greater detail.`,
            close: `I respectfully await your response and look forward to the possibility of a productive collaboration.`
          },
          persuasive: {
            intro: `I hope this message finds you well. I'm reaching out because ${subject} represents an exceptional opportunity.`,
            body: `This could be the breakthrough moment that provides significant value for both our organizations.`,
            request: `I strongly encourage you to consider this opportunity - it could be the game-changer you've been looking for.`,
            close: `I'm excited about the potential here and look forward to your positive response.`
          }
        };
        
        const template = genericTemplates[tone] || genericTemplates.professional;
        content = `${greeting} ${recipient || "there"},

${template.intro}

${template.body}

${template.request} ${template.close}

${closing},
[Your Name]`;
      }

      // Adjust length based on parameter
      if (length === "short") {
        // Keep it concise
        content = content.split('\n\n')[0] + "\n\n" + content.split('\n\n').slice(-1)[0];
      } else if (length === "long") {
        // Add more detail
        const additionalParagraph = `\n\nI wanted to provide some additional context to help you understand the situation better. This matter is important to me, and I believe we can work together to find a mutually beneficial solution.\n\nPlease don't hesitate to reach out if you have any questions or need clarification on any points I've mentioned.`;
        content = content.replace(/\n\n/g, additionalParagraph + '\n\n');
      }

      return content;
    };

    // Use mock response if OpenAI fails
    let generatedContent;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert email writer. Generate professional, engaging emails based on the user's requirements."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      generatedContent = completion.choices[0].message.content;
    } catch (error) {
      console.log("OpenAI API failed, using dynamic mock response:", error.message);
      // Generate dynamic mock response based on user input
      generatedContent = generateMockEmail(subject, tone, purpose, recipient, length);
    }

    // Save to database if userId is provided
    let savedEmail = null;
    if (userId) {
      savedEmail = await prisma.email.create({
        data: {
          subject,
          content: generatedContent,
          tone,
          purpose,
          recipient,
          length,
          userId,
          aiGenerated: true
        }
      });
    }

    res.json({
      success: true,
      email: {
        subject,
        content: generatedContent,
        tone,
        purpose,
        recipient,
        length,
        id: savedEmail?.id,
        createdAt: savedEmail?.createdAt
      }
    });

  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ 
      error: 'Failed to generate email',
      details: error.message 
    });
  }
});

// Get user's email history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const emails = await prisma.email.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.email.count({
      where: { userId }
    });

    res.json({
      success: true,
      emails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching email history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch email history',
      details: error.message 
    });
  }
});

// Helper function to create email prompt
function createEmailPrompt({ subject, tone, purpose, recipient, length }) {
  let prompt = `Write an email with the subject: "${subject}"`;
  
  if (tone) {
    prompt += `\nTone: ${tone}`;
  }
  
  if (purpose) {
    prompt += `\nPurpose: ${purpose}`;
  }
  
  if (recipient) {
    prompt += `\nRecipient: ${recipient}`;
  }
  
  if (length) {
    const lengthGuidelines = {
      short: 'Keep it concise (2-3 sentences)',
      medium: 'Write a standard length email (1-2 paragraphs)',
      long: 'Write a detailed email (3+ paragraphs)'
    };
    prompt += `\nLength: ${lengthGuidelines[length] || lengthGuidelines.medium}`;
  }
  
  prompt += '\n\nPlease generate a well-structured email that is professional, engaging, and appropriate for the context.';
  
  return prompt;
}

// Get all emails for a user
router.get('/emails', async (req, res) => {
  try {
    const { userId, page = 1, limit = 10, q } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { userId };
    
    // Add search filter if provided
    if (q) {
      where.OR = [
        { subject: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
        { purpose: { contains: q, mode: 'insensitive' } }
      ];
    }

    const [emails, total] = await Promise.all([
      prisma.email.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.email.count({ where })
    ]);

    res.json({
      emails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Get single email by ID
router.get('/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const email = await prisma.email.findFirst({
      where: { id, userId }
    });

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ email });
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// Update email
router.put('/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, subject, tone, purpose, recipient, length, content } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check ownership
    const existingEmail = await prisma.email.findFirst({
      where: { id, userId }
    });

    if (!existingEmail) {
      return res.status(404).json({ error: 'Email not found or access denied' });
    }

    const updatedEmail = await prisma.email.update({
      where: { id },
      data: {
        subject: subject || existingEmail.subject,
        tone: tone || existingEmail.tone,
        purpose: purpose || existingEmail.purpose,
        recipient: recipient || existingEmail.recipient,
        length: length || existingEmail.length,
        content: content || existingEmail.content,
        updatedAt: new Date()
      }
    });

    res.json({ email: updatedEmail });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Delete email
router.delete('/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check ownership
    const existingEmail = await prisma.email.findFirst({
      where: { id, userId }
    });

    if (!existingEmail) {
      return res.status(404).json({ error: 'Email not found or access denied' });
    }

    await prisma.email.delete({
      where: { id }
    });

    res.json({ message: 'Email deleted successfully' });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

export default router;
