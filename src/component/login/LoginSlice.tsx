
import { createSlice,PayloadAction  } from '@reduxjs/toolkit';

interface LoginData {
    username: string;
    password: string;
  }
  
  interface LoginState {
    loginData: LoginData[];
    isLoggedIn: boolean;
  }

const initialState :LoginState= {
  loginData: [],
  isLoggedIn: false,
};

const LoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<LoginData>) => {
      state.loginData =[action.payload];
      state.isLoggedIn = true;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export default LoginSlice.reducer;
export const { setLoginData } = LoginSlice.actions;
