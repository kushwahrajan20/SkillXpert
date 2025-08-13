import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { appstore } from './app/store'
import { Toaster } from 'sonner'
import { useLoadUserQuery } from './features/api/authApi'
import LoadingSpinner from './components/LoadingSpinner'

const Custom = ({children}) => {
  const {isLoading} = useLoadUserQuery();
  return <>
    {isLoading ? <LoadingSpinner/> : <>{children}</>}</>;
  };

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appstore}>
      <Custom>
      <App />
      <Toaster/>
      </Custom>
      
    </Provider>
  </StrictMode>,
)
