import React from "react";
import Moment from "moment";

const TableContainer = (props) => {
  const endOfLastMonth = Moment()
    .subtract(1, "months")
    .endOf("month")
    .format("Do MMMM, YYYY");

  return (
    <div className="col-md-9 col-sm-12">
      <div className="card mt-1 p-2 shadow">
        <div className="card-header">
          <p className="card-title text-uppercase text-center text-decoration-underline">
            Water Consumption for the month ended {endOfLastMonth}
            {/* <Moment format="Do MMMM, YYYY">2021-03-31</Moment> */}
          </p>
        </div>
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Hse</th>
              <th>Tenant Name</th>
              <th>Prev Reading</th>
              <th>Current Reading</th>
              <th>Consumption</th>
              <th>{`\t`}</th>
            </tr>
          </thead>
          <tbody className="font-monospace">{props.children}</tbody>
        </table>
      </div>
    </div>
  );
};
export default TableContainer;
