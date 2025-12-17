import { Provider } from 'react-redux';
import { store } from './store';
import { Calculator } from './components/Calculator/Calculator';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Calculator />
      </div>
    </Provider>
  );
}

export default App;
