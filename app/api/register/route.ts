import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { escapeHtml } from "../_lib/escape-html";

export const dynamic = "force-dynamic";

const registrationSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  mobile: z.string().max(50).optional().default(""),
  club: z.string().min(1).max(200),
  city: z.string().min(1).max(200),
  country: z.string().min(1).max(200),
  questions: z.string().max(5000).optional().default(""),
});

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "Email service not configured" },
        { status: 500 }
      );
    }

    if (!process.env.EMAIL_FROM || !process.env.VOLLEY4ALL_EMAIL_TO) {
      console.error("EMAIL_FROM or VOLLEY4ALL_EMAIL_TO is not configured");
      return NextResponse.json(
        { success: false, error: "Email configuration incomplete" },
        { status: 500 }
      );
    }

    const raw = await req.json();
    const parsed = registrationSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid registration payload" },
        { status: 400 }
      );
    }

    const { name, email, mobile, club, city, country, questions } = parsed.data;
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <h2>New Registration</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Mobile:</strong> ${escapeHtml(mobile || "N/A")}</li>
        <li><strong>Club:</strong> ${escapeHtml(club)}</li>
        <li><strong>City:</strong> ${escapeHtml(city)}</li>
        <li><strong>Country:</strong> ${escapeHtml(country)}</li>
        <li><strong>Questions:</strong> ${escapeHtml(questions || "N/A")}</li>
      </ul>
    `;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.VOLLEY4ALL_EMAIL_TO,
      subject: "New Cascais Registration",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
