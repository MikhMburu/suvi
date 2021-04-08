import React, { useState, useContext, useEffect } from "react";
import ReadingsContext from "../context/readingsContext";
import FormItem from "./FormItem";
import FormContainer from "./FormContainer";
import Spinner from "./Spinner";

const MtrForm = () => {
  const readingContext = useContext(ReadingsContext);
  const { houses, addReadings } = readingContext;

  const [hse, setHse] = useState(null);
  const [mtr_readings, setMtr_readings] = useState(null);
  // console.log("Logging houses..", houses);
  useEffect(() => {
    const occupied_houses = houses.map((house) => {
      return { tenant: house.tenancy_id, hseno: house.hseno };
    });
    setHse(occupied_houses);
  }, [houses]);
  // Define functions
  const onChangeHandler = (e) => {
    setMtr_readings({ ...mtr_readings, [e.target.name]: e.target.value });
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("click");
    try {
      // console.log(mtr_readings);
      const arrMtr = Object.keys(mtr_readings).map((mr) => {
        return { tenancy: mr, mtr_reading: mtr_readings[mr] };
      });
      // console.log(arrMtr);
      addReadings(arrMtr);
    } catch (err) {
      console.log("Something went wrong with the code..", err);
    }
  };
  return (
    <FormContainer onSubmitHandler={onSubmitHandler}>
      {hse ? (
        hse.map((house, i) => {
          return (
            <FormItem onChangeHandler={onChangeHandler} house={house} key={i} />
          );
        })
      ) : (
        <Spinner shade="info" />
      )}
    </FormContainer>
  );
};

export default MtrForm;
