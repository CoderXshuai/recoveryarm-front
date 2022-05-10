const xChartDom = document.getElementById('xAngle');
let xChart = echarts.init(xChartDom, 'dark');
let xOption;

xOption = {
    tooltip: {
        trigger: 'axis'
    },
    backgroundColor: '',
    legend: {
        data: ['大臂', '小臂']
    },
    grid: {
        left: '5%',
        right: '10%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        name: '时间(s)',
        boundaryGap: false,
        data: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7']
    },
    yAxis: {
        type: 'value',
        name: '角度(°)',
        show: false
    },
    series: [
        {
            name: '大臂',
            type: 'line',
            stack: '角度',
            data: []
        },
        {
            name: '小臂',
            type: 'line',
            stack: '角度',
            data: []
        },
    ]
};
xOption && xChart.setOption(xOption);

const yChartDom = document.getElementById('yAngle');
let yChart = echarts.init(yChartDom, 'dark');
let yOption;

yOption = {
    tooltip: {
        trigger: 'axis'
    },
    backgroundColor: '',
    legend: {
        data: ['大臂', '小臂']
    },
    grid: {
        left: '5%',
        right: '10%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        name: '时间(s)',
        boundaryGap: false,
        data: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7']
    },
    yAxis: {
        type: 'value',
        name: '角度(°)',
        show: false
    },
    series: [
        {
            name: '大臂',
            type: 'line',
            stack: '角度',
            data: []
        },
        {
            name: '小臂',
            type: 'line',
            stack: '角度',
            data: []
        },
    ]
};
yOption && yChart.setOption(yOption);

const zChartDom = document.getElementById('zAngle');
let zChart = echarts.init(zChartDom, 'dark');
let zOption;

zOption = {
    tooltip: {
        trigger: 'axis'
    },
    backgroundColor: '',
    legend: {
        data: ['大臂', '小臂']
    },
    grid: {
        left: '5%',
        right: '10%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        name: '时间(s)',
        boundaryGap: false,
        data: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7']
    },
    yAxis: {
        type: 'value',
        name: '角度(°)',
        show: false
    },
    series: [
        {
            name: '大臂',
            type: 'line',
            stack: '角度',
            data: []
        },
        {
            name: '小臂',
            type: 'line',
            stack: '角度',
            data: []
        },
    ]
};
zOption && zChart.setOption(zOption);