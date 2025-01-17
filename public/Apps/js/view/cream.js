var ViewCreamTab = [
  {
    createDate: "2020-12-24 09:24:02",
    guid: 1,
    name: "平台首页",
    camera: [
      {
        name: "position",
        x: -2860401.998961159,
        y: 4647911.3582443865,
        z: 3290051.593758717,
      },
      {
        name: "direction",
        x: 0.47922165584962234,
        y: 0.34431653488892916,
        z: -0.80733681222079,
      },
      {
        name: "up",
        x: -0.28808449018203647,
        y: 0.9305840731336283,
        z: 0.2258774210641289,
      },
      {
        name: "right",
        x: 3.8323859789821855,
        y: -0.392942086675947,
        z: 6.281135661747449,
      },
    ],
    cameraUse: {
      1: {
        x: 3.8323859789821855,
        y: -0.392942086675947,
        z: 6.281135661747449,
      },
    },
  },
  {
    createDate: "2020-12-24 09:24:42",
    guid: 2,
    name: "智能运维",
    camera: [
      {
        name: "position",
        x: -2860282.475916122,
        y: 4648018.387409761,
        z: 3289832.575771457,
      },
      {
        name: "direction",
        x: 0.3722585586497512,
        y: 0.14066158827485553,
        z: -0.9174082423305369,
      },
      {
        name: "up",
        x: -0.2948651006421709,
        y: 0.955162922047812,
        z: 0.026802327666977422,
      },
      {
        name: "right",
        x: 3.624531879388149,
        y: -0.5708281056433893,
        z: 6.281546513763912,
      },
    ],
    cameraUse: {
      2: {
        x: 3.624531879388149,
        y: -0.5708281056433893,
        z: 6.281546513763912,
      },
    },
  },
  {
    "createDate": "2021-01-07 16:39:28",
    "guid": 6,
    "name": "视屏监控",
    "camera": [
      {
        "name": "position",
        "x": -2860650.2393050482,
        "y": 4648798.200531053,
        "z": 3290434.0223016366
      },
      {
        "name": "direction",
        "x": 0.37512388108008726,
        "y": -0.7692580406242945,
        "z": -0.5172273588841604
      },
      {
        "name": "up",
        "x": -0.8960522854837177,
        "y": -0.44383071996230505,
        "z": 0.01022710600063764
      },
      {
        "name": "right",
        "x": 1.5740682671521897,
        "y": -1.4870289171725748,
        "z": 0.03553126112047433
      }
    ],
    "cameraUse": {
      "6": {
        "x": 1.5740682671521897,
        "y": -1.4870289171725748,
        "z": 0.03553126112047433
      }
    }
  },
  {
    createDate: "2020-12-25 15:35:22",
    guid: 6,
    name: "人员监控",
    camera: [
      {
        name: "position",
        x: -2860281.9513820577,
        y: 4648397.967243365,
        z: 3289509.141491309,
      },
      {
        name: "direction",
        x: 0.11451749096500467,
        y: -0.8021103566356985,
        z: 0.5860927571987499,
      },
      {
        name: "up",
        x: -0.43560732434666843,
        y: 0.48968565863455266,
        z: 0.7552841946599841,
      },
      {
        name: "right",
        x: 0.3492010784502142,
        y: -0.33769688351839555,
        z: 0.0010796037236460165,
      },
    ],
    cameraUse: {
      6: {
        x: 0.3492010784502142,
        y: -0.33769688351839555,
        z: 0.0010796037236460165,
      },
    },
  },
  {
    createDate: "2020-12-24 09:26:07",
    guid: 5,
    name: "基础功能",
    camera: [
      {
        name: "position",
        x: -2860460.0441363403,
        y: 4647858.934372558,
        z: 3290059.595445425,
      },
      {
        name: "direction",
        x: 0.5719452590519661,
        y: 0.4377375700117411,
        z: -0.693732254150112,
      },
      {
        name: "up",
        x: -0.2928802074723687,
        y: 0.8989446284182873,
        z: 0.32576024789536534,
      },
      {
        name: "right",
        x: 3.990418231869057,
        y: -0.30207973817020894,
        z: 6.280848402226688,
      },
    ],
    cameraUse: {
      5: {
        x: 3.990418231869057,
        y: -0.30207973817020894,
        z: 6.280848402226688,
      },
    },
  },
  {
    "createDate": "2021-01-07 15:59:59",
    "guid": 6,
    "name": "告警设备",
    "camera": [
      {
        "name": "position",
        "x": -2860553.9186936878,
        "y": 4647651.646305307,
        "z": 3290447.9795361394
      },
      {
        "name": "direction",
        "x": 0.5443448467377175,
        "y": 0.38730649441799325,
        "z": -0.7440983585600334
      },
      {
        "name": "up",
        "x": -0.2776486961355331,
        "y": 0.9202223335439392,
        "z": 0.27586601527043064
      },
      {
        "name": "right",
        "x": 3.9325718412166504,
        "y": -0.3554884520180144,
        "z": 6.280930787838599
      }
    ],
    "cameraUse": {
      "6": {
        "x": 3.9325718412166504,
        "y": -0.3554884520180144,
        "z": 6.280930787838599
      }
    }
  }
];
function ViewTab(i) {
  flyToPoint(ViewCreamTab[i]);
}
