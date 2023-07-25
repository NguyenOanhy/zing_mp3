import React, {useEffect, useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as apis from '../apis'
import icons from '../utils/icons'
import * as actions from '../store/actions'
import moment from 'moment'
import { toast } from 'react-toastify'
import { AiFillDownCircle } from 'react-icons/ai'
import { LoadingSong } from './'

var intervalId 
const {AiFillHeart, AiOutlineHeart, HiOutlineDotsHorizontal, CiRepeat, AiFillStepForward, AiFillStepBackward, CiShuffle, BsPlayFill, BsPauseFill, TbRepeatOnce,  BsMusicNoteList, SlVolume1, SlVolumeOff, SlVolume2} = icons
const Player = ({ setIsShowRightSidebar }) => {

  const {curSongId, isPlaying,songs} = useSelector(state => state.music)
  const [songInfo, setSongInfo] = useState(null)
  const [audio, setAudio] = useState(new Audio())
  const [curSeconds, setcurSeconds] = useState(0)
  const [isShuffe, setIsShuffe] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0)
  const [isLoadedSource, setIsLoadedSource] = useState(true)
  const [volume, setVolume] = useState(100)
  const [isHoverVolume, setIsHoverVolume] = useState(false)
  const dispatch = useDispatch()
  const thumbRef = useRef()
  const trackRef = useRef()
  const volumeRef = useRef()

  useEffect(() => {
    const fetchDetailSong = async () => {
        setIsLoadedSource(false)
        const [res1, res2] = await Promise.all([
            apis.apiGetDetailSong(curSongId),
            apis.apiGetSong(curSongId)
        ])
        setIsLoadedSource(true)
        if (res1.data.err === 0) {
            setSongInfo(res1.data.data)
            dispatch(actions.setCurSongData(res1.data.data))
        }
        if (res2.data.err === 0) {
            audio.pause()
            setAudio(new Audio(res2.data.data['128']))
        } else {
            audio.pause()
            setAudio(new Audio())
            dispatch(actions.play(false))
            toast.warn(res2.data.msg)   
            setcurSeconds(0)   
            thumbRef.current.style.cssText = `right: 100%`   
        }
    }

    fetchDetailSong()
  }, [curSongId])

  useEffect(() => {
    intervalId && clearInterval(intervalId)
    audio.pause()
    audio.load()
    if (isPlaying && thumbRef.current) {
      audio.play()
      intervalId = setInterval(()=> {
        let percent = Math.round(audio.currentTime *10000 / songInfo?.duration) / 100
        thumbRef.current.style.cssText = `right: ${100 - percent}%`
        setcurSeconds(Math.round(audio.currentTime))
      }, 200)
    } 
  }, [audio])

  useEffect(() => {
    const handleEnded = () => {
        console.log(isShuffe)
        if (isShuffe) {
            handleShuffle()
        } else if (repeatMode) {
          repeatMode === 1 ? handleRepeatOne() : handleNextSong()
        } else {
            audio.pause()
            dispatch(actions.play(false))
        }
    }
    audio.addEventListener('ended', handleEnded)
    return () => {
        audio.removeEventListener('ended', handleEnded)
    }
  }, [audio, isShuffe, repeatMode])

  useEffect(() => {
    audio.volume = volume / 100
  }, [volume])

  useEffect(() => {
     if (volumeRef.current) {
        volumeRef.current.style.cssText = `right: ${100 - volume}%`
     }
  },[volume])

const handleTogglePlayMusic = () => {
  if (isPlaying) {
    audio.pause()
    dispatch(actions.play(false))
  } else {
    audio.play()
    dispatch(actions.play(true))
  }
}

const handleClickProgressBar = (e) => {
  const trackRect = trackRef.current.getBoundingClientRect()
  const percent = Math.round((e.clientX - trackRect.left) *10000 / trackRect.width) / 100
  thumbRef.current.style.cssText = `right: ${100 - percent}%`
  audio.currentTime = percent * songInfo?.duration / 100
  setcurSeconds(Math.round(percent * songInfo?.duration / 100))
}

const handleNextSong = () => { 
    if (songs) {
      
     let currentSongIndex 
     songs?.forEach((item, index) => {
      if (item.encodeId === curSongId) currentSongIndex = index
     })
     dispatch(actions.setCurSongId(songs[currentSongIndex + 1].encodeId))
     dispatch(actions.play(true))
    }
}

const handlePrevSong = () => { 
  if (songs) {
    
   let currentSongIndex 
   songs?.forEach((item, index) => {
    if (item.encodeId === curSongId) currentSongIndex = index
   })
   dispatch(actions.setCurSongId(songs[currentSongIndex - 1].encodeId))
   dispatch(actions.play(true))
  }
}

const handleRepeatOne = () => {
  audio.play()
}

const handleShuffle = () => {
  const randomIndex = Math.round(Math.random() * songs?.length) - 1
  dispatch(actions.setCurSongId(songs[randomIndex].encodeId))
  dispatch(actions.play(true))
  setIsShuffe(prev => !prev)
}
  return (
    <div className ='bg-main-400 px-5 h-full flex'>
        <div className='w-[30%] flex-auto flex gap-3 items-center'>
            <img src={songInfo?.thumbnail} alt="thumbnail" className='w-16 h-16 object-cover rounded-md' />
            <div className='flex flex-col'>
              <span className='font-semibold text-gray-700 text-sm'>{songInfo?.title}</span>
              <span className='text-xs text-gray-500'>{songInfo?.artistsNames}</span>
            </div>

            <div className='flex gap-4 pl-2'>
              <span>
                <AiOutlineHeart size={16} />
              </span>
              <span>
                <HiOutlineDotsHorizontal size={16}/>
              </span>
            </div>
        </div>
        <div className='w-[40%] flex-auto flex items-center justify-center gap-4 flex-col py-2'>
            <div className='flex gap-8 justify-center items-center'>
                <span 
                className={`cursor-pointer ${isShuffe ? 'text-purple-600' : 'text-black'}`} title='Bật phát ngẫu nhiên'
                onClick={() => setIsShuffe(prev => !prev)}
                ><CiShuffle size={24}/></span>
                <span onClick={handlePrevSong} className ={`${!songs ? 'text-gray-500' : 'cursor-pointer'}`} ><AiFillStepBackward size={24}/></span>
                <span 
                className='p-1 border border-gray-700 cursor-pointer hover:text-main-500 rounded-full'
                onClick={handleTogglePlayMusic}
                >
                  {!isLoadedSource ? <LoadingSong /> :isPlaying ? <BsPauseFill size={30}/>: <BsPlayFill size={30}/>}
                </span>
                <span onClick={handleNextSong} className ={`${!songs ? 'text-gray-500' : 'cursor-pointer'}`}><AiFillStepForward size={24}/></span>
                <span 
                className={`cursor-pointer ${repeatMode && 'text-purple-600'}`}
                title='Bật phát lại tất cả'
                onClick={() => setRepeatMode(prev => prev === 2 ? 0 : prev + 1)}
                >
                  {repeatMode === 1 ? <TbRepeatOnce size={24} /> : <CiRepeat size={24} />}
                </span>
            </div>
            <div className='w-full flex items-center justify-center gap-3 text-xs'>
              <span className=''>{moment.utc(curSeconds*1000).format('mm:ss')}</span>
              <div 
              className='w-3/5 h-[3px] hover:h-[8px] rounded-l-full rounded-r-full cursor-pointer relative bg-[rgba(0,0,0,0.1)]'
              onClick={handleClickProgressBar}
              ref={trackRef}
              >
                <div ref={thumbRef} className='absolute top-0 left-0 bottom-0 rounded-l-full rounded-r-full bg-[#0e8080]'></div>
              </div>
              <span>{moment.utc(songInfo?.duration*1000).format('mm:ss')}</span>
            </div>
        </div>
        <div className='w-[30%] flex-auto flex items-center justify-end gap-4'>

                <div 
                  onMouseEnter={() => setIsHoverVolume(true)}
                  onMouseLeave={() => setIsHoverVolume(false)}
                  className='flex gap-2 items-center'>
                    <span onClick={() => setVolume(prev => +prev === 0 ? 70 : 0)}>{+volume >= 50 ? <SlVolume2 /> : +volume === 0 ? <SlVolumeOff /> : <SlVolume1 />}</span>
                    <div className={`w-[130px] h-1 bg-white rounded-l-full rounded-r-full ${isHoverVolume ? 'hidden' : 'relative'}`}>
                      <div ref={volumeRef} className='absolute left-0 bottom-0 top-0 bg-main-500 rounded-l-full rounded-r-full'>
                      </div>
                    </div> 
                    <input
                        type="range"
                        step={1}
                        min={0}
                        max={100}
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className={`w-[130px] ${isHoverVolume ? 'inline' : 'hidden'}`}
                    />
                </div>
                <span onClick={() => setIsShowRightSidebar(prev => !prev)} className='p-1 rounded-sm cursor-pointer bg-main-500 opacity-90 hover:opacity-100'><BsMusicNoteList size={20} /></span>
            </div>
    </div>
  )
}

export default Player