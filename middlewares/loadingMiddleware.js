import { setIsLoading } from "../src/redux/loadingSlice";

let loadingCount = 0;

const loadingMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith("/pending")) {
    loadingCount++;
    store.dispatch(setIsLoading(true));
  }

  if (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")) {
    loadingCount = Math.max(0, loadingCount - 1);

    if (loadingCount === 0) {
      store.dispatch(setIsLoading(false));
    }
  }

  return next(action);
};

export default loadingMiddleware;
