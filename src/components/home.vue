<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/img/timg.jpg" width="50" height="40" alt="">
                <span>个人网站</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button></el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航一</span>
                        </template>
                        <el-menu-item index="1-4-1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>导航一</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: []
    }
  },
  created () {
    this.getMenuList()
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
      console.log(res)
      this.menulist = res.data
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
    }
    .el-main{
        background-color: #eaedf1;
    }
    .home-container{
        height: 100%;
    }
</style>
