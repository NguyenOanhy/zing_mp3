import { useState } from "react"
import { Home, Login, Public, Personal, Album, WeekRank, ZingChart, Search, SearchSong, SearchAll, Singer, SearchPlaylist } from './containers/public/'
import { ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {Routes, Route} from 'react-router-dom'
import path from "./ultis/path";
import { useEffect } from "react";
import * as actions from "./store/actions"
import { useDispatch } from "react-redux";
import { apiGetChartHome } from "./apis";

function App() {
  const dispatch = useDispatch()
  const [weekChart, setWeekChart] = useState(null)
  useEffect(() => {
    dispatch(actions.getHome())
    const fetchChartData = async () => {
      const response = await apiGetChartHome()
      if (response.data.err === 0) setWeekChart(response.data.data.weekChart)
  }
  fetchChartData()
  }, [])

  return (
    <>
    <div className="">
      <Routes>
        <Route path= {path.PUBLIC}  element={<Public/>}>
          <Route path={path.HOME} element={<Home/>} />
          <Route path={path.LOGIN} element={<Login/>} />
          <Route path={path.MY_MUSIC} element={<Personal/>} />
          <Route path={path.ALBUM__TILTLE__PID} element={<Album/>} />
          <Route path={path.PLAYLIST__TILTLE__PID} element={<Album/>} />
          <Route path={path.WEEKRANK__TITLE__PID} element={<WeekRank weekChart={weekChart && Object.values(weekChart)}/>} />
          <Route path={path.ZING_CHART} element={<ZingChart />} />
          <Route path={path.HOME__SINGER} element={<Singer />} />
          <Route path={path.SEARCH} element={<Search />} >
            <Route path={path.ALL} element={<SearchAll />} />
            <Route path={path.SONG} element={<SearchSong />}/>
            <Route path={path.PLAYLIST_SEARCH} element={<SearchPlaylist />}/>                     
          </Route>
          <Route path={path.STAR} element={<Home />} />
        </Route>
      </Routes>
    </div>
    <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    />
    </>
  );
}

export default App;
