import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import methodImg from './assets/method.png'
import lawImg from './assets/law.png'

import './App.css'

const AMap = window.AMap

function Maker(props: any) {
  const { type } = props

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
  <div className={type === 'law' ? 'marker-container marker-container-law ' : 'marker-container marker-container-method'}
    onDoubleClick={() => {
      setIsEdit(true)
    }}
    onContextMenu={props.onRemove}
  >
     <div className='marker-title'>
       {isEdit ? <input placeholder={type === 'law' ? '请输入生态环保法律名称' : '请输入我国生态环保举措'} value={title} ref={inputRef} className='marker-input' onChange={e => setTitle(e.target.value)} onKeyUp={handleKeyUp} onBlur={() => setIsEdit(false)}></input> : title}
     </div>
      <img className='marker-img' src={type === 'law' ? lawImg : methodImg}></img>
    </div>
  )
}

function App() {
  const mapRef = useRef<any>()
  const idRef = useRef<number>(0)
  const markers = useRef<Record<number, any>>({})

  const addMarker = (position: any, type: 'method' | 'law') => {
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
    createRoot(el).render(<Maker onRemove={() => mapRef?.current.remove(marker)} id={idRef.current} type={type}></Maker>)
  }

  const handleDrop = (e: React.DragEvent) => {
    const data = e.dataTransfer.getData('text/plain')
    if (!mapRef.current)
      return
    const position = mapRef.current.containerToLngLat(new window.AMap.Pixel(e.pageX, e.pageY))
    addMarker(position, data as any)
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
      <img className="original-marker original-marker-law" src={lawImg} draggable onDragStart={e => e.dataTransfer.setData('text/plain', 'law')}></img>
      <img className="original-marker original-marker-method" src={methodImg} draggable onDragStart={e => e.dataTransfer.setData('text/plain', 'method')}></img>
    </main>
  )
}

export default App
