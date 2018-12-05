<template>
    <div class="comment">
        <!-- 搜索条件 -->
        <div class="section">
            <el-row :gutter="20">
                <!--评论类型检索-->
                <el-col :span="4">
                    <el-select v-model="value1" placeholder="请选择" size="mini">
                        <el-option
                                v-for = "item in status"
                                :key = item.value
                                :label =item.label
                                :value = item.value>
                        </el-option>
                    </el-select>
                </el-col>
                <!-- 日期检索 -->
                <el-col :span="10">
                    <el-date-picker
                            v-model="value2"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="mini"
                    >
                    </el-date-picker>
                </el-col>
                <!--查询和刷新按钮-->
                <el-col :span="3">
                    <el-button size="mini" @click="search" icon="el-icon-search" circle></el-button>

                    <el-button size="mini" @click="refresh" icon="el-icon-refresh" circle></el-button>

                </el-col>
            </el-row>
        </div>
        <!--评论表-->
        <el-table
                :data="tableData"
                style="width: 100%">
            <!--隐藏id这一列-->
            <el-table-column
                    fixed
                    prop="id"
                    label="评论ID"
                    v-if="0"
            >
            </el-table-column>
            <el-table-column
                    fixed
                    prop="nickname"
                    label="用户名"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="评价类型"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="product_name"
                    label="评价对象"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="order_num"
                    label="订单号"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="date"
                    label="日期"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="is_reply"
                    label="评价状态 "
                    width="120">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="auto">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="section">
            <el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :current-page="page"
                    :page-sizes="[4,50,100, 200, 300, 400]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total" style="text-align: center;">
            </el-pagination>
        </div>
        <!--查看对话框-->
        <el-dialog title="评论详情:" :visible.sync="dialogFormVisible">

            <div class="reply">
                <p>
                    {{replyText}}
                </p>
            </div>
            <el-form :model="form">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入回复内容"
                            v-model="answerContent">
                    </el-input>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import axios from 'axios';
    import qs from 'qs';
    export default {
        data() {
            return {
                // 当前页数
                page: 1,
                // 一页显示几个
                pageSize: 4,
                // 总条数
                total: 0,
                //是否搜索
                s:false,
                tableData: [],
                status:[
                    {
                        value:1,
                        label:"好评"
                    },
                    {
                        value:0,
                        label:"中评"
                    },
                    {
                        value:-1,
                        label:"差评"
                    }
                ],
                filter:"",
                value1:"",
                value2: [],
                dialogFormVisible: false,
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                formLabelWidth: '40px',
                replyText:"",
                answerContent:""
            }
        },
        methods: {
            // 改变当前页
            handleCurrentChange(val) {
                this.page = val;
                if(this.s){
                    this.search();
                }else{
                    this.fetchData();
                }
            },
            // 改变每页显示条数
            handleSizeChange(val) {
                this.pageSize = val;
                if(this.s){
                    this.search();
                }else{
                    this.fetchData();
                }
            },
            refresh(){
                this.s = false;
                this.fetchData();
                this.value1 = "",
                this.value2 = []
            },
            //搜索
            search(){
                this.s = true;
                // 判断是否有搜索内容
                if(this.value2.length == 0 && this.value1 === "")
                {
                    this.$message({
                        message: '请输入搜索内容',
                        type: 'warning'
                    });
                }else{
                    var time1 = "0000-00-00";
                    var time2 = "0000-00-00";
                    var rate = 100;
                    if(this.value2.length > 0)
                    {

                        time1 = this.value2[0].getFullYear()+"-"+this.value2[0].getMonth()+"-"+this.value2[0].getDate();
                        time2 = this.value2[1].getFullYear()+"-"+this.value2[1].getMonth()+"-"+this.value2[1].getDate();
                    }
                    if(this.value1 !== "")
                    {
                        rate = parseInt(this.value1);
                    }
                    var arr = {rate:rate,time1:time1,time2:time2,page:this.page,pageSize:this.pageSize};
                    axios.get('/api/admin/comment/search?'+qs.stringify(arr)).then(res=>{
                        if(res.status == 200)
                        {
                            this.tableData = [];
                            axios.get('/api/admin/comment/getSum?'+qs.stringify(arr)).then(res=>{
                                if(res.status == 200)
                                {
                                    this.total = res.data;
                                }
                            });
                            this.getList(res);
                        }
                    })
                }

            },
            // 查看
            handleClick(row) {

                let id = row.id;
                axios.get('/api/admin/comment/getContent?id='+id).then(res=>{
                    this.replyText = res.data[0]['content'];
                    this.dialogFormVisible = true;
                })
            },
            fetchData(){
                // // 当前页数page,一页显示几个pageSize
                axios.get('/api/admin/comment/getInfo?page='+this.page+'&pageSize='+this.pageSize).then(
                    res=>{
                        if(res.status === 200)
                        {
                            this.tableData = [];
                            //总条数
                            axios.get('/api/admin/comment/getNumber').then(res=>{
                                this.total = res.data;
                            });
                            // console.log(this.total);
                            this.getList(res);
                        }
                    }
                )
            },
            getList(res){
                res.data.forEach((item,index)=>{
                    let sta = "";
                    switch (item.status) {
                        case 0:
                            sta = "中评";
                            break;
                        case -1:
                            sta = "差评";
                            break;
                        case 1:
                            sta = "好评";
                            break;
                    }
                    //获取商品名称
                    axios.get('/api/admin/comment/getName?id='+item.product_id,{
                        headers:{
                            "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
                        }
                    }).then(res=>{
                        let arr = {
                            id:item.id,
                            nickname: item.nickname,
                            status: sta,
                            product_name: res.data[0]['name'],
                            order_num: item.order_num,
                            date: item.create_time,
                            is_reply: item.is_reply?"已回复":"未回复"
                        };
                        this.tableData.push(arr);
                    });
                });
            }
        },
        mounted:function(){
            this.fetchData();
        }
    }
</script>
<style>
    *{
        margin:0;
        padding:0;
        box-sizing: border-box;
    }
    html,body{
        width: 100%;
        height: 100%;
    }
    .comment{
        width: 100%;
        height: 100%;
        padding:10px 20px 10px 20px;
    }
    .section{
        margin:40px 0 40px 0;
    }
    .reply{
        width: 100%;
        min-height: 100px;
        margin-bottom:20px;
        border-radius: 4px;
        border:1px solid rgba(28, 28, 28, 0.2);
        max-height: 200px;
        overflow: auto;
    }
</style>