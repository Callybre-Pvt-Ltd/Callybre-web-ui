import Preloader from './components/Preloader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ServicesSection from './components/ServicesSection.jsx'
import WhyUs from './components/WhyUs.jsx'
import Methodology from './components/Methodology.jsx'
import Portfolio from './components/Portfolio.jsx'
import About from './components/About.jsx'
import Testimonials from './components/Testimonials.jsx'
import FAQ from './components/FAQ.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import VideoModal from './components/modals/VideoModal.jsx'
import { ModalProvider, useModal } from './context/ModalContext.jsx'
import { AppReadyProvider } from './context/AppReadyContext.jsx'
import useEscapeToClose from './hooks/useEscapeToClose.js'

function ModalsLayer() {
  const { closeModal } = useModal()
  useEscapeToClose(closeModal)

  return (
    <>
      <VideoModal />
    </>
  )
}

export default function App() {
  return (
    <AppReadyProvider>
      <ModalProvider>
          <Preloader />
        <Navbar />
        <main>
          <Hero />
          <ServicesSection />
          <WhyUs />
          <Methodology />
          <Portfolio />
          <About />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>
        <Footer />
        <ModalsLayer />
      </ModalProvider>
    </AppReadyProvider>
  )
}
