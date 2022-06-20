<template>
  <!-- 测试城市选择器 -->
  <div class="city-container">
    <!-- 输入框 -->
    <div>
        <el-autocomplete  @select="handleSelect" style="width:200px;" @blur="isShowCity = false" @click.native="displayCity" clearable  v-model="city" :fetch-suggestions="querySearch" placeholder="请输入城市" :trigger-on-focus="false"></el-autocomplete>
    </div>
    <!-- 城市选择器 -->
    <div class="city-picker-wraper" v-show="isShowCity" ref="cityRef">
      <ul class="city-picker-tabs">
        <li v-for="(item,index) in cityTabs" :key="index" @click="changeCity(index)" :class="{'active':isActived == index}">{{item}}</li>
      </ul>
      <div class="city-picker-body">
        <!-- 热门城市 -->
        <ul class="cities" v-show="isHotCity" style="height:172px;">
          <li v-for="(item,index) in hotCity[0][1]" :key="index" @click="chooseCity(item)">{{item}}</li>
        </ul>
        <!-- 分类城市 -->
        <div class="domestic-city-item" v-show="isDivideCity" v-for="(item,index) in cities" :key="index">
          <div class="city-character">{{item[0][0]}}</div>
          <ul class="cities domestic-city-content">
            <li v-for="(i,index) in item[1]" :key="index" @click="chooseCity(i)">{{i}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cityQuery } from '@/api/query'
import city from '@/assets/js/city.js'
export default {
  data () {
    return {
      isShowCity: false,
      city: '',
      // 热门城市
      hotCity: city.cities,
      // 按照字母划分
      divideCity: city.cityArray,
      cityTabs: ['热门', 'ABCDEF', 'GHIJ', 'KLMN', 'PQRSTUVW', 'XYZ'],
      isHotCity: true,
      cities: [],
      // 分类的城市
      isDivideCity: false,
      isClick: false,
      // 被激活的tab
      isActived: 0
    }
  },
  methods: {
    displayCity () {
      this.isShowCity = true
    },
    async querySearch (queryString, cb) {
      this.isShowCity = false
      const { data: res } = await cityQuery(queryString)
      const recommendCities = []
      res.data.forEach(item => {
        const city = { value: item.cityName + '(' + item.cityCode + ')', cityName: item.cityName, cityCode: item.cityCode }
        recommendCities.push(city)
      })
      cb(recommendCities)
    },
    changeCity (index) {
      this.isActived = index
      switch (index) {
        case 0:
          this.isHotCity = true
          this.isDivideCity = false
          break
        case 1:
          this.isHotCity = false
          this.cities = this.divideCity[1]
          this.isDivideCity = true
          break
        case 2:
          this.isHotCity = false
          this.cities = this.divideCity[2]
          this.isDivideCity = true
          break
        case 3:
          this.isHotCity = false
          this.cities = this.divideCity[3]
          this.isDivideCity = true
          break
        case 4:
          this.isHotCity = false
          this.cities = this.divideCity[4]
          this.isDivideCity = true
          break
        case 5:
          this.isHotCity = false
          this.cities = this.divideCity[5]
          this.isDivideCity = true
          break
      }
    },
    // 选择城市
    chooseCity (item) {
      this.city = item
      this.isShowCity = false
      this.$emit('transfer', this.city)
    },
    handleSelect (e) {
      this.$emit('transfer', e.cityName)
    }
  },
  watch: {
    isShowCity (newVal) {
      if (newVal === true) {
        this.$refs.cityRef.onmousedown = event => {
          event.preventDefault && event.preventDefault()
          return false
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.city-picker-wraper {
  width: 665px;
  display: inline-block;
  vertical-align: top;
  background: #fff;
  margin-top: 15px;
  box-shadow: 0 7px 22px -7px rgb(0 0 0 / 34%);
  position: fixed;
  z-index: 99;
  ul {
    list-style-type: none;
  }
  .city-picker-tabs {
    width: 100%;
    border-bottom: 1px solid #e6e6e6;
    height: 55px;
    line-height: 55px;
    color: #333;
    display: flex;
    justify-content: space-around;
    li {
      margin-left: 32px;
      position: relative;
      display: inline-block;
      font-size: 14px;
      height: 55px;
      line-height: 55px;
      text-align: left;
      margin-right: 0;
    }
    li:hover {
      color: #0086f6;
      font-weight: 500;
      bottom: -1px;
      display: block;
      cursor: pointer;
    }
    .active {
      border-bottom: 2px solid #0086f6;
      color: #0086f6;
    }
  }
  .city-picker-body {
    width: 100%;
    float: left;
    .cities {
      padding: 20px 30px 24px 32px;
      width: 100%;
      li {
        padding: 0 2px 0 8px;
        width: 84px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #333;
        float: left;
        position: relative;
      }
      li:hover {
        cursor: pointer;
        color: #0086f6;
        border-radius: 4px;
        background: rgba(0, 134, 246, 0.05);
      }
    }
    ::v-deep .domestic-city-item:first-child {
      padding-top: 24px;
    }
    .domestic-city-item {
      padding-left: 32px;
      width: 100%;
      .city-character {
        width: 26px;
        display: inline-block;
        line-height: 32px;
        vertical-align: top;
        font-weight: 600;
      }
      .domestic-city-content {
        padding: 0;
        display: inline-block;
        width: 598px;
      }
    }
  }
}
</style>
