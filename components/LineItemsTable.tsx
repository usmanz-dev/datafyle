'use client'

interface LineItem {
  description?: string
  quantity?: number
  unitPrice?: number
  total?: number
}

interface Props {
  items: LineItem[]
}

export function LineItemsTable({ items }: Props) {
  if (!items || items.length === 0) return null

  const grandTotal = items.reduce((sum, item) => sum + (item.total ?? 0), 0)

  return (
    <div className="overflow-hidden rounded-lg border border-[#E2E8F0]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <th className="text-left px-4 py-2.5 font-medium text-[#1E293B]">Description</th>
            <th className="text-right px-4 py-2.5 font-medium text-[#1E293B]">Qty</th>
            <th className="text-right px-4 py-2.5 font-medium text-[#1E293B]">Unit Price</th>
            <th className="text-right px-4 py-2.5 font-medium text-[#1E293B]">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-[#E2E8F0] bg-white">
              <td className="px-4 py-3 text-[#1E293B]">{item.description ?? '—'}</td>
              <td className="px-4 py-3 text-right text-[#1E293B]">{item.quantity ?? '—'}</td>
              <td className="px-4 py-3 text-right text-[#1E293B]">
                {item.unitPrice != null ? `$${item.unitPrice.toLocaleString()}` : '—'}
              </td>
              <td className="px-4 py-3 text-right text-[#1E293B]">
                {item.total != null ? `$${item.total.toLocaleString()}` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <td colSpan={3} className="px-4 py-3 font-bold text-[#1E293B] text-right">
              Total
            </td>
            <td className="px-4 py-3 font-bold text-[#1E293B] text-right">
              ${grandTotal.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
