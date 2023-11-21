import { createContext, useState } from 'react';

export const AuthContext = createContext({
  isUserLoggedIn: false,
  userId: null,
  setIsUserLoggedIn: () => {},
  setUserId: () => {},
});
