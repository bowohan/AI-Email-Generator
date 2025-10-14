import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed script...');

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample emails
  const sampleEmails = [
    {
      subject: 'Meeting Request',
      tone: 'professional',
      purpose: 'Schedule a quarterly review meeting',
      recipient: 'Sarah Johnson, Marketing Director',
      length: 'medium',
      content: `Dear Sarah Johnson,

I hope this email finds you well. I would like to schedule a quarterly review meeting to discuss our marketing performance and upcoming strategies.

I believe there could be significant mutual benefits from connecting and sharing insights about our respective areas of expertise.

Would you be available for a meeting in the coming weeks? I'm flexible with timing and can accommodate your schedule. I look forward to hearing from you and the possibility of working together.

Best regards,
[Your Name]`,
      userId: users[0].id,
    },
    {
      subject: 'Coffee Chat',
      tone: 'casual',
      purpose: 'Grab coffee and discuss collaboration',
      recipient: 'Mike Chen, Product Manager',
      length: 'short',
      content: `Hey Mike,

Hope you're doing well! I'd love to grab a coffee and chat about some ideas I have.

I think it would be great to connect and share some thoughts - I'm sure we could both benefit from the conversation.

Are you free for coffee sometime this week or next? I'm pretty flexible with timing. Let me know what works for you - I'm excited about the possibility of connecting!

Thanks,
[Your Name]`,
      userId: users[0].id,
    },
    {
      subject: 'Project Follow-up',
      tone: 'friendly',
      purpose: 'Follow up on our project discussion',
      recipient: 'Alex Rodriguez, Developer',
      length: 'long',
      content: `Hi Alex,

I hope you're having a wonderful day! I wanted to reach out about our project discussion and follow up on the exciting opportunities we discussed.

I think we could have a really valuable conversation and I'd love to share some ideas with you about how we can take this project to the next level.

Would you be interested in meeting up to discuss this? I think we could have a really valuable conversation about the technical implementation and potential improvements.

I'd really appreciate the chance to connect - let me know what works for you!

Best wishes,
[Your Name]`,
      userId: users[1].id,
    },
    {
      subject: 'Thank You Note',
      tone: 'professional',
      purpose: 'Thank you for the meeting',
      recipient: 'Lisa Wang, Sales Director',
      length: 'short',
      content: `Dear Lisa Wang,

Thank you for your time and consideration during our recent meeting.

I truly appreciate the opportunity to connect with you and discuss our potential collaboration.

I look forward to our continued partnership and the positive outcomes we can achieve together.

Thank you again for your time and I hope to speak with you soon.

Sincerely,
[Your Name]`,
      userId: users[1].id,
    },
    {
      subject: 'Partnership Proposal',
      tone: 'persuasive',
      purpose: 'Propose a strategic partnership',
      recipient: 'David Kim, CEO',
      length: 'long',
      content: `Dear David Kim,

I hope this message finds you well. I'm reaching out because I have an exciting opportunity that I believe could provide significant value for your business.

This could be a game-changing opportunity for both of us. I'm confident we can create something remarkable together that will transform both our organizations.

I strongly encourage you to consider meeting with me. This could be the breakthrough you've been looking for that will provide significant value for both our organizations.

I'm excited about the potential here and look forward to your positive response.

Best regards,
[Your Name]`,
      userId: users[2].id,
    },
    {
      subject: 'Weekly Update',
      tone: 'casual',
      purpose: 'Share weekly progress update',
      recipient: 'Team Members',
      length: 'medium',
      content: `Hi Team,

Hope you're doing well! I wanted to reach out about our weekly progress and share some exciting updates.

I think this could be a great opportunity for us to connect and share some ideas about our current projects and upcoming milestones.

Would you be interested in chatting about this? I think we could both benefit from the conversation about our progress and next steps.

Let me know what you think - I'm excited about the possibilities!

Thanks,
[Your Name]`,
      userId: users[2].id,
    },
  ];

  const emails = await Promise.all(
    sampleEmails.map(email => prisma.email.create({ data: email }))
  );

  console.log(`✅ Created ${emails.length} sample emails`);

  console.log('🎉 Seed script completed successfully!');
  console.log('\n📧 Sample users created:');
  console.log('- john@example.com (password: password123)');
  console.log('- sarah@example.com (password: password123)');
  console.log('- mike@example.com (password: password123)');
  console.log('\n📧 Sample emails created with different tones and purposes');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
