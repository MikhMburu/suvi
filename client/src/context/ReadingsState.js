import React, { useReducer } from "react";
import ReadingsContext from "./readingsContext";
import readingsReducer from "./readingsReducer";
import axios from "axios";
import mreadings from "../readings";
import { LOAD_METER_READINGS } from "./types";

const ReadingsState = (props) => {
  // initialize initialState
  const initialState = {
    readings: null,
    houses: mreadings.houses,
  };
  const [state, dispatch] = useReducer(readingsReducer, initialState);
  // Add meter readings
  const addReadings = async (readings) => {
    try {
      // Post readings to API
      let res = await axios.post(
        "/api/tenants/readings/meter-reading",
        readings,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(res.data);
      if (res.data.success) {
        // If successful, retrieve records
        res = await axios.get("/api/tenants/readings/meter-reading");
        dispatch({
          type: LOAD_METER_READINGS,
          payload: res.data,
        });
        console.log(res.data);
      }
    } catch (err) {}
  };
  // Load meter readings

  // Generate reports

  return (
    <ReadingsContext.Provider
      value={{
        readings: state.readings,
        houses: state.houses,
        addReadings,
      }}
    >
      {props.children}
    </ReadingsContext.Provider>
  );
};

export default ReadingsState;
