import Icon from './Icon.jsx'
import { themes } from '../data/services.js'
import { useModal } from '../context/ModalContext.jsx'

export default function ServiceCard({ service }) {
  const theme = themes[service.color]
  const { openModal } = useModal()

  return (
    <div
      className={`snap-start shrink-0 w-[320px] md:w-[380px] cyber-card ${theme.text} border border-white/5 flex flex-col justify-between group ${theme.cardShadowHover} transition-all duration-500 h-[450px] p-2`}
    >
      <div
        className={`h-[220px] bg-gradient-to-b ${theme.gradientFrom} to-transparent flex items-center justify-center relative`}
      >
        <div
          className={`absolute inset-0 ${theme.radial} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <div
          className={`w-24 h-24 ${theme.iconBg} border ${theme.iconBorder} flex items-center justify-center ${theme.iconShadow} group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 relative z-10`}
        >
          <Icon name={service.icon} className={`w-12 h-12 ${theme.iconText}`} />
        </div>
      </div>

      <div className="p-6 relative text-white bg-gradient-to-t from-[#09090b] to-transparent h-full flex flex-col justify-end">
        <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
        <p className="text-sm text-gray-400 pr-12 leading-relaxed">{service.description}</p>

        <button
          onClick={service.modalId ? () => openModal(service.modalId) : undefined}
          className={`absolute bottom-6 right-6 w-12 h-12 bg-transparent border border-white/20 flex items-center justify-center text-2xl font-light text-white ${theme.plusHover} transition-all duration-300 ${theme.plusGroupBorder} hover:rotate-90`}
        >
          +
        </button>
      </div>
    </div>
  )
}
