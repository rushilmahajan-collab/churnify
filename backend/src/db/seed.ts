import { db } from '../config/database';
import { emailTemplates } from './schema';

const defaultTemplates = [
  {
    name: 'Friendly Check-In',
    templateType: 'check_in',
    subject: 'Quick check-in from {{company_name}}',
    bodyHtml: `<p>Hi {{customer_first_name}},</p>
<p>I noticed it's been a little while since we last connected. I wanted to reach out personally and see how things are going with your {{plan_name}} subscription.</p>
<p>Is there anything we can help with? Any features you'd like to see?</p>
<p>Just hit reply — I read every response.</p>
<p>Best,<br>{{sender_name}}</p>`,
    previewText: 'Just wanted to see how things are going',
    isDefault: true,
  },
  {
    name: 'Win-Back with Offer',
    templateType: 'win_back',
    subject: 'We\'d love to have you back, {{customer_first_name}}',
    bodyHtml: `<p>Hi {{customer_first_name}},</p>
<p>I noticed your account might need some attention, and I want to make sure you're getting the most value from {{company_name}}.</p>
<p>As a thank you for being a customer, I'd like to offer you {{offer_value}} — no strings attached.</p>
<p>If there's something we could do better, I'd genuinely love to hear it.</p>
<p><a href="{{cta_url}}">Claim Your Offer →</a></p>
<p>Best,<br>{{sender_name}}</p>`,
    previewText: 'Here's something special just for you',
    isDefault: true,
  },
  {
    name: 'Personal Note',
    templateType: 're_engage',
    subject: 'A note from {{sender_name}} at {{company_name}}',
    bodyHtml: `<p>Hi {{customer_first_name}},</p>
<p>This isn't an automated email — I'm writing because I genuinely want to make sure you're happy with {{company_name}}.</p>
<p>If something's not working, or if there's a reason you've been thinking about making a change, I'd love to hear about it. Sometimes the smallest fix makes the biggest difference.</p>
<p>Would you have 10 minutes for a quick call this week? Just reply with a time that works.</p>
<p>{{sender_name}}</p>`,
    previewText: 'This isn\'t an automated email',
    isDefault: true,
  },
  {
    name: 'At-Risk Save Offer',
    templateType: 'save_offer',
    subject: '{{customer_first_name}}, let's make this work',
    bodyHtml: `<p>Hi {{customer_first_name}},</p>
<p>I've been looking at your account and I think there might be more value we can unlock for you with {{company_name}}.</p>
<p>I'd like to offer you {{offer_value}} to give us another shot. No catch — just my way of saying we value your business and want to earn it.</p>
<p><a href="{{cta_url}}">Accept Offer →</a></p>
<p>And if there's a specific issue driving your experience, hit reply and let me know. I'll personally make sure it gets addressed.</p>
<p>{{sender_name}}</p>`,
    previewText: 'We want to help you get more value',
    isDefault: true,
  },
];

async function seed() {
  console.log('Seeding default email templates...');

  for (const template of defaultTemplates) {
    try {
      await db.insert(emailTemplates).values({
        orgId: null as any, // Will be overridden by org-specific insert
        ...template,
        isActive: true,
      });
    } catch (err) {
      console.error(`Failed to seed template: ${template.name}`, err);
    }
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
