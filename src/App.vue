<template>
  <div ><!-- v-bind:seller 缩写为:seller 将seller的数据通过prop传给组件 -->
    <v-header :seller="seller"></v-header>
   <div class="tab border-1px">
    <div class="tab-item">
      <router-link to="/goods">商品</router-link>
   <!-- 旧写法   <a v-link="{path:'/goods'}">商品</a> -->
   </div>
    <div class="tab-item">
      <router-link to="/ratings">评论</router-link>
    </div>
    <div class="tab-item">
      <router-link to="/seller">商家</router-link>
    </div>
   </div>
   <keep-alive><!-- 使用keep-alive可以保存组件的状态，从其他组件返回时会回到离开之前组件的状态 -->
     <router-view :seller="seller"></router-view>
   </keep-alive>
   
  </div>
</template>

<script type="ecmascript-6">
//导入组件
import header from './components/header/header';
import {urlParse} from './common/js/url.js'
const ERR_OK=0;
export default {
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  created () {
    //调用ajax请求，编写成功返回时的回调函数
    this.$http.get('/api/seller?id='+this.seller.id).then((response) => {
      response = response.body;//body获取的是对象，json获取的是promise类型
      if(response.errno===ERR_OK)
      {
         //取到data。json中seller的数据  通过object方法顺便得到了id的值
         this.seller = Object.assign({},this.seller,response.data);
      }
    });
  },
  components: {
    'v-header': header
  }
};
</script>
   

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  .tab
    display:flex
    width:100%
    height:40px
    line-height:40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex:1
      text-align:center
      & > a
        display:block
        font-size:14px
        color:rgb(77,85,93)
        &.active
          color:rgb(240,20,20)

</style>
