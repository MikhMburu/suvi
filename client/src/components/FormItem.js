import React from "react";
import PropTypes from "prop-types";

const FormItem = (props) => {
  const { onChangeHandler, house } = props;
  const { hseno, tenant } = house;
  return (
    <div className="input-group mb-1">
      <span className="input-group-text"> {`Hse #${hseno}`} </span>
      <input
        type="text"
        name={tenant}
        className="form-control"
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default FormItem;
