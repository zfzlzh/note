# 使用

```css
display：grid/inline-grid
```

# grid-template-columns，grid-template-rows（宽高）

```css
//属性
grid-template-columns 定义每一列的列宽
grid-template-rows 定义每一行的行高
//例
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;三列的列宽都为100px
  grid-template-rows: 100px 100px 100px;
}



```

## repeat()

```css
//重复的值可以使用repeat()
.container {
  display: grid;
  grid-template-columns: repeat(3, 33.33%);//三个33.33%
  grid-template-rows: repeat(3, 33.33%);
}
//repeat()重复某种模式也是可以的。
grid-template-columns: repeat(2, 100px 20px 80px);将所有各自分为两批，重复两次，每一次都是第一列的为100.第二列为20，第三列为80
```

## auto-fill 关键字

有时，单元格的大小是固定的，但是容器的大小不确定。如果希望每一行（或每一列）容纳尽可能多的单元格，这时可以使用`auto-fill`关键字表示自动填充。

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);//每列列宽为100，自动填充到父容器放不下换行
}
```

## fr 关键字

为了方便表示比例关系，网格布局提供了`fr`关键字（fraction 的缩写，意为"片段"）。如果两列的宽度分别为`1fr`和`2fr`，就表示后者是前者的两倍。

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;//表示两个同样宽的列
}

```

可以与绝对长度的单位结合使用，这时会非常方便。（限定一列的宽度，剩下的按照比例自填充，）

```css
.container {
  display: grid;
  grid-template-columns: 150px 1fr 2fr;//第一列为150，第二列是第三列的一半
}
```

## **minmax()**

产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值

```css
grid-template-columns: 1fr 1fr minmax(100px, 1fr);//第三列为不小于100px但是不大于1fr的宽度
```

## **auto 关键字**

由浏览器自己决定长度

```css
grid-template-columns: 100px auto 100px;//第二列的宽度，基本上等于该列单元格的最大宽度，除非单元格内容设置了min-width，且这个值大于最大宽度
```

## **网格线的名称**

这两个属性里可以使用方括号，指定每一根网格线的名字，方便以后的引用。

```css
.container {
  display: grid;
  grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
  grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
}
//3*3，所以有四根垂直网格线与四根水平网格线，方括号里面依次是这八根线的名字。

//网格布局允许同一根线有多个名字，比如[fifth-line row-5]。
```

## **布局实例**

```css
.wrapper {
  display: grid;
  grid-template-columns: 70% 30%;
}//两栏式布局
grid-template-columns: repeat(12, 1fr);//十二网格式
```

# row-gap，column-gap，gap （间距）

**根据最新标准，上面三个属性名的`grid-`前缀已经删除，`grid-column-gap`和`grid-row-gap`写成`column-gap`和`row-gap`，`grid-gap`写成`gap`。**

`row-gap`属性设置行与行的间隔（行间距），column-gap`属性设置列与列的间隔（列间距）



```css
.container {
  row-gap: 20px;//行宽20
  column-gap: 20px;//列宽20
}
```

`grid-gap`属性是`grid-column-gap`和`grid-row-gap`的合并简写形式，形式：grid-gap: <grid-row-gap> <grid-column-gap>;如果`grid-gap`省略了第二个值，浏览器认为第二个值等于第一个值

```css

.container {
  gap: 30px 20px;
}
//相当于
.container {
  row-gap: 30px;//行宽30
  column-gap: 20px;//列宽20
}
```

# grid-template-areas（区域模板）

网格布局允许指定"区域"（area），一个区域由单个或多个单元格组成。`grid-template-areas`属性用于定义区域，

结合[gird-area](grid-area)使用

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas: 'a b c'
                       'd e f'
                       'g h i';
}
//划分了九个区域，挨个命名为a-i，
//单元格合并写法
grid-template-areas: 'a a a'
                     'b b b'
                     'c c c';
//将九个单元格划分为了三个区域

//布局实例
grid-template-areas: "header header header"
                     "main main sidebar"
                     "footer footer footer";
//如果某些区域不需要利用，则使用"点"（.）表示。
grid-template-areas: 'a . c'
                      'd . f'
                      'g . i';

```

注意，区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为区域名-start，终止网格线自动命名为区域名-end。

比如，区域名为header，则起始位置的水平网格线和垂直网格线叫做header-start，终止位置的水平网格线和垂直网格线叫做header-end。

# grid-auto-flow

划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行,(换行)

```css
//row，"先行后列,column，"先列后行"
grid-auto-flow: column/row;
```

