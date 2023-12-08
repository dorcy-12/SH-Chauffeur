import { createContext, useState } from 'react';

export const AuthContext = createContext({
  isUserLoggedIn: false,
  userId: null,
  employeeId: null,
  password:null,
  shouldReloadServices: false,
  setIsUserLoggedIn: () => {},
  setUserId: () => {},
  setEmployeeId: () =>{},
  setPassword: () => {},
  setShouldReloadServices: () => {},
});
