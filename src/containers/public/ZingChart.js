import React, {useEffect, useState, useRef} from 'react'
import { apiGetChartHome } from '../../apis'
import bgChart from '../../assets/bg-chart.jpg'
import { Line } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'
import { SongItem, RankList } from '../../components'
import _ from 'lodash'


const ZingChart = () => {
 
    const [chartData, setChartData] = useState(null)
    const [data, setData] = useState(null)
    const chartRef = useRef()
    const [tooltip, setTooltip] = useState({
        opacity: 0,
        top: 0,
        left: 0,
    })
    
   
    const [tooltipData, setTooltipData] = useState(null)
    const options = {
      responsive: true,
      pointRadius: 0,
      maintainAspectRatio: false,
      scales: {
          y: {
              ticks: { display: false },
              grid: { color: 'rgba(0,0,0,0.3)', drawTicks: false },
              min: chartData?.RTChart?.chart?.minScore,
              max: chartData?.RTChart?.chart?.maxScore,
              border: { dash: [3, 4] }
          },
          x: {
              ticks: { color: 'gray' },
              grid: { color: 'transparent' }
          }
      },
      plugins: {
          legend: false,
          tooltip: {
              enabled: false,
              external: (ctx) => {
                  const data = []
                  for (let i = 0; i < 3; i++)
                      data.push({
                          encodeId: Object.keys(chartData?.RTChart?.chart?.items)[i],
                          data: chartData?.RTChart?.chart?.items[Object.keys(chartData?.RTChart?.chart?.items)[i]]?.filter(item => +item.hour % 2 === 0)?.map(item => item.counter)
                      })
                  const tooltipModel = ctx.tooltip
                  setTooltipData(data.find(i => i.data.some(n => n === +tooltipModel.body[0].lines[0].replace(',', '')))?.encodeId)
                  if (tooltipModel.opacity === 0) {
                      if (tooltip.opacity !== 0) setTooltip(prev => ({ ...prev, opacity: 0 }))
                      return
                  }
                  const newTooltipData = {
                      opacity: 1,
                      left: tooltipModel.caretX,
                      top: tooltipModel.caretY,
                  }
                  if (!_.isEqual(tooltip, newTooltipData)) setTooltip(newTooltipData)
              }
          }
      },
      hover: {
          mode: 'dataset',
          intersect: false
      }
  }
    useEffect (() => {
      const fetchChartData = async () => {
          const response = await apiGetChartHome()
          if (response.data.err === 0) setChartData(response.data.data)
      }
      fetchChartData()
    }, [])

  useEffect(() => {
    const labels = chartData?.RTChart?.chart?.times?.filter(item => +item.hour % 2 === 0)?.map(item => `${item.hour}:00`)
    const datasets = []
    if (chartData?.RTChart?.chart?.items) {
        for (let i = 0; i < 3; i++) {
            datasets.push({
                data: chartData?.RTChart?.chart?.items[Object.keys(chartData?.RTChart?.chart?.items)[i]]?.filter(item => +item.hour % 2 === 0)?.map(item => item.counter),
                borderColor: i === 0 ? '#4a90e2' : i === 1 ? '#50e3c2' : '#e35050',
                tension: 0.2,
                borderWidth: 2,
                pointBackgroundColor: 'white',
                pointHoverRadius: 4,
                pointBorderColor: i === 0 ? '#4a90e2' : i === 1 ? '#50e3c2' : '#e35050',
                pointHoverBorderWidth: 4
            })
        }
        setData({ labels, datasets })
    }
  }, [chartData])
  // console.log(Object.entries(chartData?.weekChart))
  
  return (
    <div>
        <div className='flex flex-col'>
            <div className='relative'>
            <img src={bgChart} alt="bg-chart" className='w-full h-[500px] object-cover grayscale'/>
              <div className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(206,217,217,0.9)]'></div>
              <div className='absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-[#CED9D9] to-transparent'> </div>
              <div className='absolute top-0 left-0 right-0 bottom-1/2 gap-4 mt-8 px-[60px]'>
                 <h3 className='font-bold text-[40px] text-main-500'>#zingchart</h3>
              </div>
              <div className='flex-7 absolute top-1/3 right-0 left-0 bottom-0 px-[60px]'>
                        {data &&<Line ref={chartRef} data={data} options={options} />}
                        <div className='tooltip' style={{ top: tooltip.top, left: tooltip.left, position: 'absolute', opacity: tooltip.opacity }}>
                            <SongItem
                                thumbnail={chartData?.RTChart?.items?.find(i => i.encodeId === tooltipData)?.thumbnail}
                                title={chartData?.RTChart?.items?.find(i => i.encodeId === tooltipData)?.title}
                                artists={chartData?.RTChart?.items?.find(i => i.encodeId === tooltipData)?.artistsNames}
                                sid={chartData?.RTChart?.items?.find(i => i.encodeId === tooltipData)?.encodeId}
                                style='bg-white'
                            />
                        </div>
              </div>
            </div>
        </div>
      <div className='px-[60px] mt-12'>
          <RankList data={chartData?.RTChart?.items} number={10}/>
      </div>
      <div className='relative'>
        <img src={bgChart} alt="bg-chart" className='w-full h-[1000px] object-cover grayscale'/>
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(206,217,217,0.9)]'></div>
        <div className='absolute top-0 left-0 right-0 bottom-1/2 flex flex-col gap-8 mt-8 px-[60px]'>
          <h3 className='font-bold text-[40px] text-main-500'>Bảng Xếp Hạng Tuần</h3>
          <div className='flex gap-4 h-fit'>
              {chartData?.weekChart && Object.entries(chartData?.weekChart)?.map((item, index) => (
                <div className='flex-1 bg-gray-200 rounded-md px-[12px] py-5' key={index}>
                  <h3 className='text-[24px] text-main-500 font-bold'>{item[0] === 'vn' ? 'Việt Nam' : item[0] === 'us' ? 'US-UK' : item[0] === 'korea' ? 'K-Pop' : ''}</h3>
                  <div className='flex-1 mt-4 h-fit'>
                     <RankList 
                       data={item[1]?.items}
                       number={5}
                       isHideAlbum={true}
                       link={item[1]?.link}
                     />
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
      <div className='w-full h-[500px]'></div>
    </div>
  )
}

export default ZingChart