import React, { useContext } from "react";
import Moment from "moment";
import TableContainer from "./TableContainer";
import TableItem from "./TableItem";
import ReadingsContext from "../context/readingsContext";

const MtrReadingSummary = () => {
  const readingsContext = useContext(ReadingsContext);
  const { readings } = readingsContext;
  // let consumption = readings
  //   ? readings.filter(
  //       (reading) =>
  //         Moment(reading.date_of_reading).format("YYYY-MM-DD") ===
  //         Moment().format("YYYY-MM-DD")
  //     )
  //   : null;
  return (
    <TableContainer>
      {readings ? (
        readings.map((reading, i) => {
          return <TableItem key={i} reading={reading} />;
        })
      ) : (
        <tr className="text-center">
          <td colspan="6">No Items to show</td>
        </tr>
      )}
    </TableContainer>
  );
};

export default MtrReadingSummary;
