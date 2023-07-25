import React, {useCallback, useEffect, useState} from 'react'
import { useSelector , useDispatch} from 'react-redux'
import { getArrSlider } from '../utils/fn'
import * as actions from '../store/actions'
import { useNavigate } from 'react-router-dom'
import {Button} from './'
import icons from '../utils/icons'
const {MdArrowBackIosNew, MdArrowForwardIos} = icons

var interValId
const Slider = () => {
  const {banner} = useSelector(state => state.app)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const [step, setStep] = useState(1)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(2)
  const [isAuto, setisAuto] = useState(true)

  //animation for banner
  useEffect(() => {
    if (isAuto) {
      interValId = setInterval(() => {
        handleAnimationBanner(1) 
        }, 5000)
    }
    return () => {
      interValId && clearInterval(interValId)
    }
  }, [min, max, isAuto])
  const handleAnimationBanner = (step) => { 
    const sliderEls = document.getElementsByClassName('slider-item')
    const list = getArrSlider(min, max, sliderEls.length -1)
    for (let i = 0; i < sliderEls.length; i++) {
      // xoa classname (css)
        sliderEls[i]?.classList?.remove('animate-slide-right', 'order-last', 'z-20')
        sliderEls[i]?.classList?.remove('animate-slide-left', 'order-first', 'z-10')
        sliderEls[i]?.classList?.remove('animate-slide-left2', 'order-2', 'z-10')
      
      // Hide or show image
        if (list.some(item => item === i)) {
          sliderEls[i].style.cssText = `display: block`
        } else {
          sliderEls[i].style.cssText = `display: none`
        }
      }

    //Them animation
    list.forEach(item => {
      if (item === max) {
        sliderEls[item]?.classList?.add('animate-slide-right', 'order-last', 'z-20')
      } else if (item === min) {
        sliderEls[item]?.classList?.add('animate-slide-left', 'order-first', 'z-10')
      } else {
        sliderEls[item]?.classList?.add('animate-slide-left2', 'order-2', 'z-10')
      }
    })
    if (step === 1) {
      setMin(prev => prev === sliderEls.length - 1 ? 0 : prev + step)
      setMax(prev => prev === sliderEls.length - 1 ? 0 : prev + step)
    }
    if (step === -1) {
      setMin(prev => prev === 0 ? sliderEls.length - 1 : prev + step)
      setMax(prev => prev === 0 ? sliderEls.length - 1 : prev + step)
    }
   }

  const handleClickBanner = (item) => {
    //Xu ly su kien khi click vao bai hat
    if (item?.type === 1) {
        dispatch(actions.setCurSongId(item.encodeId))
        dispatch(actions.play(true))
        dispatch(actions.setPlaylist(null))
    } else if (item?.type === 4) {
       //console.log(item)
       const albumPath = item?.link?.split('.')[0]
       navigate(albumPath)
    } else {
      dispatch(actions.setPlaylist(null))
    }

  }
  const handleBack = useCallback((step) => {
      interValId && clearInterval(interValId)
      setisAuto(false)
      handleAnimationBanner(step)
  }, [min, max])
  return (
    <div className='relative w-full overflow-x-hidden px-[59px] cursor-pointer'>
      <Button 
        text= {<MdArrowBackIosNew size={30} />}
        style='absolute top-1/2 left-[70px] bg-[rgba(255,255,255,0.3)] z-50 text-white p-2 rounded-full'
        handleOnClick={() => handleBack(-1)}
      />
      <Button 
        text= {<MdArrowForwardIos size={30} />}
        style='absolute top-1/2 right-[70px] bg-[rgba(255,255,255,0.3)] z-50 text-white p-2 rounded-full'
        handleOnClick={() => handleBack(1)}
      />
      <div  
        className='flex w-full gap-6 pt-8'
        onMouseLeave={e => setisAuto(true)}
      >
      {banner?.map((item, index) => (
        <img 
          key= {item.encodeId}
          src={item.banner}
          onClick = {() => handleClickBanner(item)}
          className={`slider-item flex-1 object-contain w-[30%] rounded-lg ${index <= 2 ? 'block': 'hidden'}`}
        />
      ))}
      </div>
    </div>
  )
}

export default Slider