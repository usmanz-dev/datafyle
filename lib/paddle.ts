export const PLAN_IDS: Record<string, string> = {
  starter:      'pri_01kxjyxfgme743wde3gjxgf8a6',
  professional: 'pri_01kxmw368f46g8c5ta83sqfkwq',
  business:     'pri_01kxmwbk42tas6qfn3rq4mkbm9',
  enterprise:   'pri_01kxmwrq59wz6173k73rh70qbp',
  extraSeat:    '',
}

export const PLAN_DOCS: Record<string, number> = {
  starter:      500,
  professional: 3000,
  business:     10000,
  enterprise:   20000,
}

export const PLAN_DISPLAY: Record<string, string> = {
  starter:      'Starter',
  professional: 'Professional',
  business:     'Business',
  enterprise:   'Enterprise',
}

export async function createCheckoutUrl(
  plan: string,
  userId: string,
  email: string
): Promise<string> {
  const priceId = PLAN_IDS[plan]
  if (!priceId || priceId.includes('REPLACE_WITH')) {
    throw new Error(`Price ID not configured for plan: ${plan}. Add it to lib/paddle.ts`)
  }

  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) throw new Error('PADDLE_API_KEY is not set')

  const res = await fetch('https://api.paddle.com/transactions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      customer: { email },
      custom_data: { userId, plan, userEmail: email },
      settings: {
        success_url: `https://www.datafyle.com/dashboard?success=1&plan=${plan}`,
      },
    }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: { detail?: string } })?.error?.detail ?? 'Paddle API error')
  }

  const data = await res.json() as { data?: { checkout?: { url?: string } } }
  const url = data?.data?.checkout?.url
  if (!url) throw new Error('No checkout URL returned from Paddle')

  return url
}
