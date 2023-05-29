export const LoginStart = (userCredential) => ({
  type: "LOGIN_START",
});
export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});
export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});
export const LogOut = (error) => ({
  type: "LOGOUT",
});
export const EditUser = (user) => ({
  type: "USER_EDITED",
  payload: user,
});
