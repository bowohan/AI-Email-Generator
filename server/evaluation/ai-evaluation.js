import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// AI Email Quality Evaluation System
export class AIEmailEvaluator {
  constructor() {
    this.evaluationCriteria = {
      tone: {
        professional: ['formal language', 'business appropriate', 'respectful'],
        casual: ['conversational', 'friendly', 'relaxed'],
        friendly: ['warm', 'enthusiastic', 'personal'],
        formal: ['structured', 'official', 'decorous'],
        persuasive: ['compelling', 'confident', 'action-oriented']
      },
      structure: ['clear opening', 'logical flow', 'appropriate closing'],
      content: ['relevant', 'specific', 'actionable'],
      length: {
        short: { min: 50, max: 150 },
        medium: { min: 150, max: 300 },
        long: { min: 300, max: 500 }
      }
    };
  }

  // Evaluate email quality based on multiple criteria
  evaluateEmail(email, expectedTone, expectedLength) {
    const scores = {
      tone: this.evaluateTone(email.content, expectedTone),
      structure: this.evaluateStructure(email.content),
      content: this.evaluateContent(email.content, email.purpose),
      length: this.evaluateLength(email.content, expectedLength),
      overall: 0
    };

    // Calculate overall score (weighted average)
    scores.overall = (
      scores.tone * 0.3 +
      scores.structure * 0.25 +
      scores.content * 0.25 +
      scores.length * 0.2
    );

    return {
      scores,
      grade: this.getGrade(scores.overall),
      feedback: this.generateFeedback(scores, expectedTone, expectedLength)
    };
  }

  // Evaluate tone appropriateness
  evaluateTone(content, expectedTone) {
    const toneKeywords = this.evaluationCriteria.tone[expectedTone] || [];
    const contentLower = content.toLowerCase();
    
    let score = 0;
    const keywordMatches = toneKeywords.filter(keyword => 
      contentLower.includes(keyword)
    ).length;
    
    score = (keywordMatches / toneKeywords.length) * 100;
    
    // Bonus for appropriate greetings and closings
    if (this.hasAppropriateGreeting(content, expectedTone)) score += 10;
    if (this.hasAppropriateClosing(content, expectedTone)) score += 10;
    
    return Math.min(score, 100);
  }

  // Evaluate email structure
  evaluateStructure(content) {
    let score = 0;
    
    // Check for clear opening
    if (this.hasClearOpening(content)) score += 25;
    
    // Check for logical flow
    if (this.hasLogicalFlow(content)) score += 25;
    
    // Check for appropriate closing
    if (this.hasAppropriateClosing(content)) score += 25;
    
    // Check for proper formatting
    if (this.hasProperFormatting(content)) score += 25;
    
    return score;
  }

  // Evaluate content relevance
  evaluateContent(content, purpose) {
    let score = 0;
    
    // Check if content addresses the purpose
    if (purpose && content.toLowerCase().includes(purpose.toLowerCase())) {
      score += 40;
    }
    
    // Check for specificity (not too generic)
    if (this.isSpecific(content)) score += 30;
    
    // Check for actionability
    if (this.isActionable(content)) score += 30;
    
    return score;
  }

  // Evaluate length appropriateness
  evaluateLength(content, expectedLength) {
    const wordCount = content.split(' ').length;
    const lengthCriteria = this.evaluationCriteria.length[expectedLength];
    
    if (!lengthCriteria) return 50; // Default score
    
    if (wordCount >= lengthCriteria.min && wordCount <= lengthCriteria.max) {
      return 100;
    } else if (wordCount < lengthCriteria.min) {
      return Math.max(0, (wordCount / lengthCriteria.min) * 100);
    } else {
      return Math.max(0, 100 - ((wordCount - lengthCriteria.max) / lengthCriteria.max) * 50);
    }
  }

  // Helper methods
  hasAppropriateGreeting(content, tone) {
    const greetings = {
      professional: ['dear', 'hello', 'good day'],
      casual: ['hi', 'hey', 'hello'],
      friendly: ['hi there', 'hello', 'hey'],
      formal: ['dear', 'to whom it may concern'],
      persuasive: ['dear', 'hello']
    };
    
    const toneGreetings = greetings[tone] || greetings.professional;
    return toneGreetings.some(greeting => 
      content.toLowerCase().startsWith(greeting)
    );
  }

  hasAppropriateClosing(content, tone) {
    const closings = {
      professional: ['best regards', 'sincerely', 'kind regards'],
      casual: ['thanks', 'best', 'cheers'],
      friendly: ['best wishes', 'take care', 'warm regards'],
      formal: ['respectfully', 'sincerely', 'yours truly'],
      persuasive: ['best regards', 'looking forward', 'thank you']
    };
    
    const toneClosings = closings[tone] || closings.professional;
    return toneClosings.some(closing => 
      content.toLowerCase().includes(closing.toLowerCase())
    );
  }

  hasClearOpening(content) {
    const lines = content.split('\n');
    return lines.length > 0 && lines[0].length > 10;
  }

