import icons from "./icons"

const { MdOutlineLibraryMusic, MdOutlineFeed, TbChartDonut3, BiLineChart } =icons
export const sidebarMenu = [
    {
        path: 'mymusic',
        text: 'Cá nhân',
        icons: <MdOutlineLibraryMusic size={24}/>
    },
    {
        path: '',
        text: 'Khám phá',
        end: true,
        icons: <TbChartDonut3 size={24} />
    },
    {
        path: 'zing-chart',
        text: '#zingchart',
        icons: <BiLineChart size={24} />
    },
    {
        path: 'follow',
        text: 'Theo dõi',
        icons: <MdOutlineFeed size={24} />
    },

]


export const searchMenu = [
    {
        path: 'tat-ca',
        text: 'TẤT CẢ',
    },
    {
        path: 'bai-hat',
        text: 'BÀI HÁT',
    },
    {
        path: 'playlist',
        text: 'PLAYLIST/ALBUM',
    },

]