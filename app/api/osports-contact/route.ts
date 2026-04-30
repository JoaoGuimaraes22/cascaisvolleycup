import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { escapeHtml } from '../_lib/escape-html'

export const dynamic = 'force-dynamic'

const accommodationSchema = z.object({
  teamName: z.string().min(1).max(200),
  country: z.string().min(1).max(200),
  teamManagerName: z.string().min(1).max(200),
  phone: z.string().max(50).optional().default(''),
  email: z.string().email().max(320),
  ageGroup: z.string().min(1).max(100),
  numberOfPeople: z.union([z.string(), z.number()]).transform(v => String(v)),
  message: z.string().max(5000).optional().default('')
})

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      )
    }

    if (!process.env.EMAIL_FROM || !process.env.OSPORT_EMAIL_TO) {
      console.error('EMAIL_FROM or OSPORT_EMAIL_TO is not configured')
      return NextResponse.json(
        { success: false, error: 'Email configuration incomplete' },
        { status: 500 }
      )
    }

    const raw = await req.json()
    const parsed = accommodationSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid accommodation payload' },
        { status: 400 }
      )
    }

    const {
      teamName,
      country,
      teamManagerName,
      phone,
      email,
      ageGroup,
      numberOfPeople,
      message
    } = parsed.data
    const resend = new Resend(process.env.RESEND_API_KEY)

    const html = `
      <h2>New Accommodation Request</h2>
      <ul>
        <li><strong>Team Name:</strong> ${escapeHtml(teamName)}</li>
        <li><strong>Country:</strong> ${escapeHtml(country)}</li>
        <li><strong>Team Manager:</strong> ${escapeHtml(teamManagerName)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(phone || 'N/A')}</li>
        <li><strong>Age Group:</strong> ${escapeHtml(ageGroup)}</li>
        <li><strong>Number of People:</strong> ${escapeHtml(numberOfPeople)}</li>
        <li><strong>Message:</strong> ${escapeHtml(message || 'N/A')}</li>
      </ul>
    `

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.OSPORT_EMAIL_TO,
      subject: 'New Cascais Accommodation Request',
      html
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
