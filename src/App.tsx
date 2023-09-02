import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import markerImg from './assets/marker.png'

import './App.css'

const AMap = window.AMap

function Maker(props: any) {
  const [title, setTitle] = useState('')
  const inputRef = useRef<any>()
  const [isEdit, setIsEdit] = useState(true)

  useEffect(() => {
    if (isEdit)
      inputRef.current?.focus()
  }, [isEdit, inputRef])

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')
      setIsEdit(false)
  }

  return (
  <div className="marker-container"
    onDoubleClick={() => {
      setIsEdit(true)
    }}
    onContextMenu={props.onRemove}
  >
     <div className='marker-title'>
       {isEdit ? <input placeholder='请输入生态标识名称' value={title} ref={inputRef} className='marker-input' onChange={e => setTitle(e.target.value)} onKeyUp={handleKeyUp} onBlur={() => setIsEdit(false)}></input> : title}
     </div>
      <img className='marker-img' src={markerImg}></img>
    </div>
  )
}

function App() {
  const mapRef = useRef<any>()
  const idRef = useRef<number>(0)
  const markers = useRef<Record<number, any>>({})
  const [style, setStyle] = useState('normal')

  const addMarker = (position: any) => {
    idRef.current += 1
    const marker = new window.AMap.Marker({
      position,
      content: '',
      draggable: true,
    })

    mapRef.current?.add(marker)
    markers.current[idRef.current] = marker

    const el = document.createElement('div')
    marker.setContent(el)
    createRoot(el).render(<Maker onRemove={() => mapRef?.current.remove(marker)} id={idRef.current}></Maker>)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!mapRef.current)
      return
    const position = mapRef.current.containerToLngLat(new window.AMap.Pixel(e.pageX, e.pageY))
    console.log('position', position)
    addMarker(position)
  }

  useEffect(() => {
    const map = new window.AMap.Map('map-container', {
      zoom: 4, // 设置地图缩放级别
      center: [104.065735, 35.738621],
    })
    // 设置地图的边界限制，只显示中国地图范围
    const southWest = new AMap.LngLat(73.41877, 3.861642) // 中国范围的西南角坐标
    const northEast = new AMap.LngLat(135.085769, 53.558204) // 中国范围的东北角坐标
    const bounds = new AMap.Bounds(southWest, northEast)
    map.setBounds(bounds)
    mapRef.current = map
  }, [])

  return (
    <main >
      <div id="map-container" onDragOver={e => e.preventDefault() } onDrop={handleDrop}></div>
      <img className="original-marker" src={markerImg} draggable></img>
    </main>
  )
}

export default App
