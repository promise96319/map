import { useEffect } from 'react'

import './App.css'

function App() {
  useEffect(() => {

  const map = new window.AMap.Map('map-container', {
    center: [116.397428, 39.90923],//中心点坐标
    viewMode:'3D'//使用3D视图
  });
  console.log('map', map);
    
  }, [])


  return (
    <main>
      <div id="map-container"></div>
    </main>
  )
}

export default App
