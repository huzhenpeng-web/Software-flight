<template>
  <!-- 增值服务 -->
  <div class="service-container">
    <!-- 步骤条 -->
    <el-steps :active="2" align-center>
      <el-step description="乘机信息"></el-step>
      <el-step description="增值服务"></el-step>
      <el-step description="支付"></el-step>
      <el-step description="完成"></el-step>
    </el-steps>
    <div class="service_box">
      <!-- 左 -->
      <div class="left">
        <div>
          <el-alert show-icon :closable="false" title="15分钟内完成支付，即可预订成功。" type="warning" effect="dark">
          </el-alert>
        </div>
        <!-- 乘客信息 -->
        <div class="passenger_info">
          <el-card>
            <div class="card_div">
              <div class="num">1</div>
              <div class="title">成人</div>
              <div class="passenger_name">胡振鹏</div>
              <div class="id_card">
                <span>身份证</span>
                321322200205235011
              </div>
              <!-- 分割线 -->
              <div class="divider"></div>
              <!-- 联系人 -->
              <div class="contact">
                <!-- 左 -->
                <div class="contact_left">
                  <div>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-lianxiren"></use>
                    </svg>
                  </div>
                  <!-- 电话 -->
                  <div class="phone">(+86)15250721431</div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 增值服务 -->
        <div class="add-service">
          <el-card>
            <div slot="header">
              <span>增值服务</span>
            </div>
            <div>
              <span>舱位升级</span>
            </div>
          </el-card>
        </div>
        <!-- 预订须知 -->
        <div class="reserve_know">
            <div slot="reference" >
              <h2>预订须知</h2>
              <el-checkbox style="margin-top:10px;" v-model="checked">我已阅读并同意 购票须知 、机票预订须知 、行李国内运输总条件</el-checkbox>
            </div>
        </div>
        <!-- 支付按钮 -->
        <el-button @click="goPay">去支付</el-button>
      </div>
      <!-- 右 -->
      <div class="right">
        <div class="flight_info"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 单选框
      checked: false
    }
  },
  methods: {
    // 支付
    goPay () {
      if (this.checked === false) return this.$message.warning('请先阅读并勾选协议')
    }
  }
}
</script>

<style lang="less" scoped>
.service-container {
  width: 100%;
  height: 100%;
  .service_box {
    width: 90%;
    height: 80%;
    margin: 0 auto;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    .left {
      width: 65%;
      height: 100%;
      .passenger_info {
        width: 100%;
        margin-top: 30px;
        .el-card {
          width: 100%;
          .card_div {
            display: flex;
            align-items: center;
            .num {
              color: #849bab;
              width: 19px;
              height: 19px;
              line-height: 19px;
              text-align: center;
              font-weight: 600;
              background: #eaf0f3;
              font-size: 13px;
            }
            .title {
              margin-left: 15px;
              min-width: 45px;
              color: #849bab;
            }
            .passenger_name {
              min-width: 100px;
              font-weight: 600;
            }
            .id_card {
              min-width: 200px;
              span {
                color: #849bab;
              }
            }
            .divider {
              margin-left: 50px;
              height: 50px;
              width: 0;
              border-right: 1px dashed #c4cad5;
            }
            .contact {
              margin-left: 30px;
              .contact_left {
                display: flex;
                align-items: center;
                .icon {
                  width: 60px;
                  height: 50px;
                }
                .phone {
                  margin-left: 30px;
                  font-size: 13px;
                }
              }
            }
          }
        }
        .el-card:hover {
          background-color: #f2f8fe;
          cursor: pointer;
        }
      }
      .add-service {
        margin-top: 50px;
        box-shadow: 0 0 15px rgb(0 0 0 / 20%);
      }
      .reserve_know {
        margin-top: 50px;
      }
      .el-button {
        margin-top: 50px;
        width: 100%;
        background: #ff7d13;
        border-color: #ff7d13;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
      }
    }
    .right {
      width: 30%;
      height: 100%;
      border: 1px solid blue;
      .flight_info {
        width: 100%;
        height: 100%;
        background-color: #f5f8f9;
      }
    }
  }
}
</style>
