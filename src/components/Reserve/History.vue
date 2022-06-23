<template>
  <!-- 机票搜索记录 -->
  <div class="history-container">
    <!-- 标题和垃圾桶 -->
    <div class="history-title">
      <span>您搜索过的机票</span>
      <i class="el-icon-delete" @click="removeHistory"></i>
    </div>
    <div class="search-history-list">
      <ul>
        <li v-for="(item,index) in searchHistory" :key="index" @click="toSelectFlight(item)">
          <!-- 头部 -->
          <div class="top">
            {{item.departcureCity}}
            <i class="el-icon-arrow-right"></i>
            {{item.arriveCity}}
          </div>
          <!-- 底部 -->
          <div class="bottom">
            {{item.departcureDate}}
          </div>
        </li>
      </ul>
    </div>
    <el-alert title="暂无历史记录" type="warning" v-show="isShow">
    </el-alert>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      searchHistory: [],
      isShow: true
    }
  },
  methods: {
    ...mapMutations(['saveReserveFlight', 'saveReserveForm']),
    // 移除历史记录
    removeHistory () {
      this.$confirm('是否清除搜索历史记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.localStorage.removeItem('searchHistory')
          this.searchHistory = []
          this.isShow = true
          this.$message.success('清除成功!')
        })
        .catch(err => {
          this.$message.info(err)
        })
    },
    // 跳转到选择机票页面
    async toSelectFlight (item) {
      try {
        this.saveReserveForm(item)
        window.sessionStorage.setItem('reserveForm', JSON.stringify(item))
        this.$router.push(`/reserve/selectFlight?depart=${item.departcureCity}&arrive=${item.arriveCity}&date=${item.departcureDate}`)
      } catch (e) {
        this.$message.error('发起请求失败')
      }
    }
  },
  mounted () {
    // 从本地取出搜索历史 赋值
    if (localStorage.getItem('searchHistory')) {
      this.searchHistory = JSON.parse(localStorage.getItem('searchHistory'))
      this.isShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.history-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  .history-title {
    margin-left: 16px;
  }
  .el-alert {
    margin-top: 15px;
  }
  .el-icon-delete {
    cursor: pointer;
    margin-left: 30px;
  }
  .search-history-list {
    ul {
      list-style: none;
      margin-top: 30px;
      li {
        background: #fff;
        float: left;
        padding: 16px;
        border-radius: 6px;
        cursor: pointer;
        box-shadow: 0 4px 16px 1px rgb(0 0 0 / 6%);
        margin: 0 0 0 16px;
        height: 76px;
        width: 269px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .bottom {
          font-size: 12px;
          font-weight: 400;
          color: #999;
          margin-top: 10px;
        }
      }
      li:hover {
        box-shadow: 0 0 15px rgb(0 0 0 / 20%);
      }
    }
  }
}
</style>
