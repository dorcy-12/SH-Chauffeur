import { createContext, useState } from 'react';

export const AuthContext = createContext({
  isUserLoggedIn: false,
  userId: null,
  partnerId:null,
  employeeId: null,
  employeeName:null,
  password:null,
  shouldReloadServices: false,
  channels: null,
  setIsUserLoggedIn: () => {},
  setUserId: () => {},
  setPartnerId: () => {},
  setEmployeeId: () =>{},
  setPassword: () => {},
  setShouldReloadServices: () => {},
  setChannels: () =>{},
  setEmployeeName:() => {},
});
