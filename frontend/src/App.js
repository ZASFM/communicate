import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import Calls from './components/Calls';
import CalendarComp from './pages/Calendar';

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
            path="/chats/call"
            element={<Calls />}
          />
        </Route>
        <Route
            path='/calendar/:id'
            element={<CalendarComp/>}
          />
      </Routes>
    </div>
  );
}

export default App;
