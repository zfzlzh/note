# 1.placeholder样式调整

```css
input::-webkit-input-placeholder{
    color:#46cefd;
}
input::-moz-placeholder{   
    /* Mozilla Firefox 19+ */
    color:#46cefd;
}
input:-moz-placeholder{    
    /* Mozilla Firefox 4 to 18 */
     color:#46cefd;
}
input:-ms-input-placeholder{  
    /* Internet Explorer 10-11 */ 
     color:#46cefd;
}
```

# 2.溢出隐藏

```css
 	overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
//nowrap整合成一行，直到<br />前都不会换行
//pre-wrap  保留空白符序列，正常换行
//pre   保留空白符序列  与<pre>标签行为类似，可与<pre>标签合用实现#1的效果
//pre-line  合并空白符序列，但保留换行符
#1保留textarea的换行，并且每一行超过父元素的宽度时溢出隐藏显示...
```

![image-20200709141643780](C:\Users\zfz\AppData\Roaming\Typora\typora-user-images\image-20200709141643780.png)#1

# 3.字体渐变色

```css
 background-image: -webkit-linear-gradient(bottom,#EFFBFE,#6FD6FA,#EFFBFE);
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
```

# 4.input type=number 去除滚轮改变数字

```css
@mousewheel.native.prevent
```

## 去除上下箭头

```css
input[type=number]::-webkit-inner-spin-button,  
input[type=number]::-webkit-outer-spin-button {  
    -webkit-appearance: none;
    appearance: none; 
    margin: 0; 
}
input[type="number"] {
    -moz-appearance: textfield;
}
```

# 5.去除点击后出现的线条（非边框）

```css
.xxx{
	outline:0
}
```

# 6.css绘制图形

## 对话框

```css
.alertDialog {
			/* 对话框：一个圆角矩形和一个小三角形 */
			width: 150px;
			height: 100px;
			background: #f00;
			border-radius: 10px;
			position: relative;
		}
		.alertDialog:before {
			content: "";
			width: 0;
			height: 0;
			position: absolute;
		        left: -20px;
		        top: 40px;
			border-top: 10px solid transparent;
		        border-bottom: 10px solid transparent;
		        border-right: 20px solid #f00;	
		}
```

## 水滴

```css
//水滴
.xx{
 	margin-top: 50px;
    width: 4em;
     height: 4em;
    border-radius: 80% 0 55% 50% / 55% 0 80% 50%;
    background-color: #07C;
   transform: rotate(135deg);
}		
```

## 四边形

```css
.rhomb {
			/* 菱形 */
			width: 100px;
			height: 100px;
			background: #f00;
			transform: rotate(45deg);
		}
		.parallelogram {
			/* 平行四边形 */
			width: 200px;
			height: 100px;
			background: #f00;
			transform: skew(-20deg);
		}
		.trapezoid {
			/* 梯形 */
			width: 100px;
			height: 0;
			border-bottom: 100px solid #f00;
			border-left: 50px solid transparent;
			border-right: 50px solid transparent;
		}
```

## 三角

```css
.triangle-up {
			/* 三角形 */
			width: 0;
			height: 0;
			border-left: 50px solid transparent;
    		border-right: 50px solid transparent;
        	border-bottom: 100px solid #f00;
}
		.triangle-down {
			/* 倒三角 */
			width: 0;
			height: 0;
			border-left: 50px solid transparent;
    		        border-right: 50px solid transparent;
        	        border-top: 100px solid #f00;
		}
		.triangle-left {
			/* 左三角 */
			width: 0;
			height: 0;
			border-top: 50px solid transparent;
    		        border-bottom: 50px solid transparent;
        	        border-right: 100px solid #f00;
		}
		.triangle-right {
			/* 右三角 */
			width: 0;
			height: 0;
			border-top: 50px solid transparent;
    		        border-bottom: 50px solid transparent;
        	        border-left: 100px solid #f00;
		}
		.triangle-topleft {
			/* 左上三角 */
			width: 0;
			height: 0;
    		        border-right: 100px solid transparent;
        	        border-top: 100px solid #f00;
		}
		.triangle-topright {
			/* 右上三角 */
			width: 0;
			height: 0;
			border-left: 100px solid transparent;
        	        border-top: 100px solid #f00;
		}
		.triangle-downleft {
			/* 左下三角 */
			width: 0;
			height: 0;
    		        border-right: 100px solid transparent;
        	        border-bottom: 100px solid #f00;
		}
		.triangle-downright {
			/* 右下三角 */
			width: 0;
			height: 0;
			border-left: 100px solid transparent;
        	        border-bottom: 100px solid #f00;
}
```

