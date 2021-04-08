import React from "react";
import Moment from "moment";

const FormContainer = (props) => {
  const read_date = Moment()
    // .subtract(1, "months")
    .startOf("month")
    .format("Do MMMM, YYYY");
  return (
    <div className="col-md-3 col-sm-12">
      <div className="card mt-1 p-2 shadow">
        <div className="card-header">
          <p className="card-title text-uppercase">Meter Reading</p>
          <small className="text-muted">{read_date}</small>
        </div>
        <form onSubmit={props.onSubmitHandler}>
          {props.children}
          <button
            type="submit"
            className="btn btn-warning btn-block form-control"
          >
            Submit Readings
          </button>
        </form>
      </div>
    </div>
  );
};
export default FormContainer;
