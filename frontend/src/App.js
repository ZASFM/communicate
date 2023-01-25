import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <div>
      Nav
      <Routes>
        <Route
          path="/"
          element={ <HomePage/> }
        />
        <Route
          path="/chats"
          element={ <ChatPage/> }
        />
      </Routes>
    </div>
  );
}

export default App;
