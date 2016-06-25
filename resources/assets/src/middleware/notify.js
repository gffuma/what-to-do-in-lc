import 'humane-js/themes/libnotify.css';
import humane from 'humane-js';

// Confiure humane...
humane.baseCls = 'humane-libnotify';

// le Middleware...
export default store => next => action => {
  // Not a notify action
  if (!action.notify) {
    return next(action);
  }

  const { message, options } = action.notify;

  // Notify stuff with humane js
  humane.log(message, options);

  return next(action);
};
