<template>
  <div>
    <div class="goods">
    	<div class="menu-wrapper" ref="menuWrapper">
    		<ul>
    			<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)"><!-- 如果这个li和滚动到的区域得到的索引值一致，则添加current这个类 -->
    				<span class="text border-1px">
    					<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
    				</span>
    			</li>
    		</ul>
    	</div>
    	<div class="foods-wrapper" ref="foodsWrapper">
    		<ul><!-- food-list-hook只是用来标注js选择的，并没有设置样式 -->
    			<li v-for="item in goods" class="food-list food-list-hook">
    				<h1 class="title">{{item.name}}</h1>
    				<ul>
    					<li  v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
    						<div class="icon">
    							<img width="57" height="57" :src="food.icon">
    						</div>
    						<div class="content">
    							<h2 class="name">{{food.name}}</h2>
    							<p class="desc">{{food.description}}</p>
    							<div class="extra">
    								<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
    							</div>
    							<div class="price">
    								<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
    							</div>
    							<div class="cartcontrol-wrapper">
    								<cartcontrol  :food="food"></cartcontrol>
    							</div>
    						</div>
    					</li>
    				</ul>
    			</li>
    		</ul>
    	</div>
    	<shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="ecmascript-6">
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';
const ERR_OK=0;
    export default{
    	props: {
    		seller: {
    			type: Object
    		}
    	},
    	data () {
          return {
          	goods: [],
          	listHeight: [],//存放每一个类别的区间的高度，从而获得y值，进而和左边的菜单的索引做一个映射
          	scrollY: 0,//跟踪y值变化
            selectedFood: {}
          }
    	},
    	//vue的计算属性 scroll滚动，它也会实时计算
    	computed: {
    		currentIndex () {
    			for(let i=0;i<this.listHeight.length;i++)
    			{
    				let height1= this.listHeight[i];
    				let height2= this.listHeight[i + 1];
    				if(!height2||(this.scrollY>=height1&&this.scrollY<height2))
    				{	
                        return i;
    				}
    			}
    			return 0;
    		},
    		selectFoods () {
    			let foods= [];
    			this.goods.forEach((good) => {
    				good.foods.forEach((food) => {
    					if(food.count>0)
    					{
    						foods.push(food);
    					}
    				});
    			});
    			return foods;
    		}
    	},
    	created () {
    		this.$root.eventHub.$on('cart.add', (target) => {
    			this._drop(target);//接收并执行一个函数
    		});//父组件事件接收
    		this.$http.get('/api/goods').then((response) => {
    			response = response.body;
    			if(response.errno===ERR_OK)
                {
                   //取到data。json中seller的数据
                   this.goods = response.data;
                   this.$nextTick(() => {
                   	  this._initScroll();// Dom是异步更新的，所以要借用接口nextTick让它在DOM更新后立即计算Menu的高度，然后滚动
                   	  this._calculateHeight();//计算每个区间高度
                   });
                   
                } 
    		});
    		this.classMap = ['decrease','discount','special','invoice','guarantee'];
    	},
    	methods: {
        selectFood (food, event) {
          if(!event._constructed) {
            return;
          }
          this.selectedFood= food;
          this.$refs.food.show();
        },
    		_initScroll () {
    			this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true});//实现滚动监听时阻止了默认的点击事件，所以讲click设置为true，表示可以点击
    			this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
    				click:true,
    				probeType: 3// probeType: 1：滚动的时候会派发scroll事件，会截流。2：滚动的时候实时派发scroll事件，不会截流。 3：除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件,实时监测滚动位置
    			});
    			this.foodScroll.on('scroll', (pos) => {
    				this.scrollY = Math.abs(Math.round(pos.y));//abs为取正数,滚动时实时拿到y值
    			});
          
    		},
    		_calculateHeight () {
                 let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                 let height = 0;
                 this.listHeight.push(height);
                 for(let i=0;i<foodList.length;i++) {
                 	let item = foodList[i];
                 	height += item.clientHeight;
                 	this.listHeight.push(height);
                 }
    		},
    		selectMenu (index,event) {
    			if(!event._constructed){
    				return;//电脑端会有原生的事件和batter scroll派发的事件,就会重复，而原生的点击事件没有_constructed这个属性，所以可以通过判断，将原生事件的return掉
    			}
    			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
    			let el=foodList[index];
    			this.foodScroll.scrollToElement(el,300);//better Scroll中自带的一个方法，根据元素跳转到相应位置，300为动画时间
    			
    		},
    		_drop (target) {
    			 this.$nextTick(() => {
    			 	this.$refs.shopcart.drop(target);//将从cartcontrol.vue中发射的事件对象传给shopcart.vue,通过异步执行动画避免卡顿,优化体验
    			 });
    			
    		}
    	},
    	components: {
    		"shopcart":shopcart,
    		"cartcontrol":cartcontrol,
        "food":food
    	},
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
  .goods
    display:flex
    position:absolute
    top:174px
    width:100%
    bottom:46px
    overflow:hidden
    .menu-wrapper
      flex:0 0 80px
      width:80px//安卓机需要设置一个宽度
      background:#f3f5f7
      .menu-item
        display:table
        height:54px
        width:56px
        padding:0 12px
        line-height:14px
        &.current
          position:relative
          z-index:10
          margin-top:-1px
          font-weight:700
          background:#fff
          .text
            border-none()
        .icon
          display:inline-block
          vertical-align:top
          width:12px
          height:12px
          margin-right:2px
          background-size:12px 12px
          background-repeat:no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display:table-cell
          width:56px
          vertical-align:middle
          border-1px(rgba(7,17,27,0.1))
          font-size:12px
    .foods-wrapper
      flex:1
      .title
        padding-left:14px
        height:26px
        line-height:26px
        border-left:2px soli #d9dde1
        font-size:12px
        color:rgb(147,153,159)
        background:#f3f5f7
      .food-item
        display:flex
        margin:18px
        padding-bottom:18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom:0
        .icon
          flex:0 0 57px
          margin-right:10px
        .content
          flex:1
          .name
            margin:2px 0 8px 0
            height:14px
            line-height:14px
            font-size:14px
            color:rgb(7,17,27)
          .desc,.extra
            line-height:10px
            font-size:10px
            color:rgb(147,153,159)
          .desc
            line-height:14px
            margin-bottom:8px
          .extra
            .count
              margin-right:12px
          .price
            font-weight:700
            line-height:24px
            .now
              margin-right:8px
              color:rgb(240,20,20)
            .old
              text-decoration:line-through
              font-size:10px
              color:rgb(147,153,159)
          .cartcontrol-wrapper
            position:absolute
            right:0
            bottom:12px
    

</style>
