<template>
    <div class="user">
        <el-container>
            <el-main>
                <!--用户信息-->
                <h1 class="user-title">用户信息</h1>
                <el-table :data="userInfo" style="">
                    <el-table-column
                        prop=""
                        label="用户名"
                        width="180"
                    ></el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import axios from "axios";
    export default {
        data() {
            return {
                userInfo:[]
            }
        },
        methods: {
            fetchData:function(){
                axios.get('/api/admin/UserInfo/getUserInfo').then(res=>{

                })
            }
        },
        mounted: function () {
            this.fetchData();
        }
    }
</script>
<style>
    .user{
        width: 100%;
        height: 100%;
    }
    .el-container{
        width: 100%;
        height: 100%;
    }
    .user-title{
        font-size: 16px;
        padding-left:10px;
        margin-bottom:10px;
    }
</style>