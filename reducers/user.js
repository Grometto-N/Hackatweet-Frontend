import { createSlice } from "@reduxjs/toolkit"; /*L'import obligatoire*/

const initialState = {
  value: {
    firstName: "",
    userName: "",
    token: "",
  } /*Value de base dans l'exemple un tableau*/,
};

export const userSlice = createSlice({
  name: "user" /*Le nom de ton reducer*/,

  initialState /*Appel de l'état initial*/,
  reducers: {
    addUser: (state, action) => {
      state.value = {
        firstName: action.payload.firstName,
        userName: action.payload.userName,
        token: action.payload.token,
      };  
    },
    removeUser: (state, action) => {
      state.value = {
        firstName: "",
        userName: "",
        token: "",
      };  
    },
  },
});

export const { addUser, removeUser } = userSlice.actions; /*Expore des actions*/
export default userSlice.reducer;
