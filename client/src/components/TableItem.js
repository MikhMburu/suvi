import React from "react";

const TableItem = ({ reading }) => {
  const {
    hseno,
    first_name,
    surname,
    prevReading,
    currentReading,
    Consumption,
  } = reading;
  // const hseno = 1;
  // const first_name+ "M+chael";
  // const surname = "Mburu";
  // const mtr_reading = 10;
  return (
    <tr>
      <th scope="row">{hseno}</th>
      <td>{`${first_name} ${surname}`}</td>
      <td>{prevReading}</td>
      <td>{currentReading}</td>
      <td>{Consumption}</td>
      <td>
        <a href="#" className="btn btn-outline-success">
          Summary
        </a>
      </td>
    </tr>
  );
};

export default TableItem;
