import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import markerImg from './assets/marker.jpg'

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
      center: [116.397428, 39.90923], // 中心点坐标
    })
    mapRef.current = map
  }, [])

  const handleSwitchMap = () => {
    const newStyle = style === 'green' ? 'normal' : 'green'
    const mapStyle = newStyle === 'green' ? 'amap://styles/7df9dff560cc1804ccdbc8295259615f' : ''
    setStyle(newStyle)
    mapRef.current.setMapStyle(mapStyle)
  }

  return (
    <main >
      <div id="map-container" onDragOver={e => e.preventDefault() } onDrop={handleDrop}></div>
      <img className="original-marker" src={markerImg} draggable></img>
      <button className='switch-map' onClick={handleSwitchMap}>切换</button>
    </main>
  )
}

export default App
