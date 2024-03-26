import React, { createContext, useState, useContext } from "react";


const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  // State for the currently active service
  const [activeService, setActiveService] = useState(null);
  const [services, setServices] = useState([]);
  const addService = (newService) => {
    setServices((prevServices) => [...prevServices, newService]);
  };

  return (
  
    <ServiceContext.Provider
      value={{
        services,
        activeService,
        setActiveService,
        setServices,
        addService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);
