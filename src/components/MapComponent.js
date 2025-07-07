import React, { useEffect, useRef, useState } from 'react';
import './MapComponent.css';
import { powerGridData, userGridData, areaLossData, abnormalMeters } from '../data/powerGridData';

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [showValidationPanel, setShowValidationPanel] = useState(false);
  const [showAbnormalList, setShowAbnormalList] = useState(false);
  const [showLossAnalysis, setShowLossAnalysis] = useState(false);
  const [lossChartType, setLossChartType] = useState('bar'); // 'bar' 或 'line'
  const [validationResults, setValidationResults] = useState([]);
  const [showLoadMonitor, setShowLoadMonitor] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showMeterBoxes, setShowMeterBoxes] = useState(false);
  const [, setCurrentZoom] = useState(10);
  const [autoMeterBoxMode, setAutoMeterBoxMode] = useState(false);
  const [autoValidationMode, setAutoValidationMode] = useState(false);
  const meterBoxPopups = useRef([]);
  const validationPopups = useRef([]);

  useEffect(() => {
    // 延迟检查，确保高德地图API有时间加载
    const timer = setTimeout(() => {
      if (!window.AMap) {
        console.warn('高德地图API未加载，启用演示模式');
        showFallbackMap();
        return;
      }

      try {
        // 初始化地图
        mapInstance.current = new window.AMap.Map(mapRef.current, {
          zoom: 10,
          center: [116.397428, 39.90923], // 北京中心点
          mapStyle: 'amap://styles/blue', // 蓝色主题
          viewMode: '2D',
          lang: 'zh_cn'
        });

        // 地图加载完成后添加电力电网数据点
        mapInstance.current.on('complete', () => {
          addPowerGridMarkers();
        });

        // 存储缩放处理函数的引用
        const zoomHandler = () => {
          const zoom = mapInstance.current.getZoom();
          setCurrentZoom(zoom);
        };

        // 监听地图缩放变化
        mapInstance.current.on('zoomchange', zoomHandler);

      } catch (error) {
        console.error('地图初始化失败:', error);
        showFallbackMap();
      }
    }, 1000);

    // 清理函数
    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        try {
          mapInstance.current.destroy();
        } catch (error) {
          console.warn('地图销毁时出错:', error);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 自动功能（表箱和校验错误）
  useEffect(() => {
    if (!mapInstance.current) return;

    const handleZoomChange = () => {
      const zoom = mapInstance.current.getZoom();

      // 自动表箱功能 (缩放级别 >= 14)
      if (autoMeterBoxMode) {
        if (zoom >= 14) {
          openAllMeterBoxPopups();
        } else {
          closeAllMeterBoxPopups();
        }
      }

      // 自动校验错误功能 (缩放级别 >= 12)
      if (autoValidationMode) {
        if (zoom >= 12) {
          openAllValidationErrorPopups();
        } else {
          closeAllValidationErrorPopups();
        }
      }
    };

    // 监听缩放变化
    mapInstance.current.on('zoomchange', handleZoomChange);

    // 立即检查当前状态
    if (autoMeterBoxMode || autoValidationMode) {
      handleZoomChange();
    } else {
      closeAllMeterBoxPopups();
      closeAllValidationErrorPopups();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.off('zoomchange', handleZoomChange);
      }
    };
  }, [autoMeterBoxMode, autoValidationMode]);

  // 添加全局函数到window对象，供信息窗口调用
  useEffect(() => {
    // 表箱布局现在默认显示，不需要切换函数

    window.fixValidationError = (deviceId) => {
      alert(`正在修复设备 ${deviceId} 的校验错误...`);
      // 这里可以实现实际的修复逻辑
    };

    return () => {
      delete window.showMeterLayout;
      delete window.fixValidationError;
    };
  }, []);

  const showFallbackMap = () => {
    // 显示模拟地图界面
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          text-align: center;
        ">
          <div>
            <h3 style="margin-bottom: 20px;">📍 电力电网地图演示模式</h3>
            <p style="margin-bottom: 10px;">高德地图API未配置</p>
            <p style="margin-bottom: 20px; font-size: 14px; opacity: 0.8;">
              请申请高德地图API Key并在 public/index.html 中配置
            </p>
            <p style="font-size: 14px; opacity: 0.8;">
              或查看 demo.html 文件获得完整演示效果
            </p>
          </div>
        </div>
      `;
      // 添加模拟的电力设施标记
      addFallbackMarkers();
    }
  };

  const addFallbackMarkers = () => {
    // 设施点位
    const facilities = [
      { name: '北京第一热电厂', type: '发电厂', x: 20, y: 15, status: '正常' },
      { name: '朝阳变电站', type: '变电站', x: 40, y: 25, status: '正常' },
      { name: '海淀变电站', type: '变电站', x: 15, y: 35, status: '维护' },
      { name: '大兴燃气电厂', type: '发电厂', x: 25, y: 65, status: '正常' },
      { name: '丰台变电站', type: '变电站', x: 35, y: 55, status: '正常' }
    ];

    // 输电线路（连接各个设施）
    const transmissionLines = [
      { name: '东城输电线路1', start: { x: 20, y: 15 }, end: { x: 40, y: 25 }, status: '正常' },
      { name: '西城输电线路2', start: { x: 15, y: 35 }, end: { x: 35, y: 55 }, status: '故障' },
      { name: '房山输电线路3', start: { x: 25, y: 65 }, end: { x: 35, y: 55 }, status: '正常' }
    ];

    // 绘制设施点位
    facilities.forEach(facility => {
      const markerEl = document.createElement('div');
      const colors = { '发电厂': '#ff6600', '变电站': '#0066ff' };
      const icons = { '发电厂': '⚡', '变电站': '🔌' };
      
      markerEl.style.cssText = `
        position: absolute;
        left: ${facility.x}%;
        top: ${facility.y}%;
        width: 30px;
        height: 30px;
        background: ${colors[facility.type]};
        border-radius: 50%;
        border: 2px solid white;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
        z-index: 10;
      `;
      markerEl.innerHTML = icons[facility.type];
      markerEl.title = `${facility.name} - ${facility.status}`;
      
      mapRef.current.appendChild(markerEl);
    });

    // 绘制输电线路
    transmissionLines.forEach(line => {
      const lineEl = document.createElement('div');
      const dx = line.end.x - line.start.x;
      const dy = line.end.y - line.start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      const lineColor = line.status === '故障' ? '#ff0000' : '#00ff00';
      const lineStyle = line.status === '故障' ? 'dashed' : 'solid';
      
      lineEl.style.cssText = `
        position: absolute;
        left: ${line.start.x}%;
        top: ${line.start.y}%;
        width: ${length}%;
        height: 4px;
        background: ${lineColor};
        border-radius: 2px;
        transform-origin: 0 50%;
        transform: rotate(${angle}deg);
        cursor: pointer;
        z-index: 5;
        ${lineStyle === 'dashed' ? 'border: 2px dashed ' + lineColor + '; background: transparent;' : ''}
      `;
      
      lineEl.title = `${line.name} - ${line.status}`;
      
      mapRef.current.appendChild(lineEl);

      // 在线路中点添加标识
      const midX = (line.start.x + line.end.x) / 2;
      const midY = (line.start.y + line.end.y) / 2;
      
      const lineLabelEl = document.createElement('div');
      lineLabelEl.style.cssText = `
        position: absolute;
        left: ${midX}%;
        top: ${midY}%;
        width: 20px;
        height: 20px;
        background: #ff3300;
        border-radius: 50%;
        border: 2px solid white;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        z-index: 15;
      `;
      lineLabelEl.innerHTML = '🔗';
      lineLabelEl.title = `${line.name} - ${line.status}`;
      
      mapRef.current.appendChild(lineLabelEl);
    });
  };





  // 创建真正的InfoWindow - 和手动点击完全一样
  const createRealInfoWindow = (data, position) => {
    const voltage = data.voltageData || {};

    // 使用真正的InfoWindow，和手动点击完全相同
    const infoWindow = new window.AMap.InfoWindow({
      content: `
        <div class="info-window meter-box-window">
          <h3>${data.name}</h3>
          <p><strong>类型:</strong> ${data.type}</p>
          <p><strong>电压:</strong> ${voltage.current || 'N/A'}V (${voltage.status || 'N/A'})</p>
          <p><strong>位置:</strong> ${data.address}</p>
          <div class="meter-layout-container">
            <h4>表箱内部布局</h4>
            ${generateMeterLayoutHtml(data.meterLayout)}
          </div>
        </div>
      `,
      offset: new window.AMap.Pixel(0, -30),
      closeWhenClickMap: false, // 点击地图时不关闭
      autoMove: false // 不自动移动
    });

    // 打开InfoWindow
    infoWindow.open(mapInstance.current, position);

    return infoWindow;
  };

  // 新的自动表箱功能 - 使用真正的InfoWindow同时显示多个
  const openAllMeterBoxPopups = () => {
    if (!mapInstance.current || !window.AMap) return;

    // 先关闭所有现有显示
    closeAllMeterBoxPopups();

    // 获取所有表箱数据
    const meterBoxes = [
      ...powerGridData.filter(item => item.type === '表箱'),
      ...userGridData.filter(item => item.type === '表箱')
    ];

    console.log('=== 自动表箱功能调试 ===');
    console.log('找到的表箱数据:', meterBoxes.map(box => ({ id: box.id, name: box.name })));

    // 获取地图上所有标记
    const markers = mapInstance.current.getAllOverlays('marker');
    console.log('地图上的标记总数:', markers.length);

    let successCount = 0;

    meterBoxes.forEach((box, index) => {
      console.log(`查找表箱: ${box.name} (ID: ${box.id})`);

      // 找到对应的标记
      const marker = markers.find(m => {
        const data = m.getExtData();
        return data && data.id === box.id;
      });

      if (marker) {
        console.log(`✓ 找到标记: ${box.name}`);
        const data = marker.getExtData();

        // 延迟创建，避免同时创建导致覆盖
        setTimeout(() => {
          // 创建真正的InfoWindow
          const infoWindow = createRealInfoWindow(data, marker.getPosition());
          meterBoxPopups.current.push(infoWindow);
          console.log(`✓ 真正的InfoWindow已创建: ${box.name}`);
        }, index * 100); // 每个延迟100ms

        successCount++;
      } else {
        console.log(`✗ 未找到标记: ${box.name} (ID: ${box.id})`);
      }
    });

    console.log(`总共准备创建 ${successCount} 个真正的InfoWindow`);
    console.log('=== 调试结束 ===');
  };

  // 新的自动表箱功能 - 关闭所有表箱InfoWindow
  const closeAllMeterBoxPopups = () => {
    meterBoxPopups.current.forEach(infoWindow => {
      try {
        infoWindow.close(); // 关闭真正的InfoWindow
      } catch (e) {
        // 忽略关闭错误
      }
    });
    meterBoxPopups.current = [];
    console.log('所有表箱自定义InfoWindow已关闭');
  };

  const addPowerGridMarkers = () => {
    // 添加电力设备
    powerGridData.forEach(item => {
      if (item.type === '输电线路') {
        // 绘制输电线路
        addTransmissionLine(item);
      } else {
        // 绘制点标记（发电厂、变电站）
        addPointMarker(item);
      }
    });

    // 添加用户设备（表箱）
    userGridData.forEach(item => {
      addUserMarker(item);
    });

    // 添加所有异常设备的可视化标识
    addAbnormalDeviceMarkers();
  };

  // 添加异常设备可视化标记（适合打印）
  const addAbnormalDeviceMarkers = () => {
    // 收集所有异常设备
    const allAbnormalDevices = [];

    // 收集电力设备异常
    powerGridData.forEach(device => {
      if (device.validationErrors && device.validationErrors.length > 0) {
        allAbnormalDevices.push({
          id: device.id,
          name: device.name,
          type: device.type,
          location: { lng: device.longitude, lat: device.latitude },
          errors: device.validationErrors
        });
      }
    });

    // 收集所有表箱异常（从两个数据源）
    const allMeterBoxes = [
      ...powerGridData.filter(item => item.type === '表箱'),
      ...userGridData.filter(item => item.type === '表箱')
    ];

    allMeterBoxes.forEach(box => {
      const abnormalMeters = box.meterLayout?.meters?.filter(m => m.status !== '正常') || [];
      if (abnormalMeters.length > 0) {
        allAbnormalDevices.push({
          id: box.id,
          name: box.name,
          type: '表箱异常',
          location: { lng: box.longitude, lat: box.latitude },
          errors: abnormalMeters.map(m => ({
            type: 'warning',
            message: `${m.id}: ${m.status}`,
            field: 'meter_status'
          }))
        });
      }
    });

    // 为每个异常设备添加可视化标记
    allAbnormalDevices.forEach(device => {
      addAbnormalDeviceMarker(device);
    });
  };

  // 添加单个异常设备标记
  const addAbnormalDeviceMarker = (device) => {
    const hasError = device.errors.some(e => e.type === 'error');
    const color = hasError ? '#ff0000' : '#ffa500';
    const size = hasError ? 1000 : 800;

    // 添加圆圈标识（适合打印）
    const circle = new window.AMap.Circle({
      center: new window.AMap.LngLat(device.location.lng, device.location.lat),
      radius: size,
      strokeColor: color,
      strokeWeight: 4,
      strokeStyle: hasError ? 'solid' : 'dashed',
      fillColor: color,
      fillOpacity: 0.1
    });
    circle.setMap(mapInstance.current);

    // 添加异常标记图标
    const marker = new window.AMap.Marker({
      position: new window.AMap.LngLat(device.location.lng, device.location.lat),
      icon: new window.AMap.Icon({
        size: new window.AMap.Size(30, 30),
        image: createAbnormalIcon(hasError),
        imageOffset: new window.AMap.Pixel(0, 0), // 不偏移，图标左上角对准坐标点
        imageSize: new window.AMap.Size(30, 30)
      }),
      title: `${device.name} - ${device.errors.length}个异常`,
      zIndex: 1500
    });

    marker.setMap(mapInstance.current);
  };

  // 创建异常设备图标
  const createAbnormalIcon = (isError) => {
    const color = isError ? '#ff0000' : '#ffa500';
    const symbol = isError ? '!' : '!'; // 使用英文感叹号避免编码问题

    const svgContent = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="12" fill="${color}" stroke="#fff" stroke-width="2" opacity="0.9"/>
        <circle cx="15" cy="15" r="8" fill="none" stroke="#fff" stroke-width="1"/>
        <text x="15" y="20" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">${symbol}</text>
      </svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  // 设备校验功能
  const performDeviceValidation = (targetArea = 'all') => {
    const allDevices = [...powerGridData, ...userGridData];
    const results = [];
    
    allDevices.forEach(device => {
      if (device.validationErrors && device.validationErrors.length > 0) {
        results.push({
          id: device.id,
          name: device.name,
          type: device.type,
          errors: device.validationErrors,
          location: { lng: device.longitude, lat: device.latitude }
        });
      }
    });
    
    setValidationResults(results);
    setShowValidationPanel(true);
    
    // 在地图上高亮显示有错误的设备
    highlightValidationErrors(results);
  };

  // 高亮显示校验错误设备
  const highlightValidationErrors = (results) => {
    results.forEach(result => {
      const errorLevel = result.errors.some(e => e.type === 'error') ? 'error' : 'warning';
      const color = errorLevel === 'error' ? '#ff0000' : '#ffa500';

      // 添加静态异常标识圆圈（适合打印）
      const circle = new window.AMap.Circle({
        center: new window.AMap.LngLat(result.location.lng, result.location.lat),
        radius: 800, // 800米半径
        strokeColor: color,
        strokeWeight: 4,
        strokeStyle: errorLevel === 'error' ? 'solid' : 'dashed',
        fillColor: color,
        fillOpacity: 0.15
      });
      circle.setMap(mapInstance.current);

      // 添加错误标记
      const errorMarker = new window.AMap.Marker({
        position: new window.AMap.LngLat(result.location.lng, result.location.lat),
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(60, 60),
          image: createErrorIcon(errorLevel),
          imageOffset: new window.AMap.Pixel(0, 0), // 不偏移，图标左上角对准坐标点
          imageSize: new window.AMap.Size(60, 60)
        }),
        title: `${result.name} - ${result.errors.length}个错误`,
        extData: result,
        zIndex: 1000
      });
      
      errorMarker.on('click', (e) => {
        showValidationErrorWindow(e.target);
      });
      
      mapInstance.current.add(errorMarker);
    });
  };

  // 创建错误图标（优化打印效果）
  const createErrorIcon = (level) => {
    const color = level === 'error' ? '#ff0000' : '#ffa500';
    const symbol = level === 'error' ? '⚠' : '!';
    const strokePattern = level === 'error' ? '0' : '5,5';

    const svgContent = `
      <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="25" fill="${color}" stroke="#000" stroke-width="4"
                stroke-dasharray="${strokePattern}" opacity="0.9"/>
        <circle cx="30" cy="30" r="20" fill="none" stroke="#fff" stroke-width="2"/>
        <text x="30" y="38" text-anchor="middle" font-size="18" fill="#fff" font-weight="bold">${symbol}</text>
        <text x="30" y="52" text-anchor="middle" font-size="6" fill="#000" font-weight="bold">异常</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  // 创建校验错误真正的InfoWindow
  const createValidationErrorInfoWindow = (result, position) => {
    const errorLevel = result.errors.some(e => e.type === 'error') ? 'error' : 'warning';
    const levelText = errorLevel === 'error' ? '严重错误' : '警告';
    const levelColor = errorLevel === 'error' ? '#ff0000' : '#ffa500';

    // 使用真正的InfoWindow，和手动点击完全相同
    const infoWindow = new window.AMap.InfoWindow({
      content: `
        <div class="info-window validation-error">
          <h3>⚠️ ${result.name}</h3>
          <p><strong>设备类型:</strong> ${result.type}</p>
          <p><strong>错误级别:</strong> <span style="color: ${levelColor};">${levelText}</span></p>
          <p><strong>发现问题:</strong> ${result.errors.length}个</p>
          <div class="error-list">
            ${result.errors.map(error => `
              <div class="error-item ${error.type}">
                <span class="error-type">[${error.type === 'error' ? '错误' : '警告'}]</span>
                <span class="error-message">${error.message}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `,
      offset: new window.AMap.Pixel(0, -30),
      closeWhenClickMap: false, // 点击地图时不关闭
      autoMove: false // 不自动移动
    });

    // 打开InfoWindow
    infoWindow.open(mapInstance.current, position);

    return infoWindow;
  };

  // 自动校验错误显示功能 - 使用真正的InfoWindow
  const openAllValidationErrorPopups = () => {
    if (!mapInstance.current || !window.AMap) return;

    // 先关闭所有现有显示
    closeAllValidationErrorPopups();

    // 获取所有有校验错误的设备
    const allDevices = [...powerGridData, ...userGridData];
    const errorDevices = [];

    allDevices.forEach(device => {
      if (device.validationErrors && device.validationErrors.length > 0) {
        errorDevices.push({
          id: device.id,
          name: device.name,
          type: device.type,
          errors: device.validationErrors,
          location: { lng: device.longitude, lat: device.latitude }
        });
      }
    });

    console.log('=== 自动校验错误功能调试 ===');
    console.log('找到的错误设备:', errorDevices.map(device => ({ id: device.id, name: device.name, errorCount: device.errors.length })));

    let successCount = 0;

    errorDevices.forEach((device, index) => {
      console.log(`创建错误信息窗口: ${device.name} (${device.errors.length}个错误)`);

      // 延迟创建，避免同时创建导致覆盖
      setTimeout(() => {
        const position = new window.AMap.LngLat(device.location.lng, device.location.lat);
        const infoWindow = createValidationErrorInfoWindow(device, position);
        validationPopups.current.push(infoWindow);
        console.log(`✓ 校验错误InfoWindow已创建: ${device.name}`);
      }, index * 150); // 每个延迟150ms

      successCount++;
    });

    console.log(`总共准备创建 ${successCount} 个校验错误InfoWindow`);
    console.log('=== 调试结束 ===');
  };

  // 关闭所有校验错误自动显示
  const closeAllValidationErrorPopups = () => {
    validationPopups.current.forEach(infoWindow => {
      try {
        infoWindow.close(); // 关闭真正的InfoWindow
      } catch (e) {
        // 忽略关闭错误
      }
    });
    validationPopups.current = [];
    console.log('所有校验错误InfoWindow已关闭');
  };

  const addPointMarker = (item) => {
    // 创建自定义图标
    const icon = new window.AMap.Icon({
      size: new window.AMap.Size(40, 40),
      image: getIconByType(item.type),
      imageOffset: new window.AMap.Pixel(0, 0), // 不偏移，图标左上角对准坐标点
      imageSize: new window.AMap.Size(40, 40)
    });

    // 创建标记点
    const marker = new window.AMap.Marker({
      position: new window.AMap.LngLat(item.longitude, item.latitude),
      icon: icon,
      title: item.name,
      extData: item
    });

    // 添加点击事件
    marker.on('click', (e) => {
      showInfoWindow(e.target);
    });

    // 将标记添加到地图
    mapInstance.current.add(marker);
  };

  // 添加用户表箱标记
  const addUserMarker = (item) => {
    // 检查是否有异常表计
    const abnormalMeters = item.meterLayout?.meters?.filter(m => m.status !== '正常') || [];
    const hasAbnormalMeters = abnormalMeters.length > 0;

    // 创建表箱图标 - 异常表箱显示红色，正常表箱显示蓝色，显示"表箱"文字
    const createMeterBoxIcon = (isAbnormal) => {
      const color = isAbnormal ? '#ff0000' : '#0066ff';
      const textColor = '#ffffff';

      // 使用简单的矩形图标，避免复杂的SVG编码
      const svgContent = `<svg width="50" height="35" viewBox="0 0 50 35" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="48" height="33" rx="4" fill="${color}" stroke="#fff" stroke-width="2"/>
          <text x="25" y="22" text-anchor="middle" font-size="12" fill="${textColor}" font-family="Arial, sans-serif" font-weight="bold">表箱</text>
        </svg>`;

      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    };

    const icon = new window.AMap.Icon({
      size: new window.AMap.Size(50, 35),
      image: createMeterBoxIcon(hasAbnormalMeters),
      imageOffset: new window.AMap.Pixel(0, 0), // 不偏移，图标左上角对准坐标点
      imageSize: new window.AMap.Size(50, 35)
    });

    const marker = new window.AMap.Marker({
      position: new window.AMap.LngLat(item.longitude, item.latitude),
      icon: icon,
      title: item.name + (hasAbnormalMeters ? ` (${abnormalMeters.length}个异常表计)` : ''),
      extData: item
    });

    // 如果有异常表计，添加轻微的闪烁效果
    if (hasAbnormalMeters) {
      marker.setAnimation('AMAP_ANIMATION_DROP');
    }

    marker.on('click', (e) => {
      showUserInfoWindow(e.target);
    });

    mapInstance.current.add(marker);
  };

  const addTransmissionLine = (lineData) => {
    // 创建线路路径
    const path = [
      [lineData.startPoint.longitude, lineData.startPoint.latitude],
      [lineData.endPoint.longitude, lineData.endPoint.latitude]
    ];

    // 根据状态设置线路颜色
    const getLineColor = (status) => {
      switch (status) {
        case '正常': return '#00ff00';
        case '故障': return '#ff0000';
        case '维护': return '#ffa500';
        case '停运': return '#808080';
        default: return '#0066ff';
      }
    };

    // 创建线路
    const polyline = new window.AMap.Polyline({
      path: path,
      strokeColor: getLineColor(lineData.status),
      strokeWeight: 6,
      strokeOpacity: 0.8,
      strokeStyle: lineData.status === '故障' ? 'dashed' : 'solid',
      extData: lineData
    });

    // 添加点击事件
    polyline.on('click', (e) => {
      showLineInfoWindow(e.target, e.lnglat);
    });

    // 将线路添加到地图
    mapInstance.current.add(polyline);

    // 在线路中点添加标识
    const midLat = (lineData.startPoint.latitude + lineData.endPoint.latitude) / 2;
    const midLng = (lineData.startPoint.longitude + lineData.endPoint.longitude) / 2;
    
    const lineMarker = new window.AMap.Marker({
      position: new window.AMap.LngLat(midLng, midLat),
      icon: new window.AMap.Icon({
        size: new window.AMap.Size(30, 30),
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTIiIGZpbGw9IiNmZjMzMDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik04IDE1aDE0IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIvPgo8L3N2Zz4=',
        imageOffset: new window.AMap.Pixel(0, 0), // 不偏移，图标左上角对准坐标点
        imageSize: new window.AMap.Size(30, 30)
      }),
      title: lineData.name,
      extData: lineData
    });

    lineMarker.on('click', (e) => {
      showLineInfoWindow(e.target, e.target.getPosition());
    });

    mapInstance.current.add(lineMarker);
  };

  const getIconByType = (type) => {
    const iconMap = {
      '发电厂': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNmZjY2MDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xMiAxNmw0IDRsLTQgNGw0IDRsLTQgNGg4djRoNHYtNGg0bC00LTRsNC00bC00LTRsNC00aC00di00aC00djRoLTRsMCA0eiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=',
      '变电站': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiMwMDY2ZmYiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjE0IiB5PSIxMCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiLz4KPHJlY3QgeD0iMTQiIHk9IjIyIiB3aWR0aD0iMTIiIGhlaWdodD0iOCIgZmlsbD0iI2ZmZiIvPgo8bGluZSB4MT0iMTQiIHkxPSIxOCIgeDI9IjI2IiB5Mj0iMTgiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxsaW5lIHgxPSIxNCIgeTE9IjIyIiB4Mj0iMjYiIHkyPSIyMiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
      '输电线路': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNmZjMzMDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xMCAyMGw2LTZsNiA2bDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTEwIDI2bDYtNmw2IDZsNi02IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4='
    };
    return iconMap[type] || iconMap['发电厂'];
  };

  const showInfoWindow = (marker) => {
    const data = marker.getExtData();
    const infoWindow = new window.AMap.InfoWindow({
      content: `
        <div class="info-window">
          <h3>${data.name}</h3>
          <p><strong>类型:</strong> ${data.type}</p>
          <p><strong>容量:</strong> ${data.capacity}</p>
          <p><strong>状态:</strong> <span class="status ${data.status}">${data.status}</span></p>
          <p><strong>负荷:</strong> ${data.load}</p>
          <p><strong>位置:</strong> ${data.address}</p>
        </div>
      `,
      offset: new window.AMap.Pixel(0, -30)
    });
    infoWindow.open(mapInstance.current, marker.getPosition());
  };

  const showLineInfoWindow = (lineOrMarker, position) => {
    const data = lineOrMarker.getExtData();
    const lineDetails = data.lineDetails || {};
    const infoWindow = new window.AMap.InfoWindow({
      content: `
        <div class="info-window">
          <h3>${data.name}</h3>
          <p><strong>类型:</strong> ${data.type}</p>
          <p><strong>容量:</strong> ${data.capacity}</p>
          <p><strong>状态:</strong> <span class="status ${data.status}">${data.status}</span></p>
          <p><strong>负荷:</strong> ${data.load}</p>
          <p><strong>起点:</strong> ${data.startPoint.name}</p>
          <p><strong>终点:</strong> ${data.endPoint.name}</p>
          <p><strong>导线型号:</strong> ${lineDetails.wireType || 'N/A'}</p>
          <p><strong>线径:</strong> ${lineDetails.diameter || 'N/A'}</p>
          <p><strong>敷设长度:</strong> ${lineDetails.length || 'N/A'}</p>
          <p><strong>位置:</strong> ${data.address}</p>
        </div>
      `,
      offset: new window.AMap.Pixel(0, -30)
    });
    infoWindow.open(mapInstance.current, position);
  };

  // 显示用户信息窗口
  const showUserInfoWindow = (marker) => {
    const data = marker.getExtData();
    const voltage = data.voltageData || {};

    const infoWindow = new window.AMap.InfoWindow({
      content: `
        <div class="info-window meter-box-window">
          <h3>${data.name}</h3>
          <p><strong>类型:</strong> ${data.type}</p>
          <p><strong>电压:</strong> ${voltage.current || 'N/A'}V (${voltage.status || 'N/A'})</p>
          <p><strong>位置:</strong> ${data.address}</p>
          <div class="meter-layout-container">
            <h4>表箱内部布局</h4>
            ${generateMeterLayoutHtml(data.meterLayout)}
          </div>
        </div>
      `,
      offset: new window.AMap.Pixel(0, -30)
    });
    infoWindow.open(mapInstance.current, marker.getPosition());
  };

  // 生成表箱内部布局HTML
  const generateMeterLayoutHtml = (meterLayout) => {
    if (!meterLayout || !meterLayout.meters) {
      return '<p>暂无布局信息</p>';
    }

    const meters = meterLayout.meters;
    const totalMeters = meterLayout.totalMeters || meters.length;

    // 使用3列网格布局

    let layoutHtml = '<div class="meter-grid">';

    for (let i = 0; i < totalMeters; i++) {
      const meter = meters[i];
      if (meter) {
        const statusClass = getStatusClass(meter.status);
        const paymentClass = meter.paymentStatus === '欠费' ? 'owing' : '';
        const powerTypeClass = getPowerTypeClass(meter.powerType);
        layoutHtml += `
          <div class="meter-slot ${statusClass} ${paymentClass} ${powerTypeClass}"
               title="${meter.householder} - ${meter.status} - ${meter.powerType} - ${meter.userType}">
            <div class="meter-id">${meter.id}</div>
            <div class="meter-user">${meter.householder}</div>
            <div class="meter-type">${meter.userType}</div>
            <div class="meter-power-type">${meter.powerType}</div>
            <div class="meter-voltage">${meter.voltage}V</div>
            <div class="meter-status">${meter.status}</div>
            ${meter.paymentStatus === '欠费' ? `<div class="owing-amount">欠费: ¥${meter.owingAmount}</div>` : ''}
          </div>
        `;
      } else {
        layoutHtml += '<div class="meter-slot empty">空位</div>';
      }
    }

    layoutHtml += '</div>';
    return layoutHtml;
  };

  // 获取状态样式类
  const getStatusClass = (status) => {
    switch (status) {
      case '正常': return 'normal';
      case '通信故障': return 'comm-error';
      case '电压异常': return 'voltage-error';
      case '数据错误': return 'data-error';
      default: return 'unknown';
    }
  };

  // 获取用电类型样式类
  const getPowerTypeClass = (powerType) => {
    switch (powerType) {
      case 'A相': return 'phase-a';
      case 'B相': return 'phase-b';
      case 'C相': return 'phase-c';
      default: return '';
    }
  };

  // 定位异常表计
  const locateAbnormalMeter = (meterId) => {
    // 查找包含该表计的表箱
    const meterBox = userGridData.find(box =>
      box.meterLayout?.meters?.some(meter => meter.id === meterId)
    );

    if (meterBox && mapInstance.current) {
      // 定位到表箱位置
      const position = new window.AMap.LngLat(meterBox.longitude, meterBox.latitude);
      mapInstance.current.setCenter(position);
      mapInstance.current.setZoom(16);

      // 高亮显示该表箱
      const highlightMarker = new window.AMap.Marker({
        position: position,
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(80, 80),
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmMDAwMCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtZGFzaGFycmF5PSI1LDUiPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMzU7NDU7MzUiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLW9wYWNpdHkiIHZhbHVlcz0iMTswLjM7MSIgZHVyPSIycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KPC9jaXJjbGU+Cjwvc3ZnPg==',
          imageOffset: new window.AMap.Pixel(-40, -40)
        }),
        zIndex: 2000
      });

      mapInstance.current.add(highlightMarker);

      // 3秒后移除高亮标记
      setTimeout(() => {
        mapInstance.current.remove(highlightMarker);
      }, 3000);

      // 关闭异常表计面板
      setShowAbnormalList(false);

      // 显示表箱信息
      setTimeout(() => {
        const boxMarker = mapInstance.current.getAllOverlays('marker').find(marker =>
          marker.getExtData()?.id === meterBox.id
        );
        if (boxMarker) {
          showUserInfoWindow(boxMarker);
        }
      }, 500);
    }
  };

  // 定位设备校验错误
  const locateValidationError = (_, location) => {
    if (mapInstance.current && location) {
      // 移动地图到设备位置
      const position = new window.AMap.LngLat(location.lng, location.lat);
      mapInstance.current.setCenter(position);
      mapInstance.current.setZoom(15);

      // 添加闪烁动画标记
      const highlightMarker = new window.AMap.Marker({
        position: position,
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(100, 100),
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWRhc2hhcnJheT0iMTAsMTAiPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iNDU7NjA7NDUiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLW9wYWNpdHkiIHZhbHVlcz0iMTswLjI7MSIgZHVyPSIycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KPC9jaXJjbGU+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjZmYwMDAwIiBvcGFjaXR5PSIwLjgiLz4KPHN2ZyB4PSI0MCIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+Cjx0ZXh0IHg9IjEwIiB5PSIxNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgZm9udC13ZWlnaHQ9ImJvbGQiPuKaoTwvdGV4dD4KPC9zdmc+Cjwvc3ZnPg==',
          imageOffset: new window.AMap.Pixel(-50, -50)
        }),
        zIndex: 2000
      });

      mapInstance.current.add(highlightMarker);

      // 5秒后移除标记
      setTimeout(() => {
        mapInstance.current.remove(highlightMarker);
      }, 5000);

      // 关闭校验面板
      setShowValidationPanel(false);
    }
  };

  // 显示校验错误信息窗口
  const showValidationErrorWindow = (marker) => {
    const data = marker.getExtData();
    const errorsHtml = data.errors.map(error => `
      <div class="error-item ${error.type}">
        <span class="error-type">${error.type === 'error' ? '错误' : '警告'}</span>
        <span class="error-message">${error.message}</span>
        <span class="error-field">(${error.field})</span>
      </div>
    `).join('');
    
    const infoWindow = new window.AMap.InfoWindow({
      content: `
        <div class="info-window validation-error">
          <h3>⚠️ ${data.name}</h3>
          <p><strong>设备类型:</strong> ${data.type}</p>
          <p><strong>发现问题:</strong> ${data.errors.length}个</p>
          <div class="error-list">${errorsHtml}</div>
          <button onclick="fixValidationError('${data.id}')" class="btn-fix">修复问题</button>
        </div>
      `,
      offset: new window.AMap.Pixel(0, -30)
    });
    infoWindow.open(mapInstance.current, new window.AMap.LngLat(data.location.lng, data.location.lat));
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
          <div className="legend-item">
            <div className="legend-icon meter-box"></div>
            <span>表箱</span>
          </div>
        </div>
        
        <div className="control-panel">
          <h4>设备管理</h4>
          <button
            className="control-btn validation-btn"
            onClick={() => performDeviceValidation()}
          >
            📋 设备校验
          </button>
          <button
            className={`control-btn ${autoValidationMode ? 'active' : ''}`}
            onClick={() => {
              const newMode = !autoValidationMode;
              setAutoValidationMode(newMode);
              if (newMode) {
                openAllValidationErrorPopups();
              } else {
                closeAllValidationErrorPopups();
              }
            }}
          >
            {autoValidationMode ? '🔓 自动校验' : '🔒 自动校验'}
          </button>
          <button
            className="control-btn"
            onClick={() => setShowAbnormalList(true)}
          >
            ⚠️ 异常表计
          </button>
          <button
            className="control-btn"
            onClick={() => setShowLossAnalysis(true)}
          >
            📊 线损分析
          </button>
          <button
            className="control-btn"
            onClick={() => setShowLoadMonitor(true)}
          >
            📈 负荷监控
          </button>
          <button
            className="control-btn"
            onClick={() => setShowMeterBoxes(!showMeterBoxes)}
          >
            📦 表箱展示
          </button>
          <button
            className={`control-btn ${autoMeterBoxMode ? 'active' : ''}`}
            onClick={() => {
              const newMode = !autoMeterBoxMode;
              setAutoMeterBoxMode(newMode);
              // 如果关闭自动模式，立即关闭所有弹窗
              if (!newMode) {
                closeAllMeterBoxPopups();
              }
            }}
          >
            {autoMeterBoxMode ? '🔓 自动表箱' : '🔒 自动表箱'}
          </button>
          <button
            className="control-btn"
            onClick={() => window.print()}
          >
            🖨️ 打印地图
          </button>
        </div>
      </div>
      
      <div ref={mapRef} className="map"></div>
      
      {/* 校验结果面板 */}
      {showValidationPanel && (
        <div className="validation-panel">
          <div className="panel-header">
            <h3>📋 设备校验结果</h3>
            <button onClick={() => setShowValidationPanel(false)}>✕</button>
          </div>
          <div className="panel-content">
            <p>发现 {validationResults.length} 个设备存在问题</p>
            {validationResults.map(result => (
              <div key={result.id} className="validation-item">
                <div className="item-header">
                  <span className="device-name">{result.name}</span>
                  <span className="device-type">{result.type}</span>
                </div>
                <div className="error-count">
                  {result.errors.length} 个问题
                </div>
                <div className="error-summary">
                  {result.errors.map((error, index) => (
                    <span key={index} className={`error-tag ${error.type}`}>
                      {error.message}
                    </span>
                  ))}
                </div>
                <div className="validation-actions">
                  <button
                    className="locate-btn"
                    onClick={() => locateValidationError(result.id, result.location)}
                  >
                    📍 定位
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 异常表计清单 */}
      {showAbnormalList && (
        <div className="abnormal-panel">
          <div className="panel-header">
            <h3>⚠️ 异常表计清单</h3>
            <button onClick={() => setShowAbnormalList(false)}>✕</button>
          </div>
          <div className="panel-content">
            <div className="abnormal-list">
              {abnormalMeters.map(meter => (
                <div key={meter.id} className="abnormal-item" onClick={() => locateAbnormalMeter(meter.id)}>
                  <div className="meter-info">
                    <span className="meter-id">{meter.id}</span>
                    <span className="householder">{meter.householder}</span>
                  </div>
                  <div className="meter-details">
                    <span className="address">{meter.address}</span>
                    <span className={`status ${meter.type}`}>{meter.type}</span>
                  </div>
                  <div className="last-online">
                    最后上线: {meter.lastOnline}
                  </div>
                  <div className="locate-btn">
                    📍 点击定位
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 线损分析面板 */}
      {showLossAnalysis && (
        <div className="loss-analysis-panel">
          <div className="panel-header">
            <h3>📊 台区线损分析</h3>
            <div className="chart-controls">
              <button
                className={`chart-type-btn ${lossChartType === 'bar' ? 'active' : ''}`}
                onClick={() => setLossChartType('bar')}
              >
                📊 柱状图
              </button>
              <button
                className={`chart-type-btn ${lossChartType === 'line' ? 'active' : ''}`}
                onClick={() => setLossChartType('line')}
              >
                📈 折线图
              </button>
            </div>
            <button onClick={() => setShowLossAnalysis(false)}>✕</button>
          </div>
          <div className="panel-content">
            {areaLossData.map(area => (
              <div key={area.id} className="loss-chart">
                <h4>{area.name}</h4>
                <div className="chart-container">
                  <div className="chart-legend">
                    <span className="legend-theoretical">理论线损</span>
                    <span className="legend-actual">实际线损</span>
                  </div>
                  {lossChartType === 'bar' ? (
                    <div className="chart-data">
                      {area.dates.map((date, index) => (
                        <div key={index} className="chart-bar">
                          <div className="bar-group">
                            <div
                              className="bar theoretical"
                              style={{ height: `${area.theoreticalLoss[index] * 20}px` }}
                            ></div>
                            <div
                              className="bar actual"
                              style={{ height: `${area.actualLoss[index] * 20}px` }}
                            ></div>
                          </div>
                          <span className="bar-label">{date.slice(-2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="line-chart">
                      <svg width="100%" height="200" viewBox="0 0 400 200">
                        {/* 网格线 */}
                        <defs>
                          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* 理论线损折线 */}
                        <polyline
                          fill="none"
                          stroke="#3498db"
                          strokeWidth="2"
                          points={area.theoreticalLoss.map((loss, index) =>
                            `${(index * 40) + 20},${180 - (loss * 20)}`
                          ).join(' ')}
                        />

                        {/* 实际线损折线 */}
                        <polyline
                          fill="none"
                          stroke="#e74c3c"
                          strokeWidth="2"
                          points={area.actualLoss.map((loss, index) =>
                            `${(index * 40) + 20},${180 - (loss * 20)}`
                          ).join(' ')}
                        />

                        {/* 数据点 */}
                        {area.theoreticalLoss.map((loss, index) => (
                          <circle
                            key={`theoretical-${index}`}
                            cx={(index * 40) + 20}
                            cy={180 - (loss * 20)}
                            r="3"
                            fill="#3498db"
                          />
                        ))}
                        {area.actualLoss.map((loss, index) => (
                          <circle
                            key={`actual-${index}`}
                            cx={(index * 40) + 20}
                            cy={180 - (loss * 20)}
                            r="3"
                            fill="#e74c3c"
                          />
                        ))}

                        {/* X轴标签 */}
                        {area.dates.map((date, index) => (
                          <text
                            key={index}
                            x={(index * 40) + 20}
                            y="195"
                            textAnchor="middle"
                            fontSize="10"
                            fill="#666"
                          >
                            {date.slice(-2)}
                          </text>
                        ))}
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 负荷监控面板 */}
      {showLoadMonitor && (
        <div className="load-monitor-panel">
          <div className="panel-header">
            <h3>📈 变电站负荷监控</h3>
            <button onClick={() => setShowLoadMonitor(false)}>✕</button>
          </div>
          <div className="panel-content">
            <div className="station-selector">
              <h4>选择变电站</h4>
              <div className="station-list">
                {powerGridData.filter(item => item.type === '变电站').map(station => (
                  <div
                    key={station.id}
                    className={`station-item ${selectedStation?.id === station.id ? 'selected' : ''}`}
                    onClick={() => setSelectedStation(station)}
                  >
                    <span className="station-name">{station.name}</span>
                    <span className="station-load">当前负荷: {station.loadData?.current || 0}MW</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedStation && (
              <div className="load-chart-container">
                <h4>{selectedStation.name} - 负荷变化趋势</h4>
                <div className="load-chart">
                  <div className="chart-y-axis">
                    <span>200MW</span>
                    <span>150MW</span>
                    <span>100MW</span>
                    <span>50MW</span>
                    <span>0MW</span>
                  </div>
                  <div className="chart-area">
                    <svg width="300" height="150" viewBox="0 0 300 150">
                      {/* 网格线 */}
                      <defs>
                        <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 60 0 L 0 0 0 30" fill="none" stroke="#ecf0f1" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* 负荷曲线 */}
                      <polyline
                        fill="none"
                        stroke="#3498db"
                        strokeWidth="3"
                        points={selectedStation.loadData?.history?.map((load, index) =>
                          `${index * 60 + 30},${150 - (load / 200) * 150}`
                        ).join(' ') || ''}
                      />

                      {/* 数据点 */}
                      {selectedStation.loadData?.history?.map((load, index) => (
                        <circle
                          key={index}
                          cx={index * 60 + 30}
                          cy={150 - (load / 200) * 150}
                          r="4"
                          fill="#3498db"
                          stroke="#fff"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="chart-x-axis">
                    <span>5天前</span>
                    <span>4天前</span>
                    <span>3天前</span>
                    <span>2天前</span>
                    <span>昨天</span>
                  </div>
                </div>

                <div className="load-stats">
                  <div className="stat-item">
                    <span className="stat-label">当前负荷</span>
                    <span className="stat-value">{selectedStation.loadData?.current || 0}MW</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">平均负荷</span>
                    <span className="stat-value">
                      {selectedStation.loadData?.history ?
                        Math.round(selectedStation.loadData.history.reduce((a, b) => a + b, 0) / selectedStation.loadData.history.length) : 0}MW
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">峰值负荷</span>
                    <span className="stat-value">
                      {selectedStation.loadData?.history ? Math.max(...selectedStation.loadData.history) : 0}MW
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 表箱展示面板 */}
      {showMeterBoxes && (
        <div className="meter-boxes-panel">
          <div className="panel-header">
            <h3>📦 表箱内部布局展示</h3>
            <button onClick={() => setShowMeterBoxes(false)}>✕</button>
          </div>
          <div className="panel-content">
            <div className="meter-boxes-grid">
              {[
                ...powerGridData.filter(item => item.type === '表箱'),
                ...userGridData.filter(item => item.type === '表箱')
              ].map(box => (
                <div key={box.id} className="meter-box-card">
                  <div className="box-header">
                    <h4>{box.name}</h4>
                    <span className="box-address">{box.address}</span>
                  </div>
                  <div className="meter-layout-display">
                    <div dangerouslySetInnerHTML={{
                      __html: generateMeterLayoutHtml(box.meterLayout)
                    }} />
                  </div>
                  <div className="box-stats">
                    <span>总表位: {box.meterLayout?.totalMeters || 0}</span>
                    <span>异常: {box.meterLayout?.meters?.filter(m => m.status !== '正常').length || 0}</span>
                    <span>欠费: {box.meterLayout?.meters?.filter(m => m.paymentStatus === '欠费').length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;