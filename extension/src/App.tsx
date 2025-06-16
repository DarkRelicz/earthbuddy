import { useState } from 'react';
import Home from "./components/Home";

const App = () => {
  const [currentView, setCurrentView] = useState<'home'>('home');

  return (
    <>
      {currentView === 'home' && (
        <Home />
      )}
    </>
  );
};

export default App;