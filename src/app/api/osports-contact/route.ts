// src/app/api/osports-contact/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  try {
    // Check for required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not configured')
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      )
    }

    if (!process.env.EMAIL_FROM || !process.env.EMAIL_TO) {
      console.error('❌ EMAIL_FROM or EMAIL_TO is not configured')
      return NextResponse.json(
        { success: false, error: 'Email configuration incomplete' },
        { status: 500 }
      )
    }

    // Initialize Resend inside the function
    const resend = new Resend(process.env.RESEND_API_KEY)

    const body = await req.json()
    const {
      teamName,
      country,
      teamManagerName,
      phone,
      email,
      ageGroup,
      numberOfPeople,
      message
    } = body

    const emailHtml = `
      <h2>New Accommodation Request</h2>
      <ul>
        <li><strong>Team Name:</strong> ${teamName}</li>
        <li><strong>Country:</strong> ${country}</li>
        <li><strong>Team Manager:</strong> ${teamManagerName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
        <li><strong>Age Group:</strong> ${ageGroup}</li>
        <li><strong>Number of People:</strong> ${numberOfPeople}</li>
        <li><strong>Message:</strong> ${message || 'N/A'}</li>
      </ul>
    `

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'New Cascais Accommodation Request',
      html: emailHtml
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Email Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
