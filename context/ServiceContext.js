import React, { createContext, useState, useContext } from 'react';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  // State for the currently active service
  const [activeService, setActiveService] = useState(null);

  return (
    <ServiceContext.Provider value={{ activeService, setActiveService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);
