import { createSlice } from "@reduxjs/toolkit";

const load = (key) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

const initialState = {
  allNews: load("allNews"),
  category: load("category"),
  isMenuOpen: false,
  ads: load("ads"),
  yt: load("yt")
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    saveNews: (state, action) => {
      state.allNews = action.payload;
      localStorage.setItem("allNews", JSON.stringify(state.allNews));
    },
    saveCategory: (state, action) => {
      state.category = action.payload;
      localStorage.setItem("category", JSON.stringify(state.category));
    },
    setAds: (state, action) => {
      state.ads = action.payload;
      localStorage.setItem('ads', JSON.stringify(state.ads));
    },
    createAds: (state, action) => {
      state.ads.push(action.payload);
      localStorage.setItem('ads', JSON.stringify(state.ads));
    },
    removeAd: (state, action) => {
      state.ads = state.ads.filter(ad => ad._id !== action.payload);
      localStorage.setItem("ads", JSON.stringify(state.ads));
    },
    setYT: (state, action) => {
      state.yt = action.payload;
      localStorage.setItem('yt', JSON.stringify(state.yt));
    },
    createYT: (state, action) => {
      console.log(action.payload)
      state.yt.push(action.payload);
      localStorage.setItem('yt', JSON.stringify(state.yt));
    },
    removeYT: (state, action) => {
      state.yt = state.yt.filter(ad => ad._id !== action.payload);
      localStorage.setItem("yt", JSON.stringify(state.yt));
    },
    handleIsMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload !== undefined ? action.payload : !state.isMenuOpen;
    },
  },
});

export const { saveNews, saveCategory, handleIsMenuOpen, setAds, createAds, removeAd, setYT, createYT, removeYT } = newsSlice.actions;

export default newsSlice.reducer;
