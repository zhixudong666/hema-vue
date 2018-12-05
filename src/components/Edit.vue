<template>
    <div id=" add">
        <el-container>
            <el-header>
                <span class="add-title">商品编辑</span>
            </el-header>
            <el-main>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="商品分类">
                        <el-select v-model="c1" placeholder="请选择分类" @change="change1($event)">
                            <el-option v-for="(value,key) in r" :label="value.name" :value="value.id" :key="key"></el-option>
                        </el-select>
                        <el-select v-if="c2" v-model="c2" placeholder="请选择分类" @change="change2($event)">
                            <el-option v-for="(value,key) in r2" :label="value.name" :value="value.id" :key="key"></el-option>
                        </el-select>
                        <el-select v-if="c3" v-model="c3" placeholder="请选择分类" @change="change3">
                            <el-option v-for="(value,key) in r3" :label="value.name" :value="value.id" :key="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.qty" placeholder="请输入商品数量"></el-input>
                    </el-form-item>
                    <el-form-item label="商品原价">
                        <el-input v-model="form.price" placeholder="请输入商品原价"></el-input>
                    </el-form-item>
                    <el-form-item label="商品特价">
                        <el-input v-model="form.special_price" placeholder="请输入商品特价"></el-input>
                    </el-form-item>
                    <el-form-item label="商品图片">
                        <el-upload
                                class="upload-demo"
                                action="/api/admin/product/getImg"
                                name="file"
                                :on-success = "fileSuccess"
                                :on-remove="handleRemove"
                                :file-list="fileList"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="商品描述">
                        <el-input type="textarea" v-model="form.short_description" placeholder="请输入商品描述"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button @click = "cancelBtn">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import axios from 'axios';
    import qs from 'qs'
    export default {
        data() {
            return {
                form: {
                    id:0,
                    name: '',
                    category:'',
                    qty:'',
                    price:'',
                    special_price:'',
                    short_description:'',
                    file:""
                },
                r:[],//一级分类
                r2:[],//二级分类
                r3:[],//三级分类
                c1:'',
                c2:'',
                c3:'',
                fileList:[],
                listData:{},
                category:[]
            }
        },
        methods: {
            handleRemove(file, fileList) {//图片移除
                this.form.file = "";
            },
            fileSuccess(file,res){//图片上传成功
                console.log(file);
                this.form.file = res.url;
            },
            cancelBtn()
            {
                this.$message({
                    showClose:true,
                    message:'取消添加',
                    type:'warning'
                });
                this.$router.push('/list');
            },
            onSubmit() {
                if(this.form.name === "" || this.form.category === "" || this.form.qty === "" || this.form.price === "" || this.form.special_price === "" || this.form.short_description === "" || this.form.file === "")
                {
                    this.$message({
                        showClose: true,
                        message: '请将信息填写完整',
                        type: 'warning'
                    });
                }else {//提示是否继续操作
                    this.$confirm('是否继续修改?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        axios.post('/api/admin/product/update?'+qs.stringify(this.form),{
                            headers:{
                                "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
                            }
                        }).then(res=>{
                            console.log(res);
                            if(res.status === 200)
                            {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$router.push('/list');
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }

            },
            getCategory(){
                axios.get('/api/admin/category/getParents').then(res=>{
                        if(res.status === 200){
                            this.$message({
                                message: '成功获取分类数据！',
                                type: 'success'
                            });
                            let arr = [];
                            res.data.forEach(v=>{
                                let o = {
                                    id:v.id,
                                    name:v.name
                                };
                                arr.push(o);
                            });
                            this.r = arr;
                            console.log(this.r);
                        }else{
                            this.$message.error('获取分类数据失败！');
                        }
                    }
                )
            },
            getInfo(id)
            {
                axios.get('/api/admin/product/getInfo?id='+id,{
                    headers:{
                        "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
                    }
                }).then(res=>{
                    let listData = res.data[0];
                    console.log(listData);
                    this.form.name = listData.name;
                    this.form.qty = listData.qty;
                    this.form.price = listData.price;
                    this.form.special_price = listData.special_price;
                    this.form.short_description = listData.short_description;
                    this.form.file = listData.image;
                    let list = {name:`${listData.name}.png`,url:listData.image};
                    this.fileList.push(list);
                    let arr = listData.category.split(',');
                    for(let i=0;i<arr.length;i++)
                    {
                        if(!isNaN(arr[i])){
                            this.category.push(parseInt(arr[i]));
                        }
                    }
                    console.log(this.category[0]);
                    console.log(this.category[1]);
                    console.log(this.category[2]);
                    if(this.category[0] !== undefined)
                    {
                        this.c1 = this.category[0];
                        this.change1(this.c1);
                    }
                    if(this.category[1] !== undefined)
                    {
                        this.c2 = this.category[1];
                        this.change2(this.c2);
                    }
                    if(this.category[2] !== undefined)
                    {
                        this.c3 = this.category[2];
                        this.change3();
                    }
                })
            },
            change1(event){
                this.form.category = this.c1.toString();
                axios.get('/api/admin/category/getSecond?parent_id='+event,
                    {
                        headers:{
                            "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
                        }
                    }).then(res=>{
                    this.r2 = res.data;
                    console.log(this.r2);
                })
            },
            change2(event){
                this.form.category += ',' + this.c2.toString();
                axios.get('/api/admin/category/getSecond?parent_id='+event,
                    {
                        headers:{
                            "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
                        }
                    }).then(res=>{
                    this.r3 = res.data;
                })
            },
            change3(){
                this.form.category += ',' + this.c3.toString();
            }
        },
        mounted:function () {
            this.form.id = this.$route.params.id;
            this.getInfo(this.form.id);
            this.getCategory();
        }
    }
</script>
<style>
    *{
        padding: 0;
        margin:0;
        text-decoration: none;
        list-style: none;
    }
    #add{
        width: 100%;
        height: 100%;
    }
    .el-header{
        line-height: 60px;
    }
    .add-title{
        font-size: 20px;
        margin-left:10px;
    }
    .el-header{
        background: #fff;
    }
</style>