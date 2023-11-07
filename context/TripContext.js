import React, { createContext, useState, useContext } from 'react';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState({
    id: null,
    vehicle: { vehicle_number: "" },
    start_location: "",
    end_location: "",
    start_time: "",
    driven_time: 0,
    distance: 0,
    stopped: "",
    userPath: null,
    is_completed: false,
  });
  const [allTrips, setAllTrips] = useState([]);

  return (
    <TripContext.Provider value={{ activeTrip, setActiveTrip, allTrips, setAllTrips }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
