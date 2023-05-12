import actionTypes from "../actions/actionTypes";

const initState = {
   banner: null,
   tamTrang: null,
   happyWeekend: null,
   top100: null,
   Chill: null,
   newMusic: null,
   isLoading: false,
   newRelease: null,
   weekChart: null,
   favoritedArtist: null,
   chart: null,
   rank: null,
  
}
const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_HOME:
            return {
                ...state, 
                banner: action.homeData?.find(item => item.sectionId === 'hSlider')?.items || null,
                tamTrang: action.homeData?.find(item => item.sectionId === 'hSeasonTheme') || null,
                happyWeekend: action.homeData?.find(item => item.sectionId === 'hEditorTheme2') || null,
                top100: action.homeData?.find(item => item.sectionId === 'h100') || null,
                Chill: action.homeData?.find(item => item.sectionId === 'hEditorTheme') || null,
                newMusic: { ...action.homeData?.find(item => item.sectionId === 'hAlbum'), title: 'Nhạc mới' } || null,
                newRelease: action.homeData?.find(item => item.sectionType === 'new-release') || null,
                weekChart: action.homeData?.find(item => item.sectionType === 'weekChart')?.items || null,
                favoritedArtist: action.homeData?.find(item => item.sectionId === 'hArtistTheme') || null,
                chart: action.homeData?.find(item => item.sectionId === 'hZC')?.chart || null,
                rank: action.homeData?.find(item => item.sectionId === 'hZC')?.items || null,
            } 

        case actionTypes.LOADING:
            return {
                ...state,
                isLoading: action.flag
            }
        default:
            return state
    }
}

export default appReducer