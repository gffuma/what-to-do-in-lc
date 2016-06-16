import { setAccessToken, obtainAcessToken } from '../actions/fb';

// Bootstrapping the store
export default function bootstrapStore(store) {

  const accessToken = localStorage.getItem('fb_app_access_token');
  if (accessToken) {
    store.dispatch(setAccessToken(accessToken));
  } else {
    store.dispatch(obtainAcessToken());
  }
}