## row dense,column dense

主要用于，某些项目指定位置以后，剩下的项目怎么自动放置

```css
grid-auto-flow: column dense/row dense;
//优先填满行或者列
```

row dense，有限填满行

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032514.png)

column dense优先填满列

![img](https://www.wangbase.com/blogimg/asset/201903/bg2019032515.png)

# justify-items，align-items，place-items（单元格内位置）

`justify-items`属性设置单元格内容的水平位置（左中右），`align-items`属性设置单元格内容的垂直位置（上中下）

```css
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
}
start：对齐单元格的起始边缘。
end：对齐单元格的结束边缘。
center：单元格内部居中。
stretch：拉伸，占满单元格的整个宽度（默认值）。
```

`place-items`属性是`align-items`属性和`justify-items`属性的合并简写形式。如果省略第二个值，则浏览器认为与第一个值相等

```css
place-items: <align-items> <justify-items>;
//例
place-items: start end;
```

# justify-content，align-content，place-content（容器内的位置）

`justify-content`属性是整个内容区域在容器里面的水平位置（左中右），`align-content`属性是整个内容区域的垂直位置（上中下）。与flex相似

```css
.container {
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
}
```

`place-content`属性是`align-content`属性和`justify-content`属性的合并简写形式。与place-items一样

# grid-auto-columns，grid-auto-rows

有时候，一些项目的指定位置，在现有网格的外部。比如网格只有3列，但是某一个项目指定在第5行。这时，浏览器会自动生成多余的网格，以便放置项目。

`rid-auto-columns`属性和`grid-auto-rows`属性用来设置，浏览器自动创建的多余网格的列宽和行高

写法与`grid-template-columns`和`grid-template-rows`完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。

```CSS
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-auto-rows: 50px; 
}
```

# grid-column-start,grid-column-end,grid-row-start,grid-row-end(项目位置)

项目的位置是可以指定的，具体方法就是指定项目的四个边框，分别定位在哪根网格线

- `grid-column-start`属性：左边框所在的垂直网格线

- `grid-column-end`属性：右边框所在的垂直网格线

- `grid-row-start`属性：上边框所在的水平网格线

- `grid-row-end`属性：下边框所在的水平网格线

- ```css
    .item-1 {
      grid-column-start: 2;
      grid-column-end: 4;
    }
    //1号项目的左边框是第二根垂直网格线，右边框是第四根垂直网格线，没有指定上下边框，会采用默认位置1-2
    //当有其他项目时，没有指定其他项目的位置时由浏览器自动布局，位置由grid-auto-flow决定，默认时row
    ```

    

这四个属性的值，除了指定为第几个网格线，还可以指定为网格线的名字。

```css
.item-1 {
  grid-column-start: header-start;
  grid-column-end: header-end;
}
//1号项目的左右边框被命名为header-start与header-end
```

这四个属性的值还可以使用`span`关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。

```css
.item-1 {
  grid-column-start: span 2;
   <!--grid-column-end: span 2-->;与上面相同
}
//1号项目的左边框距离右边框跨越2个网格
```

如果产生了项目的重叠，则使用**`z-index`属性**指定项目的重叠顺序

# grid-column ,grid-row 

上面四个属性的合并简写

使用**''/'**'连接

```css
.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
/* 等同于 */
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
```

斜杠以及后面的部分可以省略，默认跨越一个网格

# grid-area

指定项目放在哪一个区域，结合[grid-template-areas](grid-template-areas（区域模板）)使用

```css
.item-1 {
  grid-area: e;
}
//该项目放置在e区域
```

`grid-area`属性还可用作`grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end`的合并简写形式，直接指定项目的位置。

```css
.item {
  grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}
//例子
.item-1 {
  grid-area: 1 / 1 / 3 / 3;
}
```

# justify-self ，align-self，place-self

`justify-self`属性设置单元格内容的水平位置（左中右），跟`justify-items`属性的用法完全一致，但只作用于单个项目。

`align-self`属性设置单元格内容的垂直位置（上中下），跟`align-items`属性的用法完全一致，也是只作用于单个项目。

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
start：对齐单元格的起始边缘。
end：对齐单元格的结束边缘。
center：单元格内部居中。
stretch：拉伸，占满单元格的整个宽度（默认值）
```

`place-self`属性是`align-self`属性和`justify-self`属性的合并简写形式。

```css
place-self: <align-self> <justify-self>;
```

如果省略第二个值，`place-self`属性会认为这两个值相等