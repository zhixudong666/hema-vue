<template>
    <div class="category">
        <el-container>
            <el-container>
                <el-aside width="auto" style="background-color: #fff;padding:10px 0 0 10px;">
                    <div class="custom-tree-container">
                        <div class="block">
                            <el-tree
                                    :data="categories"
                                    node-key="id"
                                    ref = "tree"
                                    highlight-current
                                    :expand-on-click-node="false"
                            >
                        <span class="custom-tree-node" slot-scope="{ node, categories }">
                            <span class="tree-span-left" @click="()=>edit(categories,node)">{{ node.label}}</span>
                            <span  class="tree-span-right" style="margin-left:40px; ">
                                <el-button
                                        v-if="node.level < 3"
                                        type="text"
                                        size="mini"
                                        @click="()=>append(categories,node)"
                                >
                                         添加
                                </el-button>
                                <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => remove(categories,node)">
                                    删除
                                </el-button>
                            </span>
                        </span>
                            </el-tree>
                        </div>
                    </div>
                </el-aside>
                <el-main>
                    <el-form ref="form" label-width="100px">
                        <el-form-item label="分类ID">
                            <el-input v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="分类标题名">
                            <el-input v-model="form.name" placeholder="请输入分类标题名"></el-input>
                        </el-form-item>
                        <el-form-item label="上一级ID">
                            <el-input v-model="form.parent_id" placeholder="请输入上一级ID"></el-input>
                        </el-form-item>
                        <el-form-item label="标题级别">
                            <el-select v-model="form.level" placeholder="请选择标题级别">
                                <el-option  label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="图片上传">
                            <el-upload
                                    class="upload-demo"
                                    name="file"
                                    :on-success="fileSuccess"
                                    :on-remove="handleRemove"
                                    action="/api/admin/category/getImg"
                                    :file-list="fileList"
                                    list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submit()">提交</el-button>
                            <el-button @click="reset()">重置</el-button>
                        </el-form-item>

                    </el-form>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
    import axios from 'axios';
    import qs from 'qs';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    let id = 1000;
    export default{
        data(){
            return{
                categories: [],
                parents:[],
                form: {
                    id:0,
                    name: '',
                    parent_id:'',
                    level:'',
                    file:''
                },
                fileList: []
            }
        },
        computed: {

        },
        methods: {
            //点击添加label
            edit(categories,node){
                // console.log(node);
                this.form.id = node.data.id;
                this.form.name = node.data.label;
                if(node.parent.parent == null){
                    this.form.parent_id = 0;
                }else{
                    this.form.parent_id = node.parent.data.id;
                }
                this.form.level = node.level;
            },
            //
            handleRemove(file, fileList) {
                this.form.file ="";

            },
            //重置
            reset(){
                this.form = {};
            },
            //提交
            submit(){
                if(this.form.id == null || this.form.name == "" || this.form.parent_id == "" || this.form.level == "" || this.form.file == "")
                {
                    this.$message({
                        showClose: true,
                        message: '请将信息填写完整',
                        type: 'warning'
                    });
                }else{
                    axios.get('/api/admin/category/judgeId?id='+this.form.id,{
                            headers:{
                                "content-Type":'application/x-www-form-urlencoded:charset=UTF-8'
                            }
                        }
                    ).then(res=>{
                        console.log(res);
                        if(res.data === 0) {
                            console.dir(this.form);
                            axios.post('/api/admin/category/getInfo?' + qs.stringify(this.form),
                                {
                                    headers: {
                                        "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'
                                    }
                                }
                            ).then(res => {
                                console.log(res);
                                this.get();
                            }).then(error => {
                                console.log(error);
                            });
                        }else if(res.data === 1){
                            this.$confirm('此操作将修改原有分类, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                axios.post('/api/admin/category/getInfo?' + qs.stringify(this.form),
                                    {
                                        headers: {
                                            "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'
                                        }
                                    }
                                ).then(res => {
                                    if(res.status === 200)
                                    {
                                        this.$message({
                                            type: 'success',
                                            message: '修改成功!'
                                        });
                                    }
                                    this.get();
                                })
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '取消修改!'
                                });
                            });
                        }
                    });
                }

            },
            getParents(){
                axios('/api/admin/category/getParents').then(res=>{
                    this.parents = res.data;
                })
            },
            //图片上传
            fileSuccess(file,response){
                if(response.status == 'success'){
                    this.fileList.push({url:response.url,name:response.name});
                    this.form.file = response.url;
                }
            },
            append(node,categories) {
                const newChild = {level:categories.level+1, parent_id:categories.data.id};
                axios.post('/api/admin/category/add?'+qs.stringify(newChild),
                    {
                        headers:{
                            "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
                        }
                }).then(res=>{
                    if(res.status ===200)
                    {
                        this.$message({
                            showClose:true,
                            message:"添加成功",
                            type:'success'
                        })
                    }
                    this.get();
                }).catch(err=>{
                    console.log(err);
                })
            },
            //删除
            remove(node, categories) {
                console.log(categories);
                var children = {};
                if(categories.childNodes.length>0){
                    var childNodes = categories.childNodes;
                    for(let key in childNodes){
                        children[key] = childNodes[key];
                    }
                }

                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //发送请求进行删除
                    axios.get('/api/admin/category/remove',
                        {
                            headers:{
                                "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
                            },
                            params:{
                                id:categories.data.id,
                                parent_id:categories.parent.id,
                                level:categories.level
                            }
                        }
                    ).then(res=>{
                        console.log("接收");
                        console.dir(res);
                        this.get();
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            get: function () {
                axios('/api/admin/category/all').then(res => {
                    var length = res.data.length-1;
                    var sid = res.data[length].id;
                    this.form.id = sid+1;
                    let fn =  id => {
                        let r = [];
                        res.data.forEach( v => {
                            if(v.parent_id === id){
                                let o = {
                                    id: v.id,
                                    label: v.name,
                                };
                                let children = fn(v.id);
                                if(children.length){
                                    o.children = children
                                }
                                r.push(o);
                            }
                        });
                        return r;
                    };
                    this.categories = fn(0);
                })
            }
        },
        mounted: function () {
            this.get();
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
    .category{
        width: 100%;
        height: 100%;
        padding:10px 0 10px 20px;
    }
    .el-header{
        background-color: #409EFF;
        color: #333;
        line-height: 60px;
    }
    .el-aside {
        background-color: #DCDFE6;
        color: #333;
        overflow-y: hidden;
        overflow-x: auto;
        padding-top:15px!important;
    }
    .el-main {
        background-color: #fff;
        color: #333;
    }
    .custom-tree-node{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>