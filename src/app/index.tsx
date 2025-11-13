import { store } from '@/store'
import { Provider } from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <div className="flex items-center justify-center">App</div>
    </Provider>
  )
}

export default App
