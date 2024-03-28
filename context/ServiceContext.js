import React, { createContext, useState, useContext } from "react";

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  // State for the currently active service
  const [activeService, setActiveService] = useState(null);
  const [services, setServices] = useState([]);
  const addService = (newService) => {
    setServices((prevServices) => [...prevServices, newService]);
  };
  const updateService = (updatedService) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === updatedService.id
          ? { ...service, ...updatedService }
          : service
      )
    );
  };

  const deleteService = (serviceId) => {
    setServices((prevServices) => prevServices.filter((service) => service.id !== serviceId));
  };
  return (
    <ServiceContext.Provider
      value={{
        services,
        activeService,
        setActiveService,
        setServices,
        addService,
        updateService,
        deleteService
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext);
