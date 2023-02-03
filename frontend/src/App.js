import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import Calls from './components/Calls';

const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/chats"
        >
          <Route
            index
            element={<ChatPage />}
          />
          <Route
            path="call:/id"
            element={<Calls />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
