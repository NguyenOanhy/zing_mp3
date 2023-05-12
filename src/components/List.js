import moment from 'moment'
import React, {memo} from 'react'
import icons from '../ultis/icons'
import { useDispatch } from 'react-redux'
import * as actions from '../store/actions'

const {FiMusic} = icons

const List = ({songData, isHideAlbum, isHideNote, order}) => {

  const dispatch = useDispatch()

  return (
    <div 
    className='flex justify-between items-center p-[10px] border-t border-[rgba(0,0,0,0.05)] hover:bg-[#DDE4E4] cursor-pointer'
    onClick={() => {
        dispatch(actions.setCurSongId(songData?.encodeId))
        dispatch(actions.play(true))
        dispatch(actions.playAlbum(true))
        dispatch(actions.setRecent({thumbnail: songData?.thumbnail, title: songData?.title, sid: songData?.encodeId, artists: songData?.artistsNames}))
    }}
    >
        <div className='flex items-center gap-3 flex-1'>
            {order && <div 
            className={`${order === 1 
                ? 'text-shadow-no1' 
                : order === 2 
                    ? 'text-shadow-no2'
                    : order ===3 
                        ?'text-shadow-no3' 
                        : 'text-shadow-res'} text-main-300 text-[32px] flex items-center justify-center flex-none w-[10%]`}
            >
                {order}
            </div>}
            {!isHideNote && <span><FiMusic/></span>}
            <img src={songData?.thumbnail} alt="thumbnailM" className='w-10 h-10 object-cover rounded-md' />
            <span className='flex flex-col w-full'>
                <span className='text-sm font-semibold'>{songData?.title.length > 30 ? `${songData?.title.slice(0, 30)}...` : songData?.title}</span>
                <span className='text-xs opacity-70'>{songData?.artistsNames}</span>
            </span>
        </div>
        {!isHideAlbum && <div className='flex-1 flex justify-center text-xs'>
            {songData?.album?.title.length > 35 ? `${songData?.album?.title.slice(0, 35)}...` : songData?.album?.title}
        
        </div>}
        <div className='flex-1 flex justify-end text-xs opacity-70'>
            {moment.utc(songData?.duration*1000).format('mm:ss')}
        </div>
    </div>
  )
}

export default memo(List)