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
    setTweets: (state, action) => {
      state.value=action.payload;
    },
    deleteOneTweet: (state, action) => {
      state.value=state.value.filter(eltTweet => eltTweet.tweetId !== action.payload);
    },
    // action.payload sera un objet avec les clés : {message, isliked, likes}
    updateLike: (state, action) => {
      state.value=state.value.map(elt =>{
        if(elt.message === action.payload.message){
          return {tweetId : elt.tweetId,
            firstName: elt.firstName,
            userName: elt.userName,
            date: elt.date,
            message: elt.message,
            likes: action.payload.likes,
            isLiked: action.payload.isLiked,
            isUserTweet : elt.isUserTweet,
        }
        }
        return elt;
      });
    },
  },
});

export const { addTweet , removeTweets, setTweets, updateLike, deleteOneTweet} = allTweetsSlice.actions; 
export default allTweetsSlice.reducer;