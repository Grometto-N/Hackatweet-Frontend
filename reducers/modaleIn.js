import { createSlice } from "@reduxjs/toolkit"; /*L'import obligatoire*/

const initialState = {
  value: false /*Value de base dans l'exemple un tableau*/,
};

export const modalInSlice = createSlice({
  name: "modaleIn" /*Le nom de ton reducer*/,

  initialState /*Appel de l'état initial*/,
  reducers: {
    changeModaleIn: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeModaleIn } = modalInSlice.actions; /*Expore des actions*/
export default modalInSlice.reducer;
