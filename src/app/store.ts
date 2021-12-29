import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/slices/authSlice";
import mainReducer from "../features/slices/mainSlice";
import postReducer from "../features/slices/postSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    main: mainReducer,
    post: postReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
