import './App.scss'
import { AptosContextProvider } from './context/useAptos'
import Main from './pages/Main'

function App () {
  // return <Button variant='contained'>Hello World</Button>
  return (
    <AptosContextProvider>
      <Main />
    </AptosContextProvider>
    // <div>
    // </div>
  )
}
export default App
