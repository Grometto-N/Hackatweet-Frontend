import { createSlice } from "@reduxjs/toolkit"; /*L'import obligatoire*/

const initialState = {
  value: false /*Value de base dans l'exemple un tableau*/,
};

export const modaleUpSlice = createSlice({
  name: "modaleUp" /*Le nom de ton reducer*/,

  initialState /*Appel de l'état initial*/,
  reducers: {
    changeModaleUp: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeModaleUp } = modaleUpSlice.actions; /*Expore des actions*/
export default modaleUpSlice.reducer;
