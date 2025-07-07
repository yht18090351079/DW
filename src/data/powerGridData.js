// 电力电网数据
export const powerGridData = [
  {
    id: 1,
    name: '北京第一热电厂',
    type: '发电厂',
    longitude: 116.397428,
    latitude: 39.90923,
    capacity: '500MW',
    status: '正常',
    load: '85%',
    address: '北京市朝阳区',
    // 设备校验信息
    validationErrors: [
      { type: 'warning', message: '设备运行时间接近维护周期', field: 'maintenanceSchedule' },
      { type: 'error', message: '环保排放数据异常', field: 'emissions' }
    ],
    // 设备详细信息
    equipmentDetails: {
      manufacturer: '华能集团',
      installDate: '2018-03-15',
      lastMaintenance: '2024-01-15'
    },
    // 负荷数据
    loadData: {
      current: 425,
      history: [380, 420, 425, 430, 435]
    }
  },
  {
    id: 2,
    name: '朝阳变电站',
    type: '变电站',
    longitude: 116.457428,
    latitude: 39.92923,
    capacity: '220KV',
    status: '正常',
    load: '78%',
    address: '北京市朝阳区建国路',
    // 设备校验信息
    validationErrors: [
      { type: 'warning', message: '主变压器油温偏高', field: 'oilTemperature' }
    ],
    // 设备详细信息
    equipmentDetails: {
      manufacturer: '国网北京',
      installDate: '2019-06-20',
      lastMaintenance: '2024-02-10'
    },
    // 电压数据
    voltageData: {
      current: 218.5,
      normal: [217, 222],
      status: '正常'
    },
    // 负荷数据
    loadData: {
      current: 171.6,
      history: [160, 165, 170, 172, 175]
    }
  },
  {
    id: 3,
    name: '海淀变电站',
    type: '变电站',
    longitude: 116.297428,
    latitude: 39.98923,
    capacity: '110KV',
    status: '维护',
    load: '45%',
    address: '北京市海淀区中关村',
    // 设备校验信息
    validationErrors: [
      { type: 'warning', message: '设备编号格式不规范', field: 'equipmentCode' },
      { type: 'error', message: '上次维护时间超期', field: 'lastMaintenance' }
    ],
    // 设备详细信息
    equipmentDetails: {
      manufacturer: '国网北京',
      installDate: '2017-09-10',
      lastMaintenance: '2023-08-15'
    },
    // 电压数据
    voltageData: {
      current: 108.2,
      normal: [106, 114],
      status: '偏低'
    },
    // 负荷数据
    loadData: {
      current: 49.5,
      history: [45, 47, 49, 50, 52]
    }
  },
  {
    id: 4,
    name: '大兴燃气电厂',
    type: '发电厂',
    longitude: 116.337428,
    latitude: 39.73923,
    capacity: '800MW',
    status: '正常',
    load: '92%',
    address: '北京市大兴区',
    // 设备校验信息
    validationErrors: [
      { type: 'error', message: '燃气供应压力不稳定', field: 'gasPressure' },
      { type: 'warning', message: '发电机组振动值偏高', field: 'vibration' }
    ],
    // 设备详细信息
    equipmentDetails: {
      manufacturer: '大唐集团',
      installDate: '2020-11-05',
      lastMaintenance: '2024-03-01'
    },
    // 负荷数据
    loadData: {
      current: 736,
      history: [720, 730, 735, 740, 745]
    }
  },
  {
    id: 5,
    name: '东城输电线路1',
    type: '输电线路',
    startPoint: { longitude: 116.397428, latitude: 39.90923, name: '北京第一热电厂' },
    endPoint: { longitude: 116.457428, latitude: 39.92923, name: '朝阳变电站' },
    capacity: '500KV',
    status: '正常',
    load: '67%',
    address: '北京市东城区',
    // 设备校验信息
    validationErrors: [
      { type: 'warning', message: '线路负荷接近额定容量', field: 'loadCapacity' },
      { type: 'error', message: '绝缘子污闪检测异常', field: 'insulator' }
    ],
    // 线路详细属性
    lineDetails: {
      wireType: 'ACSR-400',
      diameter: '26.82mm',
      length: '12.5km',
      installDate: '2018-05-20'
    }
  },
  {
    id: 6,
    name: '丰台变电站',
    type: '变电站',
    longitude: 116.287428,
    latitude: 39.84923,
    capacity: '220KV',
    status: '正常',
    load: '73%',
    address: '北京市丰台区',
    // 设备校验信息
    validationErrors: [
      { type: 'error', message: '主变压器冷却系统故障', field: 'coolingSystem' },
      { type: 'warning', message: 'SF6气体压力偏低', field: 'sf6Pressure' },
      { type: 'error', message: '避雷器泄漏电流超标', field: 'arrester' }
    ],
    // 设备详细信息
    equipmentDetails: {
      manufacturer: '国网北京',
      installDate: '2019-12-12',
      lastMaintenance: '2024-01-20'
    },
    // 电压数据
    voltageData: {
      current: 219.8,
      normal: [217, 222],
      status: '正常'
    },
    // 负荷数据
    loadData: {
      current: 160.54,
      history: [155, 158, 161, 162, 165]
    }
  },
  {
    id: 7,
    name: '通州风电场',
    type: '发电厂',
    longitude: 116.657428,
    latitude: 39.90923,
    capacity: '200MW',
    status: '正常',
    load: '58%',
    address: '北京市通州区',
    // 设备校验信息
    validationErrors: [
      { type: 'warning', message: '风机叶片结冰预警', field: 'bladeIcing' },
      { type: 'error', message: '变流器过热保护动作', field: 'converter' },
      { type: 'warning', message: '风速传感器数据异常', field: 'windSensor' }
    ],
    // 设备详细信息
    equipmentDetails: {
      manufacturer: '金风科技',
      installDate: '2016-04-18',
      lastMaintenance: '2024-02-28'
    },
    // 负荷数据
    loadData: {
      current: 116,
      history: [110, 112, 115, 118, 120]
    }
  },
  {
    id: 8,
    name: '西城输电线路2',
    type: '输电线路',
    startPoint: { longitude: 116.297428, latitude: 39.98923, name: '海淀变电站' },
    endPoint: { longitude: 116.287428, latitude: 39.84923, name: '丰台变电站' },
    capacity: '220KV',
    status: '故障',
    load: '0%',
    address: '北京市西城区',
    // 设备校验信息
    validationErrors: [
      { type: 'error', message: '线路接地电阻异常', field: 'resistance' },
      { type: 'error', message: '绝缘子污闪', field: 'insulation' }
    ],
    // 线路详细属性
    lineDetails: {
      wireType: 'ACSR-240',
      diameter: '21.66mm',
      length: '18.7km',
      installDate: '2017-08-15'
    }
  },
  {
    id: 9,
    name: '昌平变电站',
    type: '变电站',
    longitude: 116.237428,
    latitude: 40.22923,
    capacity: '110KV',
    status: '正常',
    load: '56%',
    address: '北京市昌平区',
    // 设备校验信息
    validationErrors: [
      { type: 'warning', message: '开关柜局部放电检测异常', field: 'switchgear' },
      { type: 'error', message: '电容器组不平衡保护动作', field: 'capacitor' }
    ],
    // 设备详细信息
    equipmentDetails: {
      manufacturer: '国网北京',
      installDate: '2018-07-03',
      lastMaintenance: '2024-03-10'
    },
    // 电压数据
    voltageData: {
      current: 111.2,
      normal: [106, 114],
      status: '正常'
    },
    // 负荷数据
    loadData: {
      current: 61.6,
      history: [55, 57, 60, 62, 65]
    }
  },
  {
    id: 10,
    name: '顺义太阳能电站',
    type: '发电厂',
    longitude: 116.637428,
    latitude: 40.12923,
    capacity: '100MW',
    status: '正常',
    load: '65%',
    address: '北京市顺义区',
    // 设备校验信息
    validationErrors: [
      { type: 'warning', message: '光伏组件功率衰减超标', field: 'pvModule' },
      { type: 'error', message: '逆变器直流侧接地故障', field: 'inverter' },
      { type: 'warning', message: '汇流箱熔断器熔断', field: 'combinerBox' }
    ],
    // 设备详细信息
    equipmentDetails: {
      manufacturer: '晶科能源',
      installDate: '2021-09-25',
      lastMaintenance: '2024-02-15'
    },
    // 负荷数据
    loadData: {
      current: 65,
      history: [60, 62, 64, 66, 68]
    }
  },
  {
    id: 11,
    name: '房山输电线路3',
    type: '输电线路',
    startPoint: { longitude: 116.337428, latitude: 39.73923, name: '大兴燃气电厂' },
    endPoint: { longitude: 116.287428, latitude: 39.84923, name: '丰台变电站' },
    capacity: '110KV',
    status: '正常',
    load: '71%',
    address: '北京市房山区',
    // 设备校验信息
    validationErrors: [
      { type: 'warning', message: '导线弧垂超标', field: 'conductorSag' },
      { type: 'error', message: '杆塔基础沉降', field: 'towerFoundation' },
      { type: 'warning', message: '防雷接地电阻偏高', field: 'groundingResistance' }
    ],
    // 线路详细属性
    lineDetails: {
      wireType: 'ACSR-185',
      diameter: '18.92mm',
      length: '15.2km',
      installDate: '2020-03-10'
    }
  },
  {
    id: 12,
    name: '密云变电站',
    type: '变电站',
    longitude: 116.837428,
    latitude: 40.37923,
    capacity: '220KV',
    status: '停运',
    load: '0%',
    address: '北京市密云区',
    // 设备校验信息
    validationErrors: [
      { type: 'error', message: '主变压器过热', field: 'temperature' },
      { type: 'error', message: '保护装置通信中断', field: 'communication' }
    ],
    // 设备详细信息
    equipmentDetails: {
      manufacturer: '国网北京',
      installDate: '2015-11-30',
      lastMaintenance: '2023-12-05'
    },
    // 电压数据
    voltageData: {
      current: 0,
      normal: [217, 222],
      status: '停运'
    },
    // 负荷数据
    loadData: {
      current: 0,
      history: [0, 0, 0, 0, 0]
    }
  }
];

