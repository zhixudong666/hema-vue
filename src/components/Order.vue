<template>
    <div class="order">
        <el-container>
            <el-main>
                <!--订单信息-->
                <h1 class="order-title">订单信息</h1>
                <el-table stripe style="width:1080px;" :data="orderData">
                    <el-table-column label="订单号" prop="order_sn" width="180">

                    </el-table-column>
                    <el-table-column label="订单状态" prop="order_status" width="180">
                        <!--0 待支付，1 已支付 ，2 正在发货，3 已签收-->
                    </el-table-column>
                    <el-table-column label="下单时间" prop="add_time" width="180">

                    </el-table-column>
                    <el-table-column label="付款时间" prop="pay_time" width="180">

                    </el-table-column>
                    <el-table-column label="订单总额(元)" prop="order_price" width="180">

                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="GetInfo(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 50, 100, 200]"
                            :page-size="currentSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import axios from "axios";
    export default {
        data() {
            return {
                total:1,
                currentPage:1,
                currentSize:10,
                orderData: [],
                order:[],
                catalog:1
            }
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.currentSize = val;
                this.orderData = [];
                this.fetchData();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                this.orderData = [];
                this.fetchData();
            },
            // 获取订单信息
            getdetails:function(){
                axios.get(`/api/admin/order/getIndex?currentSize=${this.currentSize}&currentPage=${this.currentPage}`).then(res=>{
                    var arr = res.data;
                    console.log(arr);
                    for(let i in arr) {
                        switch(arr[i].order_status){
                            case 0:
                                arr[i].order_status = "待支付";
                                break;
                            case 1:
                                arr[i].order_status = "待配送";
                                break;
                            case 2:
                                arr[i].order_status = "待收货";
                                break;
                            case 3:
                                arr[i].order_status = "待评价";
                                break;
                            case 4:
                                arr[i].order_status = "全评价";
                        }
                        this.orderData.push(arr[i]);
                    }
                })
            },
            //获取订单数量
            gettotal:function(){
                axios.get('/api/admin/order/gettotal').then(res=>{
                    this.total = res.data;
                })
            },
            fetchData:function(){
                this.getdetails();
                this.gettotal();
            },
            GetInfo:function(e){
                this.order.push(e);
                this.$router.push({
                    name:'orderInfo',
                    params:e
                });
            }
        },
        mounted: function () {
            this.fetchData();
        }
    }
</script>
<style>
    @import url("../assets/css/order.css");
</style>