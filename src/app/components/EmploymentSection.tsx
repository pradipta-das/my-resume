import * as React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useState, useRef } from 'react';



export function EmpolymentBlock({data}){
    return(
        <div className='flex flex-row flex-wrap p-20 employmentBlock' onMouseEnter={()=>{ console.log('works');}}>
            <h2 className='flex w-full text-2xl font-bold'>{data.employee.title}</h2>
            <p className='w-full text-[.8rem]'>{data.employee.duration}</p>
            <div className='w-full'>  
                {data.employee.desc}   
            </div>
            <span className='w-full'>{data.employee.stack}</span>
       </div>
        )   
};


export default function EmploymentSection(){

    const employeeData = [{
        id:0,
        title:'Flash Developer',
        company:'Webguru',
        duration:'November 2009 - December 2010',
        stack:'Flash, HTML, CSS, JS, AS 2.0',
        desc:'Description about job and achievements'
    },{
        id:1,
        title:'Indusnet',
        company:'Webguru',
        duration:'2',
        stack:'Flash, HTML, CSS, JS, AS 2.0',
        desc:'Description about job and achievements'
    },{
        id:2,
        title:'Arena Multimedia',
        company:'Webguru',
        duration:'2',
        stack:'Flash, HTML, CSS, JS, AS 2.0',
        desc:'Description about job and achievements'
    },{
        id:3,
        title:'Maxmobility',
        company:'Webguru',
        duration:'2',
        stack:'Flash, HTML, CSS, JS, AS 2.0',
        desc:'Description about job and achievements'
    }]

    const employeeList = employeeData.sort((a,b) => (b.id > a.id) ? 1: -1 ).map(employee => 

        <li className="flex w-full  lg:w-2/3 border-r-2 not-last-of-type:border-b-2 " key={employee.id}>
            <EmpolymentBlock data={{employee}} />
        </li>
       
    )
   
 
    return(
        <section className='flex w-svw bg-amber-200' > 
       
            <ul className='w-full list-none employeeList'>
                {employeeList}
            </ul>
        </section>
    );

}