// 用户数据（表箱、用户信息）
export const userGridData = [
  {
    id: 'user_001',
    name: '建国门居民表箱',
    type: '表箱',
    longitude: 116.427428,
    latitude: 39.91923,
    address: '北京市朝阳区建国门外大街',
    // 表箱内部布局
    meterLayout: {
      totalMeters: 12,
      meters: [
        {
          id: 'M001',
          householder: '张三',
          status: '正常',
          voltage: 220.5,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 150,
          owingAmount: 0
        },
        {
          id: 'M002',
          householder: '李四',
          status: '通信故障',
          voltage: 0,
          userType: '居民用户',
          paymentStatus: '欠费',
          powerType: 'B相',
          monthlyUsage: 0,
          owingAmount: 285.50
        },
        {
          id: 'M003',
          householder: '王五',
          status: '电压异常',
          voltage: 200.1,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'C相',
          monthlyUsage: 180,
          owingAmount: 0
        },
        {
          id: 'M004',
          householder: '赵六',
          status: '数据错误',
          voltage: 221.8,
          userType: '居民用户',
          paymentStatus: '欠费',
          powerType: 'A相',
          monthlyUsage: 0,
          owingAmount: 156.30
        },
        {
          id: 'M005',
          householder: '孙七',
          status: '长期不上线',
          voltage: 0,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'B相',
          monthlyUsage: 0,
          owingAmount: 0
        },
        {
          id: 'M006',
          householder: '周八',
          status: '电表故障',
          voltage: 0,
          userType: '居民用户',
          paymentStatus: '欠费',
          powerType: 'C相',
          monthlyUsage: 0,
          owingAmount: 432.80
        }
      ]
    },
    // 电压数据
    voltageData: {
      current: 218.5,
      normal: [217, 222],
      status: '正常'
    },
    // 校验错误
    validationErrors: [
      { type: 'warning', message: '部分电表通信异常', field: 'communication' }
    ]
  },
  {
    id: 'user_002',
    name: '中关村商业表箱',
    type: '表箱',
    longitude: 116.327428,
    latitude: 39.99423,
    address: '北京市海淀区中关村大街',
    // 表箱内部布局
    meterLayout: {
      totalMeters: 8,
      meters: [
        {
          id: 'M004',
          householder: '创业咖啡',
          status: '正常',
          voltage: 221.2,
          userType: '商业用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 850,
          owingAmount: 0
        },
        {
          id: 'M005',
          householder: '科技公司',
          status: '正常',
          voltage: 220.8,
          userType: '工业用户',
          paymentStatus: '正常',
          powerType: 'B相',
          monthlyUsage: 2500,
          owingAmount: 0
        },
        {
          id: 'M006',
          householder: '便利店',
          status: '正常',
          voltage: 219.9,
          userType: '商业用户',
          paymentStatus: '欠费',
          powerType: 'C相',
          monthlyUsage: 420,
          owingAmount: 1250.80
        },
        {
          id: 'M007',
          householder: '餐饮店',
          status: '通信故障',
          voltage: 0,
          userType: '商业用户',
          paymentStatus: '欠费',
          powerType: 'A相',
          monthlyUsage: 0,
          owingAmount: 2180.50
        },
        {
          id: 'M008',
          householder: '健身房',
          status: '电压异常',
          voltage: 205.3,
          userType: '商业用户',
          paymentStatus: '正常',
          powerType: 'B相',
          monthlyUsage: 1800,
          owingAmount: 0
        }
      ]
    },
    // 电压数据
    voltageData: {
      current: 220.6,
      normal: [217, 222],
      status: '正常'
    },
    // 校验错误
    validationErrors: [
      { type: 'error', message: '表箱门锁损坏', field: 'boxLock' },
      { type: 'warning', message: '表箱内湿度过高', field: 'humidity' }
    ]
  },
  {
    id: 'user_003',
    name: '亦庄工业表箱',
    type: '表箱',
    longitude: 116.507428,
    latitude: 39.79923,
    address: '北京市大兴区亦庄开发区',
    // 表箱内部布局
    meterLayout: {
      totalMeters: 6,
      meters: [
        {
          id: 'M009',
          householder: '制造企业A',
          status: '正常',
          voltage: 380.5,
          userType: '工业用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 15000,
          owingAmount: 0
        },
        {
          id: 'M010',
          householder: '制造企业B',
          status: '电表异常',
          voltage: 375.2,
          userType: '工业用户',
          paymentStatus: '欠费',
          powerType: 'B相',
          monthlyUsage: 8500,
          owingAmount: 8750.00
        },
        {
          id: 'M011',
          householder: '物流仓储',
          status: '通信中断',
          voltage: 0,
          userType: '工业用户',
          paymentStatus: '正常',
          powerType: 'C相',
          monthlyUsage: 0,
          owingAmount: 0
        }
      ]
    },
    // 电压数据
    voltageData: {
      current: 378.9,
      normal: [370, 390],
      status: '正常'
    },
    // 校验错误
    validationErrors: [
      { type: 'error', message: '高压表计校准超期', field: 'calibration' },
      { type: 'warning', message: '电流互感器温升异常', field: 'currentTransformer' }
    ]
  },
  {
    id: 'user_005',
    name: '朝阳正常表箱A',
    type: '表箱',
    longitude: 116.467428,
    latitude: 39.93423,
    address: '北京市朝阳区三里屯街道',
    // 表箱内部布局 - 全部正常
    meterLayout: {
      totalMeters: 8,
      meters: [
        {
          id: 'M020',
          householder: '刘一',
          status: '正常',
          voltage: 220.3,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 135,
          owingAmount: 0
        },
        {
          id: 'M021',
          householder: '陈二',
          status: '正常',
          voltage: 219.8,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'B相',
          monthlyUsage: 142,
          owingAmount: 0
        },
        {
          id: 'M022',
          householder: '张三',
          status: '正常',
          voltage: 220.5,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'C相',
          monthlyUsage: 128,
          owingAmount: 0
        },
        {
          id: 'M023',
          householder: '李四',
          status: '正常',
          voltage: 221.1,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 156,
          owingAmount: 0
        },
        {
          id: 'M024',
          householder: '王五',
          status: '正常',
          voltage: 220.0,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'B相',
          monthlyUsage: 118,
          owingAmount: 0
        },
        {
          id: 'M025',
          householder: '赵六',
          status: '正常',
          voltage: 219.9,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'C相',
          monthlyUsage: 165,
          owingAmount: 0
        },
        {
          id: 'M026',
          householder: '孙七',
          status: '正常',
          voltage: 220.7,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 139,
          owingAmount: 0
        },
        {
          id: 'M027',
          householder: '周八',
          status: '正常',
          voltage: 220.2,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'B相',
          monthlyUsage: 148,
          owingAmount: 0
        }
      ]
    },
    // 电压数据
    voltageData: {
      current: 220.3,
      normal: [217, 222],
      status: '正常'
    },
    // 无校验错误
    validationErrors: []
  },
  {
    id: 'user_006',
    name: '海淀正常表箱B',
    type: '表箱',
    longitude: 116.277428,
    latitude: 39.96923,
    address: '北京市海淀区学院路',
    // 表箱内部布局 - 全部正常
    meterLayout: {
      totalMeters: 6,
      meters: [
        {
          id: 'M030',
          householder: '吴九',
          status: '正常',
          voltage: 220.4,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 125,
          owingAmount: 0
        },
        {
          id: 'M031',
          householder: '郑十',
          status: '正常',
          voltage: 219.7,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'B相',
          monthlyUsage: 133,
          owingAmount: 0
        },
        {
          id: 'M032',
          householder: '冯十一',
          status: '正常',
          voltage: 220.8,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'C相',
          monthlyUsage: 147,
          owingAmount: 0
        },
        {
          id: 'M033',
          householder: '陈十二',
          status: '正常',
          voltage: 220.1,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 152,
          owingAmount: 0
        },
        {
          id: 'M034',
          householder: '褚十三',
          status: '正常',
          voltage: 219.6,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'B相',
          monthlyUsage: 141,
          owingAmount: 0
        },
        {
          id: 'M035',
          householder: '卫十四',
          status: '正常',
          voltage: 220.9,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'C相',
          monthlyUsage: 136,
          owingAmount: 0
        }
      ]
    },
    // 电压数据
    voltageData: {
      current: 220.1,
      normal: [217, 222],
      status: '正常'
    },
    // 无校验错误
    validationErrors: []
  },
  {
    id: 'user_004',
    name: '石景山居民表箱',
    type: '表箱',
    longitude: 116.207428,
    latitude: 39.91423,
    address: '北京市石景山区八角街道',
    // 表箱内部布局
    meterLayout: {
      totalMeters: 10,
      meters: [
        {
          id: 'M012',
          householder: '陈九',
          status: '正常',
          voltage: 220.1,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 120,
          owingAmount: 0
        },
        {
          id: 'M013',
          householder: '吴十',
          status: '计量异常',
          voltage: 218.5,
          userType: '居民用户',
          paymentStatus: '欠费',
          powerType: 'B相',
          monthlyUsage: 0,
          owingAmount: 89.60
        },
        {
          id: 'M014',
          householder: '郑十一',
          status: '停电',
          voltage: 0,
          userType: '居民用户',
          paymentStatus: '欠费',
          powerType: 'C相',
          monthlyUsage: 0,
          owingAmount: 567.20
        },
        {
          id: 'M015',
          householder: '王十二',
          status: '电压不稳',
          voltage: 195.8,
          userType: '居民用户',
          paymentStatus: '正常',
          powerType: 'A相',
          monthlyUsage: 95,
          owingAmount: 0
        }
      ]
    },
    // 电压数据
    voltageData: {
      current: 208.6,
      normal: [217, 222],
      status: '偏低'
    },
    // 校验错误
    validationErrors: [
      { type: 'error', message: '多个电表离线', field: 'meterOffline' },
      { type: 'error', message: '表箱接地不良', field: 'grounding' },
      { type: 'warning', message: '电表封印破损', field: 'meterSeal' }
    ]
  }
];

