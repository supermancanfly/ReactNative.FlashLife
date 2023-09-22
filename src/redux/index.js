import { combineReducers } from 'redux';
import { auth } from '../Core/onboarding/redux/auth';
import { friends } from '../Core/socialgraph/friendships/redux';
import { chat } from '../Core/chat/redux';
import { userReports } from '../Core/user-reporting/redux';
import { users } from '../Core/users/redux';
import { applicationReducer } from '../Core/application/redux';
const LOG_OUT = 'LOG_OUT';

const appReducer = combineReducers({
  auth,
  friends,
  userReports,
  chat,
  users,
  applicationReducer
});

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
