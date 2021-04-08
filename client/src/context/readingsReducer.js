import {
  LOAD_METER_READINGS,
  SAVE_METER_READINGS,
  GENERATE_REPORTS,
} from "./types";

export default (state, action) => {
  switch (action.type) {
    case LOAD_METER_READINGS:
      return {
        ...state,
        readings: action.payload,
      };

    default:
      return state;
  }
};