// 台区线损数据
export const areaLossData = [
  {
    id: 'area_001',
    name: '朝阳台区01',
    longitude: 116.457428,
    latitude: 39.92923,
    theoreticalLoss: [2.1, 2.3, 2.2, 2.4, 2.1, 2.0, 1.9],
    actualLoss: [2.8, 3.1, 2.9, 3.2, 2.7, 2.5, 2.3],
    dates: ['2024-03-01', '2024-03-02', '2024-03-03', '2024-03-04', '2024-03-05', '2024-03-06', '2024-03-07']
  },
  {
    id: 'area_002',
    name: '海淀台区01',
    longitude: 116.297428,
    latitude: 39.98923,
    theoreticalLoss: [1.8, 1.9, 1.7, 2.0, 1.9, 1.8, 1.6],
    actualLoss: [2.5, 2.7, 2.3, 2.9, 2.6, 2.4, 2.1],
    dates: ['2024-03-01', '2024-03-02', '2024-03-03', '2024-03-04', '2024-03-05', '2024-03-06', '2024-03-07']
  }
];

// 异常表计清单
export const abnormalMeters = [
  { id: 'M002', householder: '李四', address: '建国门外大街1号', type: '通信故障', lastOnline: '2024-02-15' },
  { id: 'M004', householder: '赵六', address: '建国门外大街1号', type: '数据错误', lastOnline: '2024-03-01' },
  { id: 'M005', householder: '孙七', address: '建国门外大街1号', type: '长期不上线', lastOnline: '2024-01-20' },
  { id: 'M006', householder: '周八', address: '建国门外大街1号', type: '电表故障', lastOnline: '2024-02-28' },
  { id: 'M007', householder: '餐饮店', address: '中关村大街88号', type: '通信故障', lastOnline: '2024-02-20' },
  { id: 'M008', householder: '健身房', address: '中关村大街88号', type: '电压异常', lastOnline: '2024-03-05' },
  { id: 'M010', householder: '制造企业B', address: '亦庄开发区', type: '电表异常', lastOnline: '2024-03-03' },
  { id: 'M011', householder: '物流仓储', address: '亦庄开发区', type: '通信中断', lastOnline: '2024-02-10' },
  { id: 'M013', householder: '吴十', address: '八角街道', type: '计量异常', lastOnline: '2024-02-25' },
  { id: 'M014', householder: '郑十一', address: '八角街道', type: '停电', lastOnline: '2024-02-18' },
  { id: 'M015', householder: '王十二', address: '八角街道', type: '电压不稳', lastOnline: '2024-03-04' }
];