import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import { SidebarPersist } from '../components/SidebarPersist'

export default function App({ Component, pageProps }) {
  return (
    <>
      <SidebarPersist />
      <Component {...pageProps} />
    </>
  )
}
