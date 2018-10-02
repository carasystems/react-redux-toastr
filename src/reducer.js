import { fromJS } from 'immutable';
import { guid }  from './utils.js';
import config from './config';
import {
  ADD_TOASTR,
  REMOVE_TOASTR,
  CLEAN_TOASTR,
  SHOW_CONFIRM,
  HIDE_CONFIRM,
  REMOVE_BY_TYPE
} from './constants';

// TOTO: find a better way of handling this issue
// We will cache data so we can check for duplicated before fire the add action.
export let toastrsCache = [];

const initialState = fromJS({
  toastrs: [],
  confirm: null
});

export default function toastReducer(state = initialState, action) {
  let toastrs;
  switch (action.type) {
    /* istanbul ignore next */
    case ADD_TOASTR:
      const toastr = action.payload;

      if (toastr.ignoreToastr) {
        return state;
      }

      const newToastr = {
        id: guid(),
        ...toastr
      };

      if (!config.newestOnTop) {
        toastrs = [
          ...state.get('toastrs').toJS(),
          newToastr,
        ];
      } else {
        toastrs = [
          newToastr,
          ...state.get('toastrs').toJS(),
        ];
      }
      toastrsCache = newState.toastrs;

      return state.merge({
        toastrs,
      });
    case REMOVE_TOASTR:
      toastrs = state.get('toastrs').toJS().filter(toastr => toastr.id !== action.payload);

      toastrsCache = toastrs;

      return state.merge({
        toastrs,
      });
    case CLEAN_TOASTR:
      toastrsCache = [];
      return state.set('toastrs', []);
    case SHOW_CONFIRM:
      return state.set('confirm', {
        id: action.payload.id || guid(),
        show: true,
        message: action.payload.message,
        options: action.payload.options || {},
      });
    case HIDE_CONFIRM:
      return state.set('confirm', null);
    default:
      return state;
  }
}
