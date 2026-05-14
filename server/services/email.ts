import { Resend } from 'resend'
import type { PublicReading } from '../../shared/readings'
import { isTestMode, requireResendConfig } from '../utils/env'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildPlainText(reading: PublicReading) {
  const cardSummary = reading.cards
    .map((card) => `- ${card.position}: ${card.name}${card.reversed ? ' (Reversed)' : ''}`)
    .join('\n')

  return [
    'Tarot Agent reading',
    `Question: ${reading.question}`,
    `Spread: ${reading.spreadName}`,
    '',
    'Cards:',
    cardSummary,
    '',
    'Reading:',
    reading.finalText,
    '',
    `View online: ${reading.shareUrl}`,
  ].join('\n')
}

function buildHtml(reading: PublicReading) {
  const cardSummary = reading.cards
    .map(
      (card) =>
        `<li><strong>${escapeHtml(card.position)}</strong>: ${escapeHtml(card.name)}${card.reversed ? ' (Reversed)' : ''}</li>`,
    )
    .join('')

  return `
    <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af;">Tarot Agent</p>
      <h1 style="font-size: 24px; margin: 0 0 12px;">Your saved tarot reading</h1>
      <p style="margin: 0 0 12px;"><strong>Question:</strong> ${escapeHtml(reading.question)}</p>
      <p style="margin: 0 0 20px;"><strong>Spread:</strong> ${escapeHtml(reading.spreadName)}</p>
      <h2 style="font-size: 16px; margin: 0 0 8px;">Cards drawn</h2>
      <ul style="padding-left: 20px; margin: 0 0 20px;">${cardSummary}</ul>
      <h2 style="font-size: 16px; margin: 0 0 8px;">Reading</h2>
      <p style="white-space: pre-wrap; margin: 0 0 20px;">${escapeHtml(reading.finalText)}</p>
      <p style="margin: 0 0 8px;"><a href="${reading.shareUrl}">Open your saved reading</a></p>
      <p style="font-size: 12px; color: #6b7280;">For entertainment purposes only.</p>
    </div>
  `
}

function buildAccountLoginPlainText(code: string) {
  return [
    'Tarot Agent archive login',
    '',
    `Your login code is ${code}.`,
    '',
    'This code expires in 10 minutes. If you did not request it, you can ignore this email.',
  ].join('\n')
}

function buildAccountLoginHtml(code: string) {
  return `
    <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 520px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af;">Tarot Agent</p>
      <h1 style="font-size: 24px; margin: 0 0 12px;">Archive login code</h1>
      <p style="margin: 0 0 16px;">Use this code to restore your saved readings:</p>
      <p style="font-size: 28px; letter-spacing: 0.18em; font-weight: 700; margin: 0 0 16px;">${escapeHtml(code)}</p>
      <p style="font-size: 13px; color: #6b7280; margin: 0;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
    </div>
  `
}

export async function sendReadingEmail(input: { to: string; reading: PublicReading }) {
  if (isTestMode()) {
    return {
      provider: 'resend',
      id: `test_${crypto.randomUUID()}`,
    }
  }

  const { apiKey, fromEmail } = requireResendConfig()
  const resend = new Resend(apiKey)
  const response = await resend.emails.send({
    from: fromEmail,
    to: input.to,
    subject: `${input.reading.spreadName} tarot reading`,
    text: buildPlainText(input.reading),
    html: buildHtml(input.reading),
  })

  if (response.error) {
    throw new Error(response.error.message || 'Resend could not send this reading email.')
  }

  return {
    provider: 'resend',
    id: response.data?.id ?? crypto.randomUUID(),
  }
}

export async function sendAccountLoginCodeEmail(input: { to: string; code: string }) {
  if (isTestMode()) {
    return {
      provider: 'resend',
      id: `test_${crypto.randomUUID()}`,
    }
  }

  const { apiKey, fromEmail } = requireResendConfig()
  const resend = new Resend(apiKey)
  const response = await resend.emails.send({
    from: fromEmail,
    to: input.to,
    subject: 'Your Tarot Agent login code',
    text: buildAccountLoginPlainText(input.code),
    html: buildAccountLoginHtml(input.code),
  })

  if (response.error) {
    throw new Error(response.error.message || 'Resend could not send this login email.')
  }

  return {
    provider: 'resend',
    id: response.data?.id ?? crypto.randomUUID(),
  }
}
