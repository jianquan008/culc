import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { store } from './store';
import { Calculator } from './components/Calculator/Calculator';
import { initializeTheme, updateSystemTheme } from './store/slices/themeSlice';
import { SystemThemeDetector } from './utils/systemTheme';
import './styles/global.css';
import './styles/themes.css';

function ThemeInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeTheme());
    
    const unwatch = SystemThemeDetector.watch((theme) => {
      dispatch(updateSystemTheme(theme));
    });
    
    return unwatch;
  }, [dispatch]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <ThemeInitializer />
      <div className="App">
        <Calculator />
      </div>
    </Provider>
  );
}

export default App;
