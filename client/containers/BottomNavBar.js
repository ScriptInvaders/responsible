import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { curry } from 'ramda';

import { BottomButton } from '../components/BottomNavBar/BottomButton';

import * as userAction from '../actionCreators/user';
import * as rideAction from '../actionCreators/ride';

/* Jonathan: does this feel too clunky to you? I was debating passing down props and
pulling out the objects we need in each container (like: props.ride). Not sure... */
function BottomNavBar({ user, ride, onConfirmLocationButtonClick }) {
  return (
    <div className="BottomNavBarContainer row">
      <BottomButton {...ride}
        onConfirmLocationButtonClick={onConfirmLocationButtonClick(user.id)} />
    </div>
  );
}

const mapStateToProps = function (state) {
  return state.toJS();
};

// jscs:disable
const mapDispatchToProps = function (dispatch) {
  return {
    onConfirmLocationButtonClick: curry((userId, location) => {
      dispatch(rideAction.fetchRide(userId, location))
    }),
  };
};
// jscs:enable

export const BottomNavBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomNavBar);
