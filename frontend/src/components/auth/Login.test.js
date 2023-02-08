/* import {screen, render, waitFor, fireEvent} from '@testing-library/react'
import Login from './Login';
import axios from 'axios';

jest.mock('axios', () => ({
   __esModules: true,
   default: {
      get: () => ({
         data: { id: 1, name: 'name' }
      })
   }
}))

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('email input should be on the page',()=>{
   render(<Login/>);
   const email=screen.getAllByPlaceholderText(/email/i);
   expect(email).toBeInTheDocument();
})  */