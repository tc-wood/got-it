import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostEmail, participantEmail, quizTitle } = body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to: hostEmail,
      subject: 'Got It! - A participant needs help',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
          <!-- Content -->
          <div style="padding: 30px 25px;">
            <h2 style="color: #333; margin-top: 0;">Quiz Assistance Needed</h2>
            <p style="color: #555; line-height: 1.5;">A participant, <strong>${participantEmail}</strong>, got the quiz "<strong>${quizTitle}</strong>" wrong and may need clarification.</p>
            <p style="color: #555; line-height: 1.5;">You might want to reach out to provide additional explanation on this topic.</p>
            <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #0070f3;">
              <p style="margin: 0; color: #666;">Providing timely feedback helps participants better understand the material.</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
            <p style="margin: 0; color: #888; font-size: 14px;">© ${new Date().getFullYear()} Got It! All rights reserved.</p>
            <p style="margin: 5px 0 0; color: #888; font-size: 14px;">This is an automated notification from the Got It platform.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}