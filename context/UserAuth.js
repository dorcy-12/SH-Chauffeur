import { createContext, useState } from 'react';

export const AuthContext = createContext({
  isUserLoggedIn: false,
  userId: null,
  partnerId:null,
  employeeProfile: null,
  password:null,
  shouldReloadServices: false,
  channels: null,
  setIsUserLoggedIn: () => {},
  setUserId: () => {},
  setPartnerId: () => {},
  setEmployeeProfile: () =>{},
  setPassword: () => {},
  setShouldReloadServices: () => {},
  setChannels: () =>{},
});
