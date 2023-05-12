import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Player, SidebarLeft, SidebarRight, Header, Loading } from '../../components'
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useSelector } from 'react-redux';
const Public = () => {
    const [isShowRightSidebar, setIsShowRightSidebar] = useState(true)
    const { isLoading } = useSelector(state => state.app)
    const {curSongId} = useSelector(state => state.music)
    return (
        <div className='w-full relative h-screen flex flex-col bg-main-300 '>
            <div className='w-full h-full flex flex-auto'>
                <div className='w-[240px] flex-none'>
                    <SidebarLeft />
                </div>
                <div className='flex-auto relative flex flex-col'>
                    {isLoading && <div className='absolute top-0 bottom-0 z-20 left-0 right-0 bg-main-200 flex items-center justify-center'>
                        <Loading />
                    </div>}
                    <div className='h-[70px] flex-none px-[59px] flex items-center'>
                        <Header />
                    </div>
                    <div className='flex-auto w-full'>
                        <Scrollbars autoHide style={{ width: '100%', height: '100%' }}>
                            <Outlet />
                            <div className='h-[120px] w-full'></div>
                        </Scrollbars>
                    </div>
                </div>
                {isShowRightSidebar && <div className='w-[329px] hidden 1200:flex h-screen flex-none animate-slide-left'>
                    <SidebarRight />
                </div>}
            </div>
            
            {curSongId && <div className='fixed z-50 bottom-0 left-0 right-0 h-[90px]'>
                <Player setIsShowRightSidebar={setIsShowRightSidebar} />
            </div>}
        </div>
    )
}

export default Public