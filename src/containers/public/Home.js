import React, { useEffect} from 'react'
import { Slider, Section, NewRelease, ChartSection, Artist, Loading } from '../../components'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiFilter } from 'react-icons/fi'
const Home = () => {
    const { tamTrang, happyWeekend, top100, Chill, newMusic, weekChart, favoritedArtist} = useSelector(state => state.app)
    return (
        <>
        {(happyWeekend && top100 && Chill && newMusic && weekChart && favoritedArtist) ? <div className='overflow-y-auto w-full'> 
            <Slider />
            {tamTrang && <Section data={tamTrang} />}
            <Section data={happyWeekend} />
            <NewRelease />
            <Section data={top100} />
            <ChartSection />
            <div className='flex items-center px-[43px] w-full mt-12'>
                {weekChart?.map(item => (
                    <Link to={item?.link?.split('.')[0]} key={item.link} className='flex-1 px-4'>
                        <img src={item.cover} alt="cover" className=' w-full object-cover rounded-md' />
                    </Link>
                ))}
            </div>
            <Section data={Chill} />
            <Section data={newMusic} />
            <Section data={favoritedArtist} />
            <div className='w-full h-[100px]'></div>
        </div>
        : <div className='w-full h-full flex items-center justify-center '>
        <Loading />
        </div>}
        </>
    )
}

export default Home