  hasLogicalFlow(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length >= 3; // At least 3 sentences for logical flow
  }

  hasProperFormatting(content) {
    return content.includes('\n') && content.length > 50;
  }

  isSpecific(content) {
    // Check for specific details, numbers, or concrete information
    const hasNumbers = /\d+/.test(content);
    const hasSpecifics = content.split(' ').length > 20; // Not too short
    return hasNumbers || hasSpecifics;
  }

  isActionable(content) {
    const actionWords = ['please', 'would you', 'could you', 'let me know', 'schedule', 'meet', 'call'];
    return actionWords.some(word => content.toLowerCase().includes(word));
  }

  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  generateFeedback(scores, expectedTone, expectedLength) {
    const feedback = [];
    
    if (scores.tone < 70) {
      feedback.push(`Tone could be more ${expectedTone}. Consider using more appropriate language for this tone.`);
    }
    
    if (scores.structure < 70) {
      feedback.push('Email structure could be improved. Ensure clear opening, logical flow, and proper closing.');
    }
    
    if (scores.content < 70) {
      feedback.push('Content could be more relevant and specific to the purpose.');
    }
    
    if (scores.length < 70) {
      feedback.push(`Length should be more appropriate for ${expectedLength} emails.`);
    }
    
    if (scores.overall >= 80) {
      feedback.push('Overall, this is a well-written email!');
    }
    
    return feedback;
  }

  // Run evaluation on sample emails
  async runEvaluation() {
    console.log('🔍 Running AI Email Quality Evaluation...');
    
    const sampleEmails = [
      {
        subject: 'Meeting Request',
        tone: 'professional',
        purpose: 'Schedule a quarterly review',
        recipient: 'Sarah Johnson',
        length: 'medium',
        content: `Dear Sarah Johnson,

I hope this email finds you well. I would like to schedule a quarterly review meeting to discuss our marketing performance and upcoming strategies.

I believe there could be significant mutual benefits from connecting and sharing insights about our respective areas of expertise.

Would you be available for a meeting in the coming weeks? I'm flexible with timing and can accommodate your schedule. I look forward to hearing from you and the possibility of working together.

Best regards,
[Your Name]`
      },
      {
        subject: 'Coffee Chat',
        tone: 'casual',
        purpose: 'Grab coffee and discuss collaboration',
        recipient: 'Mike Chen',
        length: 'short',
        content: `Hey Mike,

Hope you're doing well! I'd love to grab a coffee and chat about some ideas I have.

I think it would be great to connect and share some thoughts - I'm sure we could both benefit from the conversation.

Are you free for coffee sometime this week or next? I'm pretty flexible with timing. Let me know what works for you - I'm excited about the possibility of connecting!

Thanks,
[Your Name]`
      }
    ];

    const results = [];
    
    for (const email of sampleEmails) {
      const evaluation = this.evaluateEmail(email, email.tone, email.length);
      results.push({
        subject: email.subject,
        tone: email.tone,
        evaluation
      });
      
      console.log(`\n📧 ${email.subject} (${email.tone} tone):`);
      console.log(`   Overall Score: ${evaluation.scores.overall.toFixed(1)}/100 (${evaluation.grade})`);
      console.log(`   Tone: ${evaluation.scores.tone.toFixed(1)}/100`);
      console.log(`   Structure: ${evaluation.scores.structure.toFixed(1)}/100`);
      console.log(`   Content: ${evaluation.scores.content.toFixed(1)}/100`);
      console.log(`   Length: ${evaluation.scores.length.toFixed(1)}/100`);
      console.log(`   Feedback: ${evaluation.feedback.join(' ')}`);
    }
    
    // Calculate average scores
    const avgOverall = results.reduce((sum, r) => sum + r.evaluation.scores.overall, 0) / results.length;
    const avgTone = results.reduce((sum, r) => sum + r.evaluation.scores.tone, 0) / results.length;
    const avgStructure = results.reduce((sum, r) => sum + r.evaluation.scores.structure, 0) / results.length;
    const avgContent = results.reduce((sum, r) => sum + r.evaluation.scores.content, 0) / results.length;
    const avgLength = results.reduce((sum, r) => sum + r.evaluation.scores.length, 0) / results.length;
    
    console.log('\n📊 Evaluation Summary:');
    console.log(`   Average Overall Score: ${avgOverall.toFixed(1)}/100`);
    console.log(`   Average Tone Score: ${avgTone.toFixed(1)}/100`);
    console.log(`   Average Structure Score: ${avgStructure.toFixed(1)}/100`);
    console.log(`   Average Content Score: ${avgContent.toFixed(1)}/100`);
    console.log(`   Average Length Score: ${avgLength.toFixed(1)}/100`);
    
    return {
      results,
      summary: {
        avgOverall,
        avgTone,
        avgStructure,
        avgContent,
        avgLength
      }
    };
  }
}

// Run evaluation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const evaluator = new AIEmailEvaluator();
  evaluator.runEvaluation()
    .then(() => {
      console.log('\n✅ AI Email Evaluation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Evaluation failed:', error);
      process.exit(1);
    });
}
