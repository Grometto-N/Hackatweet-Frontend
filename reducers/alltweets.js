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
    // action.payload sera un objet avec les clés : {message, isliked, likes}
    updateLike: (state, action) => {
      state.value=state.value.map(elt =>{
        if(elt.message === action.payload.message){
          console.log(elt.firstName)
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

export const { addTweet , removeTweets, setTweets, updateLike} = allTweetsSlice.actions; 
export default allTweetsSlice.reducer;