## 圆形相关

```css
.oval {
			/* 椭圆 */
			width: 200px;
			height: 100px;
			background: #f00;
			border-radius: 100px / 50px;
		}
		.sector {
			/* 扇形 */
			width: 0;
			height: 0;
			border-left: 50px solid transparent;
    		        border-right: 50px solid transparent;
        	        border-top: 100px solid #f00;
        	        border-radius: 50%;
		}
		.ring {
			/* 圆环 */
			width: 100px;
			height: 100px;
			border: 5px solid #f00;
			border-radius: 50%;
		}
		.crescent {
			/* 月牙 */
			width: 100px;
			height: 100px;
			border-radius: 50%;
			box-shadow: 20px 20px 0 0 #f00;
}
```

## 十二角星

```css
.starTwelve {
			/* 十二角星：三个正方形，旋转角度 */
			width: 100px;
			height: 100px;
			background: #f00;
			position: relative;
		}
		.starTwelve:before {
			content: "";
			width: 100px;
			height: 100px;
			background: #f00;
			position: absolute;
			top: 0;
			left: 0;
			transform: rotate(-30deg)
		}
		.starTwelve:after {
			content: "";
			width: 100px;
			height: 100px;
			background: #f00;
			position: absolute;
			top: 0;
			left: 0;
			transform: rotate(30deg)
		}
```

## 五角六角八角星

```css
.starFive {
			/* 五角星： */
			width: 0;
			height: 0;
			position: relative;
			border-left: 80px solid transparent;
			border-right: 80px solid transparent;
			border-bottom: 60px solid #f00;
			transform: rotate(35deg);
		}
		.starFive:before {
			content: "";
			position: absolute;
			width: 0;
			height: 0;
			border-left: 80px solid transparent;
			border-right: 80px solid transparent;
			border-bottom: 60px solid #f00;
			transform: rotate(-70deg);
			top: 3px;
			left: -80px;
		}
		.starFive:after {
			content: "";
			position: absolute;
			width: 0;
			height: 0;
			border-bottom: 60px solid #f00;
			border-right: 20px solid transparent;
			border-left: 20px solid transparent;
			transform: rotate(-35deg);
		        top: -40px;
		        left: -49px;
		}
 .starSix {
			/* 六角形：两个三角形组成 */
			width: 0;
			height: 0;
			position: relative;
			border-left: 50px solid transparent;
			border-right: 50px solid transparent;
			border-bottom: 100px solid #f00;
		}
		.starSix:before {
			content: "";
			width: 0;
			height: 0;
			position: absolute;
			top: 30px;
			left: -50px;
			border-left: 50px solid transparent;
			border-right: 50px solid transparent;
			border-top: 100px solid #f00;
		}
 
		.starEight {
			/* 八角星：两个正方形，旋转角度 */
			width: 100px;
			height: 100px;
			background: #f00;
			position: relative;
		}
		.starEight:before {
			content: "";
			width: 100px;
			height: 100px;
			background: #f00;
			position: absolute;
			top: 0;
			left: 0;
			transform: rotate(45deg);
		}
```

## 八卦

```css
.eightDiagrams {
			/* 八卦：多个圆形组成 */
			width: 100px;
			height: 50px;
			border-color: #f00;
			border-width: 2px 2px 50px 2px;
			border-style: solid;
			border-radius: 50%;
			position: relative;
		}
		.eightDiagrams:before {
			content: "";
			position: absolute;
			width: 12px;
			height: 12px;
			background: #fff;
			border-radius: 50%;
			top: 50%;
			left: 0;
			border: 19px solid #f00;
		}
		.eightDiagrams:after {
			content: "";
			position: absolute;
			width: 12px;
			height: 12px;
			background: #f00;
			border-radius: 50%;
			top: 50%;
			left: 50%;
			border: 19px solid #fff;
		}
```

## 钻石

