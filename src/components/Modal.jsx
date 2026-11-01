import Icon from './Icon.jsx'
import { useModal } from '../context/ModalContext.jsx'

/**
 * Clean modal shell — matches the new design system.
 * No glow blobs, no gradient borders. Just a sharp, structured panel.
 */
export default function Modal({ id, icon, iconColor = '#a78bfa', title, subtitle, children, footer }) {
  const { openModalId, closeModal } = useModal()
  const isActive = openModalId === id

  return (
    <div
      className={`modal-overlay fixed inset-0 z-[200] flex items-center justify-center p-4 ${isActive ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={closeModal}
      />

      {/* Panel */}
      <div className="modal-content relative w-full max-w-3xl bg-[#111111] border border-white/[0.09] overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-5">
            <div
              className="w-12 h-12 flex items-center justify-center shrink-0"
              style={{ background: `${iconColor}15`, border: `1px solid ${iconColor}35`, color: iconColor }}
            >
              <Icon name={icon} className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[22px] font-black text-white tracking-tight">{title}</h2>
              {subtitle && (
                <p className="text-[12px] text-zinc-500 mt-0.5 tracking-wide">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-white border border-white/[0.07] hover:border-white/20 transition-colors shrink-0 ml-4"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-white/[0.06]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
