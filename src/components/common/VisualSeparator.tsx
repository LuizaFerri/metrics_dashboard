interface VisualSeparatorProps {
  show: boolean
}

export const VisualSeparator = ({ show }: VisualSeparatorProps) => {
  if (!show) return null

  return (
    <div className="relative mb-12">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-600"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-slate-950 px-4 text-slate-400">•••</span>
      </div>
    </div>
  )
}
