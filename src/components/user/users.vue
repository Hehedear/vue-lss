<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search"
                                   @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true" >
                        添加用户
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username">
                </el-table-column>
                <el-table-column label="密码" prop="password">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.mg_state"
                                @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row._id)" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row._id)"   size="mini"></el-button>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting"  size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
        >
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed">
            <el-form :rules="editformRules" ref="editformRef" :model="editform" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editform.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="editform.password" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      userlist: [],
      addDialogVisible: false,
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }, {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15字符之间',
            trigger: 'blur'
          }
        ]
      },
      addForm: {
        username: '',
        password: ''
      },
      editDialogVisible: false,
      editform: {},
      editformRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/api/users', { params: this.queryInfo })
      this.total = res.total
      // if (res !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data
      console.log(res)
    },
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged (userinfo) {
      console.log(userinfo)
      let params = {
        _id: userinfo._id,
        mg_state: userinfo.mg_state
      }
      const { data: res } = await this.$http.put('api/users', params)
      console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('api/register', this.addForm)
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('添加用户失败！')
          return
        }
        // eslint-disable-next-line no-unreachable
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog (id) {
      this.editDialogVisible = true
      console.log(id)
      let params = {
        _id: id
      }
      const { data: res } = await this.$http.get('api/selectusers', { params: params })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editform = res.users[0]
      console.log(res.users)
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo () {
      // eslint-disable-next-line no-unused-vars
      let params = {
        _id: this.editform._id,
        username: this.editform.username
      }
      this.$refs.editformRef.validate(async valid => {
        console.log(valid)
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        const { data: res } = await this.$http.put('api/updateName', params)
        console.log(res)
        console.log(res.meta)
        if (res.meta.status !== 200) {
          return this.$message.error('修改错误，重名')
        }
        this.editDialogVisible = false
        this.$message.success('修改成功')
        this.getUserList()
      })
    },
    async removeUserById (id) {
      let params = {
        _id: id
      }
      console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('api/delusers', params)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>
<style scoped>
</style>