```css
 .diamond {
			/* 钻石：梯形和三角形组成 */
			width: 50px;
			height: 0;
			position: relative;
			border-bottom: 25px solid #f00;
			border-left: 25px solid transparent;
			border-right: 25px solid transparent;
		}
		.diamond:before {
			content: "";
			width: 0;
			height: 0;
			position: absolute;
		        border-left: 50px solid transparent;
		        border-right: 50px solid transparent;
		        border-top: 70px solid #f00;
		        left: -25px;
		        top: 25px;
		}
```

## 鸡蛋

```css
.egg {
			/* 鸡蛋 */
			width: 120px;
		        height: 180px;
		        background: #f00;
		        border-radius: 60% 60% 60% 60% / 70% 70% 50% 50%;
		}
```

## 多边形

```css
.pentagon {
			/* 五边形：三角形和梯形的结合 */
		        width: 60px;
		        height: 0;
		        position: relative;
		        border-top: 55px solid #f00;
		        border-left: 25px solid transparent;
		        border-right: 25px solid transparent;
		}
		.pentagon:before {
			content: "";
		        position: absolute;
		        width: 0px;
		        height: 0;
		        border-left: 55px solid transparent;
		        border-right: 55px solid transparent;
		        border-bottom: 35px solid #f00;
		        left: -25px;
		        top: -90px;
		}
 
		.hexagon {
			/*六边形：在长方形上面和下面各放置一个三角形*/
			width: 100px;
			height: 55px;
			background: #f00;
			position: relative;
		}
		.hexagon:before {
			content: "";
			width: 0;
			height: 0;
			position: absolute;
			top: -25px;
			left: 0;
			border-left: 50px solid transparent;
			border-right: 50px solid transparent;
			border-bottom: 25px solid #f00;
		}
		.hexagon:after {
			content: "";
			width: 0;
			height: 0;
			position: absolute;
			bottom: -25px;
			left: 0;
			border-left: 50px solid transparent;
			border-right: 50px solid transparent;
			border-top: 25px solid #f00;
		}
		
		.octagon {
			/* 八边形：长方形、上下各放置一个梯形 */
			width: 100px;
			height: 100px;
			background: #f00;
			position: relative;
		}
		.octagon:before {
			content: "";
			position: absolute;
			width: 42px;
			height: 0;
			border-left: 29px solid #fff;
			border-right: 29px solid #fff;
			border-bottom: 30px solid #f00;
			top: 0;
			left: 0;
		}
		.octagon:after {
			content: "";
			position: absolute;
			width: 42px;
			height: 0;
			border-left: 29px solid #fff;
			border-right: 29px solid #fff;
			border-top: 30px solid #f00;
			bottom: 0;
			left: 0;

}

```

## 爱心

```css
.love {
			/* 爱心 */
			position: relative;
		}
		.love:before {
			content: "";
			width: 70px;
			height: 110px;
			background: #f00;
			position: absolute;
			border-top-left-radius: 50%;
			border-top-right-radius: 50%;
			transform: rotate(45deg);
		}
		.love:after {
			content: "";
			width: 70px;
			height: 110px;
			background: #f00;
			position: absolute;
			border-top-left-radius: 50%;
			border-top-right-radius: 50%;
			transform: rotate(-45deg);
			left: -30px;
}
```

## 无限

```css
.infinity {
			/* 无穷大 */
			width: 190px;
			height: 100px;
			position: relative;
		}
		.infinity:before {
			content: "";
			width: 50px;
			height: 50px;
			position: absolute;
			top: 0;
			left: 0;
			border: 20px solid #f00;
			border-radius: 50px 50px 0 50px;
			transform: rotate(-45deg);
		}
		.infinity:after {
			content: "";
			width: 50px;
			height: 50px;
			position: absolute;
			top: 0;
			right: 0;
			border: 20px solid #f00;
			border-radius: 50px 50px 50px 0;
			transform: rotate(45deg);
		}


```

## 旗帜

```scss
div{
	position: relative;
     width:14%;
     height:100%;
     margin-right:15px;
    &::before{
        content: ' ';
         display: block;
         width: 0;
         height: 0;
         border-style: solid;
         border-width: 15px 0 15px 10px;
         position: absolute;
         left: 0;
         top: 0;
         border-left-color: #fff;
         z-index: 1;
        border-color: transparent transparent transparent red
    }
    &::after{
        left: auto;
        right: -10px;
        z-index: 2;
        content: ' ';
        display: block;
        width: 0;
         height: 0;
          border-style: solid;
         border-width: 15px 0 15px 10px;
         position: absolute;
         top: 0;
        border-color: transparent transparent transparent red
    }
}
```

