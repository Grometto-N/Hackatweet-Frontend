import { createSlice } from "@reduxjs/toolkit"; /*L'import obligatoire*/

const initialState = {
  value: [],
};

export const allTweetsSlice = createSlice({
  name: "allTweets",

  initialState,
  reducers: {
    addTweet: (state, action) => {
      state.value.unshift(action.payload);
    },
    removeTweets: (state, action) => {
      state.value=[];
    },
  },
});

export const { addTweet , removeTweets} = allTweetsSlice.actions; 
export default allTweetsSlice.reducer;