<template>
    <div class="order">
        <el-container>
            <el-main>
                <el-button class="backto" type="primary" round @click="backto">返回订单</el-button>
                <!--收货人信息-->
                <h1 class="order-title">收货人信息</h1>
                <el-table stripe style="width:1080px;" :data="userData">
                    <el-table-column label="收货人" prop="receiver_name" width="180">

                    </el-table-column>
                    <el-table-column label="手机号" prop="phone" width="180">

                    </el-table-column>
                    <el-table-column label="收货地址" prop="address" width="720">

                    </el-table-column>
                </el-table>
                <!--商品信息-->
                <h1 class="order-title">商品信息</h1>
                <el-table stripe style="width:1080px;" :data="productData">
                    <el-table-column label="商品名称" prop="name" width="180">

                    </el-table-column>
                    <el-table-column label="商品描述" prop="short_description" width="180">

                    </el-table-column>
                    <el-table-column label="商品单价" prop="special_price" width="180">

                    </el-table-column>
                    <el-table-column label="购买数量" prop="count" width="180">

                    </el-table-column>
                    <el-table-column label="配送费" prop="freight" width="180">

                    </el-table-column>
                    <el-table-column label="商品总价" prop="total" width="180">

                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import axios from "axios";
    export default {
        data(){
            return {
                order_id:0,
                userData:[],
                productData:[]
            }
        },
        methods:{
            //返回订单页
            backto:function(){
                this.$router.push("/Order");
            },
            fetchData:function(order_id){
                axios({
                    method:"GET",
                    url:"/api/admin/Order/getProductInfo?order_id="+order_id,
                    header:"Content-Type: application/json"
                }).then(res=>{
                    console.log(res);
                    var arr = [];
                    for(let i in res.data){
                        var pdata = res.data[i];
                        // arr[i] = res.data[i];
                        var total = Math.ceil(pdata.special_price * pdata.count) + pdata.freight;
                        var obj = {
                            name:pdata.name,
                            special_price:pdata.special_price,
                            short_description:pdata.short_description,
                            count:pdata.count,
                            freight:pdata.freight,
                            total:total
                        };
                        arr.push(obj);
                    }
                    this.productData = arr;
                    console.log(this.productData);
                })
            }
        },
        mounted:function(){
            this.order_id = parseInt(this.$route.params.order_id);
            var obj = {
                receiver_name :this.$route.params.receiver_name,
                phone:this.$route.params.phone,
                address:this.$route.params.address
            };
            this.userData[0] = obj;
            this.fetchData(this.$route.params.id);
        }
    }
</script>
<style>
    @import url("../assets/css/order.css");
    .backto{
        margin-left:10px;
        margin-bottom:20px;
    }
</style>