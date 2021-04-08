import React from "react";

const Spinner = ({ shade }) => {
  return (
    <div class="d-flex justify-content-center">
      <div className={`spinner-grow text-${shade} m-5`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
