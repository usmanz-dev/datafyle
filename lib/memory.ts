import { prisma } from '@/lib/prisma'

export async function getVendorPattern(userId: string, vendorName: string) {
  if (!vendorName) return null
  return prisma.vendorPattern.findUnique({
    where: { userId_vendorName: { userId, vendorName } },
  })
}

export async function saveVendorPattern(
  userId: string,
  vendorName: string,
  amount: number | null
) {
  if (!vendorName) return

  const existing = await prisma.vendorPattern.findUnique({
    where: { userId_vendorName: { userId, vendorName } },
  })

  if (existing) {
    const newAvg =
      existing.avgAmount && amount
        ? (existing.avgAmount * existing.invoiceCount + amount) / (existing.invoiceCount + 1)
        : amount

    await prisma.vendorPattern.update({
      where: { id: existing.id },
      data: {
        avgAmount: newAvg,
        invoiceCount: { increment: 1 },
        lastSeen: new Date(),
      },
    })
  } else {
    await prisma.vendorPattern.create({
      data: { userId, vendorName, avgAmount: amount, invoiceCount: 1 },
    })
  }
}