# 7.pre标签

```html
//不需要空格与空白行
<pre>code</pre>
//这样会导致code前面有空格，最后会有一行空白
<pre>
    code
</pre>
```

# 8.首行缩进text-indent

```css
.indent{
	text-indent:30px
}
```

# 9.3d从中间出现的悬浮框

```scss
/deep/ .el-dialog__wrapper {
      transition-duration: 0.3s;
    }
   /deep/  .dialog-fade-enter-active{
      animation: none !important;
       .el-dialog{
          animation-fill-mode: forwards;
          animation-duration: 0.3s;
          animation-name: anim-open;
          animation-timing-function: cubic-bezier(0.6,0,0.4,1);
       }
    }
   /deep/  .dialog-fade-leave-active {
      transition-duration: 0.15s !important;
        .el-dialog{
            animation: none !important;
            animation-fill-mode: forwards;
            animation-duration: 0.3s;
            animation-name: anim-close;
        }
    }
    
    @keyframes anim-open {
      0% { opacity: 0;  transform: scale3d(0, 0, 1); }
      100% { opacity: 1; transform: scale3d(1, 1, 1); }
    }
    
    
    @keyframes anim-close {
      0% { opacity: 1; }
      100% { opacity: 0; transform: scale3d(0.5, 0.5, 1); }
    }
```

# 10.动态设置与宽相同的高

```vue
//html
<div>
	<div class="box">
        <div class="box-item">
            
        </div>
    </div>	
</div>
//css
.box{
	width:23%;
    margin-right: calc(8% / 3);
    margin-top:1vh;
    background:#006AF1;
    position: relative;
}
//关键，padding-top设为100%；margin padding 赋值为%百分比的时候，是按父元素的width为参照物
.box::before{
    content:'';
    padding-top:100%;
    width:0;
    box-sizing: border-box;
    display: block;

  }
  .box-item{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%
  }
```

# 11.原始滚动条样式修改-webkit

```css
/*滚动条宽度*/
      ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }
      /*滚动条里面小方块*/
      ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(10, 10, 10, 0.2);
        background: rgba(0, 0, 0, 0.2);
      }
      /*滚动条里面轨道*/
      ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(0, 0, 0, 0.1);
      }
```

# 12.vw,vh,vmin,vmax

 是一种视窗单位，也是相对单位。它相对的不是父节点或者页面的根节点。而是由视窗（**Viewport**）大小来决定的，单位 **1**，代表类似于 **1%**

视窗(**Viewport**)是你的浏览器实际显示内容的区域—，换句话说是你的不包括工具栏和按钮的网页浏览器。

**vw**：视窗宽度的百分比（**1vw** 代表视窗的宽度为 **1%**

**vh**：视窗高度的百分比

**vmin**：当前 **vw** 和 **vh 中较小的一个值**

**vmax**：当前 **vw** 和 **vh** 中较大的一个值

## vw、vh 与 % 百分比的区别

　　（1）**%** 是相对于父元素的大小设定的比率，**vw**、**vh** 是视窗大小决定的。

　　（2）**vw**、**vh** 优势在于能够直接获取高度，而用 **%** 在没有设置 **body** 高度的情况下，是无法正确获得可视区域的高度的，所以这是挺不错的优势。

## vmin、vmax 用处

　　做移动页面开发时，如果使用 **vw**、**wh** 设置字体大小（比如 **5vw**），在竖屏和横屏状态下显示的字体大小是不一样的。

　　由于 **vmin** 和 **vmax** 是当前较小的 **vw** 和 **vh** 和当前较大的 **vw** 和 **vh**。这里就可以用到 **vmin** 和 **vmax**。使得文字大小在横竖屏下保持一致。

# 13.aspect-ratio

设定一个期望的比例，width/height，safari需要15版本及以上，chrome与新版edge都为88版本及以上，firfox需要89版本及以上，ie与部分手机浏览器不支持

```css
.xxx{
	width:100px;
    aspect-ratio:16 / 9;//宽和高的比例为16比9,高度会自动根据该比例与宽计算，反之设高度宽度会根据该比例与高度计算
}
```

