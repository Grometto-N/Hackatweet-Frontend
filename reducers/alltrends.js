import { createSlice } from "@reduxjs/toolkit"; /*L'import obligatoire*/

const initialState = {
  value: [ ],
};

export const allTrendsSlice = createSlice({
  name: "allTrends",

  initialState,
  reducers: {
    addTrends: (state, action) => {
      state.value.push(action.payload);
    },
    updateTrend: (state, action) => {
       // on vérifie si le trend est dans le tableau
    if(state.value.find(elt=> elt.title === action.payload)){
      state.value =  state.value.map(elt => {
        if(elt.title === action.payload){
          const theOccurence = elt.occurence + 1;
          return {title : elt.title, occurence : theOccurence}
        }else{
          return elt;
        }
      })
    }else{
      state.value.push({title : action.payload, occurence : 1})
    }
    },
    removeTrends: (state, action) => {
      state.value=[];
    },
  },
});

export const { addTrends, updateTrend, removeTrends } = allTrendsSlice.actions; 
export default allTrendsSlice.reducer;