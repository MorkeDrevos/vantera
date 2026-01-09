// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Send to you
    await resend.emails.send({
      from: 'Vantera <hello@vantera.io>',
      to: ['hello@vantera.io'],
      replyTo: email,
      subject: 'New contact enquiry',
      html: `
        <p><strong>Name:</strong> ${name || '—'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    // Auto-reply to user
    await resend.emails.send({
      from: 'Vantera <hello@vantera.io>',
      to: [email],
      subject: 'We received your message',
      html: `
        <p>Hello${name ? ` ${name}` : ''},</p>

        <p>Thank you for reaching out to Vantera.</p>

        <p>Your message has been received and is currently under review.  
        We approach every enquiry with care and discretion, and a member of our team will respond shortly.</p>

        <p>Kind regards,<br />
        Vantera<br />
        <em>Intelligence for Real Assets</em></p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
