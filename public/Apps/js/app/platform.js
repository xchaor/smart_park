
    // 图表
    function PeopleChat() {
        var myChart = echarts.init(document.getElementById('EtcherPerson'));
        // 指定图表的配置项和数据
        var data = [
            {value: 3367.5, name: '员工'},
            {value: 1459.25, name: '访客'},
            {value: 6398.25, name: '安保'},
        ]
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 20,
                top :50,
                itemGap:30,
                itemWidth: 10,  // 设置宽度
                itemHeight: 10, // 设置高度
                icon: "circle",
                formatter:  (name)=>{
                    let total = 0;
                    let target;
                    for (let i = 0, l = data.length; i < l; i++) {
                        total += data[i].value;
                        if (data[i].name == name) {
                            target = data[i].value;
                        }
                    }
                    let arr = [
                        '{a|'+name+'}',
                        '{b|'+((target/total)*100).toFixed(2)+'%}'
                    ]
                    return arr.join('')
                },
                textStyle:{
                    rich:{
                        a:{
                            fontSize:14,
                            verticalAlign:'top',
                            fontWeight:600,
                            align:'center',
                            color: '#fff',

                        },
                        b:{
                            fontSize:14,
                            align:'center',
                            padding:[0,0,0,40],
                            color: '#fff',
                        }
                    }
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    avoidLabelOverlap: false,
                    center:['30%','55%'],
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {value: 3367.5, name: '员工', itemStyle: { color: '#00CC99' }},
                        {value: 1459.25, name: '访客', itemStyle: { color: '#0078FF' }},
                        {value: 6398.25, name: '安保', itemStyle: { color: '#FF8700' }},
                    ]
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    // 柱状图
    function MoneyChat() {
        var myChart = echarts.init(document.getElementById('EtcherMoney'));
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: [{
                type: 'category',
                data: ['房屋空间', '电子设备', '生产设备', '办公设备'],
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.12)'
                    }
                },
                axisLabel: {
                    margin: 10,
                    color: '#e2e9ff',
                    textStyle: {
                        fontSize: 14
                    },
                },
            }],
            yAxis: [{
                name: '单位：万元',
                axisLabel: {
                    formatter: '{value}',
                    color: '#e2e9ff',
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,1)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0)'
                    }
                }
            }],
            series: [{
                type: 'pictorialBar',
                data: [3600, 2711, 3548, 4362],
                symbol: 'rectangle',
                barWidth: '20px',
                itemStyle: {
                    normal: {
                    color:function (params) {
                        var colorList =  ['#FF8700','#0078FF','#00CC99','#FF0000',];
                        return colorList[params.dataIndex]
                    }
                    }
                },
                label: {
                    normal: {
                        show: true,
                        lineHeight: 30,
                        width: 80,
                        height: 30,
                        position: ['-23', '-30'],
                        distance: 1,
                        formatter: [
                            ' {a|{c}}     \n',

                        ].join(','),
                        rich: {
                            a: {
                                color: '#fff',
                                align: 'center',
                            },
                        }
                    }
                }
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //动态仪表盘
    function MoveChat(){
        var myChart = echarts.init(document.getElementById('MoveChat'));
        let angle = 0;//角度，用来做简单的动画效果的
        let value = 55.33;
        var option = {
            title: {
                text: '{a|'+ value +'}{c|%}',
                x: 'center',
                y: 'center',
                textStyle: {
                    rich:{
                        a: {
                            fontSize: 18,
                            color: '#29EEF3'
                        },
                        c: {
                            fontSize: 14,
                            color: '#ffffff',
                            // padding: [5,0]
                        }
                    }
                }
            },
            legend: {
                type: "plain",
                orient: "vertical",
                right: 0,
                top: "10%",
                align: "auto",
                data: [{
                    name: '涨价后没吃过',
                    icon: "circle"
                }, {
                    name: '天天吃',
                    icon: "circle"
                }, {
                    name: '三五天吃一次',
                    icon: "circle"
                }, {
                    name: '半个月吃一次',
                    icon: "circle"
                }],
                textStyle: {
                    color: "white",
                    fontSize: 16,
                    padding: [10, 1, 10, 0]
                },
                selectedMode:false
            },
            series: [ {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
                            startAngle: (0+angle) * Math.PI / 180,
                            endAngle: (90+angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#0CD3DB",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
                            startAngle: (180+angle) * Math.PI / 180,
                            endAngle: (270+angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#0CD3DB",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                            startAngle: (270+-angle) * Math.PI / 180,
                            endAngle: (40+-angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#00CC99",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                            startAngle: (90+-angle) * Math.PI / 180,
                            endAngle: (220+-angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#00CC99",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
                    let point = getCirlPoint(x0, y0, r, (90+-angle))
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4
                        },
                        style: {
                            stroke: "#0CD3DB",//粉
                            fill: "#0CD3DB"
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",  //绿点
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
                    let point = getCirlPoint(x0, y0, r, (270+-angle))
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4
                        },
                        style: {
                            stroke: "#0CD3DB",      //绿
                            fill: "#0CD3DB"
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: '吃猪肉频率',
                type: 'pie',
                radius: ['58%', '45%'],
                silent: true,
                clockwise: true,
                startAngle: 90,
                z: 0,
                zlevel: 0,
                label: {
                    normal: {
                        position: "center",

                    }
                },
                data: [{
                    value: value,
                    name: "",
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#00CC99' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#28E8FA' // 100% 处的颜色
                                }]
                            },
                        }
                    }
                },
                    {
                        value: 100-value,
                        name: "",
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: "#173164"
                            }
                        }
                    }
                ]
            },
            ]
        };

        //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
        function getCirlPoint(x0, y0, r, angle) {
            let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
            let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
            return {
                x: x1,
                y: y1
            }
        }

        function draw(){
            angle = angle+3
            myChart.setOption(option, true)
            //window.requestAnimationFrame(draw);
        }

        setInterval(function() {
            //用setInterval做动画感觉有问题
            draw()
        }, 100);

    }

    //动态仪表盘2
    function MoveChatNum() {
        var myChart = echarts.init(document.getElementById('MoveChatNum'));
        let angle = 0;//角度，用来做简单的动画效果的
        let value = 72.43;
        var option = {
            title: {
                text: '{a|'+ value +'}{c|%}',
                x: 'center',
                y: 'center',
                textStyle: {
                    rich:{
                        a: {
                            fontSize: 18,
                            color: '#FF8700'
                        },
                        c: {
                            fontSize: 14,
                            color: '#ffffff',
                            // padding: [5,0]
                        }
                    }
                }
            },
            legend: {
                type: "plain",
                orient: "vertical",
                right: 0,
                top: "10%",
                align: "auto",
                data: [{
                    name: '涨价后没吃过',
                    icon: "circle"
                }, {
                    name: '天天吃',
                    icon: "circle"
                }, {
                    name: '三五天吃一次',
                    icon: "circle"
                }, {
                    name: '半个月吃一次',
                    icon: "circle"
                }],
                textStyle: {
                    color: "white",
                    fontSize: 16,
                    padding: [10, 1, 10, 0]
                },
                selectedMode:false
            },
            series: [ {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
                            startAngle: (0+angle) * Math.PI / 180,
                            endAngle: (90+angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#0CD3DB",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
                            startAngle: (180+angle) * Math.PI / 180,
                            endAngle: (270+angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#0CD3DB",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                            startAngle: (270+-angle) * Math.PI / 180,
                            endAngle: (40+-angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#0CD3DB",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                            startAngle: (90+-angle) * Math.PI / 180,
                            endAngle: (220+-angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#0CD3DB",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
                    let point = getCirlPoint(x0, y0, r, (90+-angle))
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4
                        },
                        style: {
                            stroke: "#0CD3DB",//粉
                            fill: "#0CD3DB"
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: "ring5",  //绿点
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function(params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
                    let point = getCirlPoint(x0, y0, r, (270+-angle))
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4
                        },
                        style: {
                            stroke: "#0CD3DB",      //绿
                            fill: "#0CD3DB"
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                name: '吃猪肉频率',
                type: 'pie',
                radius: ['58%', '45%'],
                silent: true,
                clockwise: true,
                startAngle: 90,
                z: 0,
                zlevel: 0,
                label: {
                    normal: {
                        position: "center",

                    }
                },
                data: [{
                    value: value,
                    name: "",
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#FF8700' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FF8700' // 100% 处的颜色
                                }]
                            },
                        }
                    }
                },
                    {
                        value: 100-value,
                        name: "",
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: "#173164"
                            }
                        }
                    }
                ]
            },
            ]
        };

//获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
        function getCirlPoint(x0, y0, r, angle) {
            let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
            let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
            return {
                x: x1,
                y: y1
            }
        }

        function draw(){
            angle = angle+3
            myChart.setOption(option, true)
            //window.requestAnimationFrame(draw);
        }

        setInterval(function() {
            //用setInterval做动画感觉有问题
            draw()
        }, 100);
    }

