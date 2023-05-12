import React, { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionItem } from './'
const Section = ({ data, number }) => {

    return (
        <div className='mt-12 px-[44px] flex flex-col gap-1'>
            <div className='flex items-center justify-between'>
            <h3 className='text-[20px] font-bold pl-4'>{data?.title}</h3>
                <span className='text-xs'>TẤT CẢ</span>
            </div>
            <div className='flex items-start justify-between'>
                {data && data?.items?.length > 0 && data.items.filter((item, index) => index <= 4)?.map(item => (
                     <SectionItem
                        key={item.encodeId}
                        data={data}
                        title={item.title}
                        link={item.link}
                        sortDescription={item.sortDescription}
                        thumbnailM={item.thumbnailM}
                 />
                ))}
            </div>
        </div>
    )
}

export default memo(Section)