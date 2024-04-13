import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './component/login/Login';
import Dashboard from './component/dashboard/Dashboard';
import { Provider } from 'react-redux';
import store from './store';

export default function Apps() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
    </Provider>

  );
}

 