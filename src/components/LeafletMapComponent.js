import React, { useEffect, useRef } from 'react';
import './MapComponent.css';
import { powerGridData } from '../data/powerGridData';

const LeafletMapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // 如果Leaflet未加载，创建一个简单的提示
    if (!window.L) {
      mapRef.current.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666; font-size: 16px;">
          <div style="text-align: center;">
            <p>🗺️ 地图组件</p>
            <p>请运行以下命令安装Leaflet依赖：</p>
            <code style="background: #fff; padding: 10px; border-radius: 4px; display: inline-block;">npm install leaflet react-leaflet</code>
            <p style="margin-top: 20px;">或者使用高德地图版本（需要API Key）</p>
          </div>
        </div>
      `;
      return;
    }

    // 初始化Leaflet地图
    mapInstance.current = window.L.map(mapRef.current, {
      center: [39.90923, 116.397428],
      zoom: 10,
      zoomControl: true
    });

    // 添加OpenStreetMap瓦片图层
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // 添加电力电网数据点
    addPowerGridMarkers();

    // 清理函数
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  const addPowerGridMarkers = () => {
    powerGridData.forEach(item => {
      const icon = createCustomIcon(item.type);
      
      const marker = window.L.marker([item.latitude, item.longitude], {
        icon: icon
      }).addTo(mapInstance.current);

      // 添加弹出信息
      const popupContent = `
        <div class="info-window">
          <h3>${item.name}</h3>
          <p><strong>类型:</strong> ${item.type}</p>
          <p><strong>容量:</strong> ${item.capacity}</p>
          <p><strong>状态:</strong> <span class="status ${item.status}">${item.status}</span></p>
          <p><strong>负荷:</strong> ${item.load}</p>
          <p><strong>位置:</strong> ${item.address}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
  };

  const createCustomIcon = (type) => {
    const iconConfig = {
      '发电厂': { color: '#ff6600', symbol: '⚡' },
      '变电站': { color: '#0066ff', symbol: '🔌' },
      '输电线路': { color: '#ff3300', symbol: '🔗' }
    };

    const config = iconConfig[type] || iconConfig['发电厂'];
    
    return window.L.divIcon({
      html: `
        <div style="
          background-color: ${config.color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${config.symbol}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
      className: 'custom-marker'
    });
  };

  return (
    <div className="map-container">
      <div className="map-controls">
        <div className="legend">
          <h4>图例</h4>
          <div className="legend-item">
            <div className="legend-icon power-plant"></div>
            <span>发电厂</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon substation"></div>
            <span>变电站</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon transmission"></div>
            <span>输电线路</span>
          </div>
        </div>
      </div>
      <div ref={mapRef} className="map"></div>
    </div>
  );
};

export default LeafletMapComponent; 