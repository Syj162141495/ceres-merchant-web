<template>
  <div class="project_page">
    <div class="self-buying">
      <h2>
        自购分佣
        <span>（开启后分销员会同自己绑定关系，自购会给自己返佣，上级也会获得间接分佣）</span>
      </h2>
      <span class="switch">自购分佣</span>
      <el-radio-group v-model="form.ifSelf" @change="ruty">
        <el-radio :label="1">开启</el-radio>
        <el-radio :label="0">关闭</el-radio>
      </el-radio-group>
    </div>
    <div class="level_content">
      <h2>
        分销员等级
        <span>（满足规则后分销员自动升级、等级编号越大，级别越高）</span>
      </h2>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="levelNum" label="等级编号">
          <template slot-scope="scope">
            <el-input v-if="scope.row.add || scope.row.edit" v-model="form.levelNum" />
            <span v-else>{{ scope.row.levelNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="levelName" label="等级名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.add || scope.row.edit" v-model="form.levelName" />
            <span v-else>{{ scope.row.levelName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="升级规则">
          <template slot-scope="scope">
            <div v-if="scope.row.add || scope.row.edit" class="level-up-rule">
              <el-checkbox-group v-model="form.conditions">
                <el-checkbox :label="1" class="checkList">
                  <el-row>
                    <el-col :span="16">累计直接分销金额满</el-col>
                    <el-col :span="8">
                      <el-col :span="20">
                        <el-input v-model="form.conditionMoney" />
                      </el-col>
                      <el-col :span="4">
                        <span style="font-size:14px;">元</span>
                      </el-col>
                    </el-col>
                  </el-row>
                </el-checkbox>
                <el-checkbox :label="2" class="checkList">
                  <el-row>
                    <el-col :span="16">邀请下级满</el-col>
                    <el-col :span="8">
                      <el-col :span="20">
                        <el-input v-model="form.conditionInvitation" />
                      </el-col>
                      <el-col :span="4">
                        <span style="font-size:14px;">人</span>
                      </el-col>
                    </el-col>
                  </el-row>
                </el-checkbox>
                <el-checkbox :label="3" class="checkList">
                  <el-row>
                    <el-col :span="16" style="width: 58%;">客户满</el-col>
                    <el-col :span="8">
                      <el-col :span="20">
                        <el-input v-model="form.conditionCustomer" />
                      </el-col>
                      <el-col :span="4">
                        <span style="font-size:14px;">人</span>
                      </el-col>
                    </el-col>
                  </el-row>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-else>
              <div
                v-if="scope.row.conditionMoney != null"
              >累计直接分销金额满{{ scope.row.conditionMoney }}元</div>
              <div
                v-if="scope.row.conditionInvitation != null"
              >邀请下级满{{ scope.row.conditionInvitation }}人</div>
              <div v-if="scope.row.conditionCustomer != null">客户满{{ scope.row.conditionCustomer }}人</div>
              <!-- <div>{{scope.row.rule}}</div> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="directProportion" label="直接分佣比例">
          <template slot-scope="scope">
            <div v-if="scope.row.add || scope.row.edit">
              <el-col :span="20">
                <el-input v-model="form.directProportion" maxlength="2" />
              </el-col>
              <el-col :span="4">%</el-col>
            </div>
            <span v-else>{{ scope.row.directProportion + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="indirectProportion" label="间接分佣比例">
          <template slot-scope="scope">
            <div v-if="scope.row.add || scope.row.edit">
              <el-col :span="20">
                <el-input v-model="form.indirectProportion" maxlength="2" />
              </el-col>
              <el-col :span="4">%</el-col>
            </div>
            <span v-else>{{ scope.row.indirectProportion + '%' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.edit || scope.row.add"
              type="text"
              size="small"
              @click.native.prevent="save(scope.row)"
            >保存</el-button>
            <el-button v-else type="text" size="small" @click.native.prevent="edit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.edit || scope.row.add"
              type="text"
              size="small"
              @click.native.prevent="cancel(scope.row)"
            >取消</el-button>
            <el-button
              v-else
              type="text"
              size="small"
              @click.native.prevent="deletes(scope.row.distributorLevelId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" class="subm" @click="add">添加等级</el-button>
    </div>
  </div>
</template>

<script>
import {
  levelGetAll,
  levelAdd,
  levelGetById,
  levelUpdate,
  levelDelete,
  levelUpdateSelf
} from '@/api/distributor'
export default {
  data() {
    return {
      config: {
        selfBuyReturnCommisionFlag: 2,
        id: ''
      },
      tableData: [],
      form: {
        ifSelf: '',
        type: [],
        levelName: '',
        levelNum: 1,
        conditionMoney: '',
        conditionInvitation: '',
        conditionCustomer: '',
        conditions: [],
        directProportion: '',
        indirectProportion: ''
      }
    }
  },
  created() {
    this.getSalesLevel()
  },
  methods: {
    async getSalesLevel() {
      const res = await levelGetAll({
      })
      if (res.code === '') {
        this.tableData = res.data
        this.form.ifSelf = res.data[0].ifSelf
      }
    },
    async ruty(index) {
      console.log(index)
      const res = await levelUpdateSelf({
        ifSelf: index
      })
      if (res.code === '') {
        this.$message.success('成功')
      }
    },
    add() {
      const _ = this
      //   if (_.form.add || _.form.edit) {
      //     return _.$message.warning('请先保存或取消上一个操作')
      //   }
      _.form.add = true
      _.tableData.push(_.form)
    },
    save(item) {
      const _ = this
      console.log(_.form)
      const params = Object.assign({}, _.form)
      // params.rule.conditionMoney = _.form.rule.conditionMoney * 100;
      const value = _.form.levelNum
      if (isNaN(value) || !/^[0-9]{1,7}$/.test(value) || parseInt(value) < 1 || parseInt(value) > 1000000) {
        this.$message.error('等级编号必须在1~1000000之间')
        return
      }
      if (!item.distributorLevelId) {
        delete params.add
        delete params.type
        levelAdd(params).then(res => {
          if (res.code === '') {
            _.$message.success('新增成功')
            _.getSalesLevel()
            _.reset()
          }
        })
      } else {
        levelUpdate(_.form).then(res => {
          if (res.code === '') {
            _.getSalesLevel()
            _.reset()
            _.$message.success('修改成功')
          }
        })
      }
    },
    async edit(item) {
      // var _ = this
      const t = this.tableData
      if (this.form.add || this.form.edit) {
        return this.$message.warning('请先保存或取消上一个操作')
      }
      const res = await levelGetById({
        distributorLevelId: item.distributorLevelId
      })
      this.form.type = []
      this.form = res.data
      this.form.edit = true
      t.forEach((ob, i) => {
        if (ob.distributorLevelId === item.distributorLevelId) {
          this.$set(t, i, this.form)
        }
      })
    },
    reset() {
      this.form = {
        ifSelf: '',
        type: [],
        levelName: '',
        conditionMoney: '',
        conditionInvitation: '',
        conditionCustomer: '',
        conditions: [],
        directProportion: '',
        indirectProportion: ''
      }
    },
    cancel(item) {
      this.reset()
      this.getSalesLevel()
    },
    deletes(distributorLevelId) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const _ = this
          levelDelete({ distributorLevelId }).then(res => {
            _.getSalesLevel()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='less' scoped>
.checkList {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
h2 {
  font-size: 24px;
  font-weight: 500;
  position: relative;
  padding-left: 40px;
  margin: 20px 0;
  &::before {
    content: "";
    height: 24px;
    width: 4px;
    background-color: #3a68f2;
    position: absolute;
    left: 30px;
    top: 2px;
    display: block;
  }
  span {
    font-size: 14px;
    color: #9a9a9a;
  }
}
.self-buying {
  margin-bottom: 40px;
  .switch {
    margin: 0 20px 0 40px;
  }
}

.level_content {
  .subm {
    width: 100px;
    height: 48px;
    margin-top: 15px;
    border-radius: 4px;
  }

  .level-up-rule {
    width: 288px;
    overflow-x: scroll;
  }
}

::v-deep .el-table {
  th {
    background: #eef3ff;
    color: #333333;
    font-size: 16px;
    font-weight: 400;
    border-color: #e0e5eb;
    // text-align: center;
  }
  td {
    font-size: 14px;
    // text-align: center;
    color: #666666;
  }
}

::v-deep .el-dialog__wrapper {
  .el-dialog__header {
    height: 70px;
    background-color: #3a68f2;
    .el-dialog__title {
      font-size: 24px;
      color: #fff;
    }
  }
}

::v-deep .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.el-col-8,
.el-row {
  display: flex;
  align-items: center;
  text-align: left;
}
.el-col-4 {
  padding-left: 10px;
}
.el-checkbox__inner {
  width: 30px;
  height: 30px;
}
::v-deep .el-checkbox__inner {
  width: 30px;
  height: 30px;
}
::v-deep .el-checkbox__inner::after {
  height: 17px;
  left: 13px;
  top: 3px;
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #3a68f2;
  border-color: #3a68f2;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #3a68f2;
}
</style>
