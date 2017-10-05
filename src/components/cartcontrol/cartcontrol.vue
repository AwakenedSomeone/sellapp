<template>
  <div class="cartcontrol">
  	<transition name="move">
  		<div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
  		</div>
  </transition>
  	<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
  	<div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)" ></div>
  </div>
</template>

<script type="ecmascript-6">
import Vue from 'vue';// 添加全局的Vue，通过Vue添加对象的属性，才能被观测到
  export default {
  	props: {
  		food: {
  			type: Object
  		}
  	},
  	created () {
  	},
  	methods: {
  		addCart (event) {
  			if(!event._constructed){
    				return;//电脑端会有原生的事件和batter scroll派发的事件,就会重复，而原生的点击事件没有_constructed这个属性，所以可以通过判断，将原生事件的return掉
    			}
  			if(!this.food.count) {
  				Vue.set(this.food,'count',1);//通过Vue添加对象的属性，才能被观测到,并且在这个组件添加了count属性，父组件也能检测到，可以通过父组件的computed计算选中了的food
  			}
  			else{
  				this.food.count ++;
  			}
  			this.$root.eventHub.$emit('cart.add',event.target);//子组件事件发射
  		},
  		decreaseCart (event) {
  			if(!event._constructed){
    				return;//电脑端会有原生的事件和batter scroll派发的事件,就会重复，而原生的点击事件没有_constructed这个属性，所以可以通过判断，将原生事件的return掉
    			}
  				this.food.count --;
  		}
  	}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size:0
    .cart-decrease
      display:inline-block
      padding:6px 0
      line-height:24px
      font-size:24px
      color:rgb(0,160,220)
      transition: all 0.4s linear
        //进入前先将状态设置为不可见，离开时也设置为不可见
      &.move-enter,&.move-leave-to
         opacity:0
         transform:translate3d(24px,0,0)
    .cart-count
      display:inline-block
      vertical-align:top
      width:6px
      padding:6px
      line-height:24px
      text-align:center
      font-size:10px
      color:rgb(147,153,159)
    .cart-add
      display:inline-block
      padding:6px 0
      line-height:24px
      font-size:24px
      color:rgb(0,160,220)
</style>
