import { connect } from "react-redux";
import { Dispatch } from "redux";
import { InitialState, Props } from "./reducer";

export default function Dispatches(element: JSX.Element, dispatches: Props) {
  function mapStateToProps(state: InitialState) {
    return { state };
  }

  return connect(mapStateToProps, dispatches)(element);
}
