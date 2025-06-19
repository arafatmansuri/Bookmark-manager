import React from 'react'
interface TotalCardProps{
    text:string;
    totalCount:number;
    icon: React.ReactElement;
    classes?: string
}
export function TotalCard({text,totalCount,icon,classes}:TotalCardProps) {
  return (
    <div className='w-64 flex items-center gap-4 dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 border-gray-200 shadow-sm'>
        <div className={`${classes} p-2 h-10 rounded-lg`}>{icon}</div>
        <div>
            <h1 className='font-medium dark:text-gray-400 text-gray-600 text-sm'>{text}</h1>
            <h1 className='text-2xl font-semibold dark:text-white text-gray-900'>{totalCount}</h1>
        </div>
    </div>
  )
}
