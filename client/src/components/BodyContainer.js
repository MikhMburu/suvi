import React from "react";

const BodyContainer = (props) => {
  return (
    <div className="container">
      <div className="row">{props.children}</div>
    </div>
  );
};

export default BodyContainer;
