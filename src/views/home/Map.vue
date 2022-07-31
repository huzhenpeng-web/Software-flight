<template>
  <div class="map-box">
    <!-- 航线地图 -->
    <div class="map">
      <div class="map-title">
        <div class="city">
          出发城市:
          <div class="left">
            <City ref="city" @transfer="getMapCity"></City>
          </div>
        </div>
      </div>
    </div>
    <div id="line">
      <div ref="mapBox" id="airLine"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { mapQuery } from '@/api/query'
import City from '@/components/city/City.vue'
import '@/assets/js/china.js'
import moment from 'moment'
import * as echarts from 'echarts'
export default {
  components: {
    City
  },
  data () {
    return {
      planePath:
        'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
      mapCity: '',
      // cityData
      cityData: [],
      // 经纬度
      geoCoordMap: {},
      // 城市图片地址
      imgUrl: {}
    }
  },
  methods: {
    ...mapMutations(['updateActivePath']),
    async getMapCity (val) {
      const _this = this
      this.mapCity = val
      const { data: res } = await mapQuery(val)
      if (res.resultCode === 200) {
        _this.cityData = []
        _this.geoCoordMap = {}
        _this.imgUrl = {}
        console.log(res)
        let arr = []
        res.data.forEach(item => {
          arr = []
          const obj1 = {
            name: item.name
          }
          arr[0] = obj1
          const obj2 = {
            name: item.arriveCityName,
            value: 100
          }
          arr[1] = obj2
          if (obj2.name !== '') {
            _this.cityData.push(arr)
          }
          if (item.arriveCityName) {
            _this.geoCoordMap[item.arriveCityName] = [parseFloat(item.longitude), parseFloat(item.latitude)]
            _this.imgUrl[item.arriveCityName] = [item.cityPic]
          } else {
            _this.geoCoordMap[item.name] = [parseFloat(item.longitude), parseFloat(item.latitude)]
          }
        })
        // 调用map组件方法
        setTimeout(() => {
          this.handleLine()
        }, 10)
      } else {
        this.$message.warning('此航班暂时无行程推荐,请重新选择其他航班。')
      }
    },
    loca () {
      const series = []
      const _this = this
      ;[['南京', this.cityData]].forEach((item, i) => {
        series.push(
          {
            type: 'lines', // 用于带有起点和终点信息的线数据的绘制，主要用于地图上的航线，路线的可视化。
            zlevel: 1,
            effect: {
              // 线特效的配置
              show: true,
              period: 6, // 特效动画的时间
              trailLength: 0.7, // 特效尾迹的长度。取从 0 到 1 的值，数值越大尾迹越长。
              color: '#fff',
              symbolSize: 3 // 特效标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示高和宽，例如 [20, 10] 表示标记宽为20，高为10。
            },
            lineStyle: {
              normal: {
                color: '#46bee9',
                width: 0,
                curveness: 0.2 // 边的曲度，支持从 0 到 1 的值，值越大曲度越大
              }
            },
            data: this.convertData(item[1]) // 线数据集。
          },
          {
            type: 'lines',
            zlevel: 2,
            symbol: ['none', 'arrow'], // 线两端的标记类型，可以是一个数组分别指定两端
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: this.planePath,
              symbolSize: 15
            },
            lineStyle: {
              color: '#46bee9',
              width: 1,
              opacity: 0.6,
              curveness: 0.2
            },
            data: this.convertData(item[1])
          },
          {
            type: 'effectScatter', // 带有涟漪特效动画的散点（气泡）图。利用动画特效可以将某些想要突出的数据进行视觉突出。
            coordinateSystem: 'geo', // 该系列使用的坐标系
            zlevel: 2,
            rippleEffect: {
              // 涟漪特效相关配置
              brushType: 'stroke'
            },
            label: {
              // 图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等
              show: true,
              position: 'right',
              formatter: '{b}'
            },
            symbolSize: function (val) {
              // 标记的大小
              return val[2] / 8
            },
            itemStyle: {
              color: '#46bee9'
            },
            data: item[1].map(dataItem => {
              return {
                name: dataItem[1].name,
                value: _this.geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              }
            })
          }
        )
      })
      return series
    },
    convertData (data) {
      const res = []
      for (let i = 0; i < data.length; i++) {
        const dataItem = data[i]
        const fromCoord = this.geoCoordMap[dataItem[0].name] // 始发地
        const toCoord = this.geoCoordMap[dataItem[1].name] // 目的地
        const picUrl = this.imgUrl[dataItem[1].name] // 图片地址
        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord], // 一个包含两个到多个二维坐标的数组。在 polyline 设置为 true 时支持多于两个的坐标。
            picUrl: picUrl
          })
        }
      }
      return res
    },
    createLine (seriesData) {
      const that = this
      const myChart = echarts.init(document.getElementById('airLine'))
      myChart.setOption({
        backgroundColor: '#404a59', // 设置整体背景色
        title: {
          // 标题设置
          text: '今日地图航线推荐',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontFamily: 'Monospace',
            fontWeight: 'lighter'
          }
        },
        geo: {
          // 地理坐标系组件用于地图的绘制，支持在地理坐标系上绘制散点图，线集。
          map: 'china', // 配置中国地图
          roam: true, // 是否开启鼠标缩放和平移漫游
          zoom: 1,
          itemStyle: {
            areaColor: '#323c48', // 设置区域颜色
            borderColor: '#404a59' // 设置各各省市边界颜色
          },
          emphasis: {
            show: true,
            itemStyle: {
              areaColor: '#2a333d'
            },
            // 省份的名称颜色
            label: {
              color: '#fff'
            }
          }
        },
        series: seriesData,
        // 鼠标hover到航线上显示数据
        tooltip: {
          show: true,
          formatter: function (data) {
            const now = moment().format('YYYY-MM-DD')
            data.data.time = now
            // 返回该航线的数据
            if (data.data.name) {
              return data.data.name
            }
            // return data.data.fromName + '-' + data.data.toName
            return `<div style="width: 302px;
                      height: 149px;
                      border-radius: 20px;
                      padding:20px 23px;
                      box-sizing: border-box;
                     ">
                      <div style="font-size:25px;">${data.data.toName}</div>
                      <div style="margin-top:12px">
                          <div class="bottom"
                            style=" display: flex;
                            justify-content: flex-start;
                            align-items: center;"
                          >
                            <div class="left"
                              style="width: 129px;
                              height: 68px;
                              "
                            >
                                <img style="width:100%;height:100%" src="${data.data.picUrl}" alt="">
                            </div>
                            <div class="right"
                            style="color: #3196fa;
                                  display: flex;
                                  margin-left:16px;
                                  height: 68px;
                                  justify-content: space-between;
                                  flex-direction: column;
                                  font-size: 12px;
                                  padding:5px 0"
                            >
                            <span>出发城市:${data.data.fromName}</span>
                            <span>抵达城市:${data.data.toName}</span>
                            <span>出发日期:${data.data.time}</span>
                            </div>
                          </div>
                      </div>
              </div>`
          }
        }
      })
      myChart.on('click', function (param) {
        console.log(param)
        if (param.data) {
          const now = moment().format('YYYY-MM-DD')
          console.log(param) // 这里根据param填写你的跳转逻辑
          that.updateActivePath('/reserve')
          that.$router.push(`/reserve/selectFlight?depart=${param.data.fromName}&arrive=${param.data.toName}&date=${now}`)
        }
      })
    },
    handleLine () {
      this.createLine(this.loca())
    }
  },
  mounted () {
    this.$refs.city.city = '南京'
    this.getMapCity('南京')
    setTimeout(() => {
      this.handleLine()
    }, 10)
  }
}
</script>

<style lang="less" scoped>
#line{
  height: 90%;
}
#airLine {
  height: 100%;
  margin-top:20px;
}

.map-box{
  height: 100%;
}

.map {
  .map-title {
    display: flex;
    align-items: center;
    .city {
      width: 25%;
      display: flex;
      align-items: center;
      font-size: 17px;
      .left {
        margin-left: 10px;
      }
    }
  }
}
</style>
