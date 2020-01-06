<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/img/timg.jpg" width="50" height="40" alt="">
                <span>个人网站</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button></el-header>
        <el-container>
            <el-aside  :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff"
                         unique-opened
                        :collapse="isCollapse"
                         :collapse-transition="false"
                            router
                            :default-active="activePath"    >
                    <el-submenu :index="item._id +''"  v-for="item in menulist" :key="item._id">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem._id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main><router-view></router-view></el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      // eslint-disable-next-line standard/object-curly-even-spacing
      const { data: res } = await this.$http.get('/api/getList')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res.lists)
      this.menulist = res.lists
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FFF;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center;
    }
}
    .el-aside{
        background-color: #333744;
        .el-menu{
            border-right:none
        }
    }
    .el-main{
        background-color: #eaedf1;
    }
    .home-container{
        height: 100%;
    }
    .toggle-button{
        background-color:#4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
