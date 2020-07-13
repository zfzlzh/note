# maps

即键值对，与@each搭配使用可以有非常好的效果,使用括号包裹.

map相关的函数有map-keys()、map-values()、map-get()、map-has-key()、map-merge()、map-remove()、keywords()等

| 函数                 | 功能                           | 示例                                                         |
| -------------------- | ------------------------------ | ------------------------------------------------------------ |
| map-keys(map)        | 返回map里面所有的key(list)     | map-keys(("foo": 1, "bar": 2)) => "foo", "bar"               |
| map-values(map)      | 返回map里面所有的value(list)   | map-values(("foo": 1, "bar": 2)) => 1, 2                     |
| map-get(map,key)     | 返回map里面指定可以的value     | map-get(("foo": 1, "bar": 2), "foo") => 1                    |
| map-has-key(map,key) | 返回map里面是否含有指定的key   | map-has-key(("foo": 1, "bar": 2), "foo") => true             |
| map-merge(map1,map2) | 合并map(map)                   | map-merge(("foo": 1), ("bar": 2)) => ("foo": 1, "bar": 2)    |
| map-remove(map,keys) | 删除指定map中的指定key(map)    | map-remove(("foo": 1, "bar": 2), "bar") => ("foo": 1)        |
| keywords(args)       | 返回一个函数参数组成的map(map) | @mixin foo(args...){@debug keywords($args); //=> (arg1: val, arg2: val)} |

```scss
$map:(
	key：value,
    key1：value1,
)
//例
$map:(
    1:#838A9D,
    2:#E3F2FD,
    3:#E8F5E9,
    4:#FFF3E0,
    5:#FFEBEE,
    5:#F3E5F5,
)
```

### 指定多值

```scss
/* 使用map定义不同的值 */
$card_transition_map: (
  trans1: 200ms transform ease-in-out,
  trans2: 400ms background ease-in,
  trans3: 600ms color linear
);
/* map-values统一使用 */
.card {
  transition: map-values($card_transition_map);
}

//编译后
.card {
    transition: 200ms transform ease-in-out, 
                400ms background ease-in, 
                600ms color linear;
}
```



### 压缩多值(zip函数)

可以使用zip函数来压缩多值

```scss
$animation_config: (
  name: none,
  duration: 0s,
  timing: ease,
  delay: 0s,
  iteration: 1, // infinite
  direction: normal, // reverse, alternate, alternate-reverse
  fill-mode: none, // forwards, backwards, both
  play-state: running
);

@function sh-setup($config) {
  @return zip(map-values($config)...);
}
 
.object {
  animation: sh-setup($animation_config);
}
//编译后
.object {
  animation: none 0s ease 0s 1 normal none running;
}
```

### 指定皮肤

使用一个循环来遍历不同的map，达到指定不同皮肤的功效

```scss
$background_color: (
	jeremy: #0989cb,
	beth: #8666ae,
	matt: #02bba7,
	ryan: #ff8178
);
$font: (
	jeremy: Helvetica,
	beth: Verdana,
	matt: Times,
	ryan: Arial
);
@each $key, $value in $background_color {
	.#{$key} {
		background: $value;
		font-family: map-get($font, $key);
	}
}
//编译后
.jeremy {
  background: #0989cb;
  font-family: Helvetica;
}
.beth {
  background: #8666ae;
  font-family: Verdana;
}
.matt {
  background: #02bba7;
  font-family: Times;
}
.ryan {
  background: #ff8178;
  font-family: Arial;
}
```



### 配置文件

使用Sass的一个最大的优点在于，我们可以对css文件进行统一的组织与管理，使用配置文件是达到目的的主要手段，例如我们把网页中所有层的z-index放配置文件里，在需要的地方进行调用。

```scss
/*定义配置文件*/
$z-index: (
  modal              : 200,
  navigation         : 100,
  footer             : 90,
  triangle           : 60,
  navigation-rainbow : 50,
  share-type         : 41,
  share              : 40,
);
/*在合适的时机调用*/
.navigation {
  z-index: map-get($z-index, navigation);
}
//编译后
.navigation {
  z-index: 100;
}

//简化
$z-index: (
  modal              : 200,
  navigation         : 100,
  footer             : 90,
  triangle           : 60,
  navigation-rainbow : 50,
  share-type         : 41,
  share              : 40,
);
@function z-index($key) {
  @return map-get($z-index, $key);
}
@mixin z-index($key) {
  z-index: z-index($key);
}
/*调用时*/
.navigation {
  @include z-index(navigation);
}
```



### 处理前缀

```scss
/*定义*/
/// Mixin to prefix several properties at once
/// @author Hugo Giraudel
/// @param {Map} $declarations - Declarations to prefix
/// @param {List} $prefixes (()) - List of prefixes to print
@mixin prefix($declarations, $prefixes: ()) {
  @each $property, $value in $declarations {
    @each $prefix in $prefixes {
      #{'-' + $prefix + '-' + $property}: $value;
    }

    // Output standard non-prefixed declaration
    #{$property}: $value;
  }
}
/*使用*/
.selector {
  @include prefix((
    column-count: 3,
    column-gap: 1.5em,
    column-rule: 2px solid hotpink
  ), webkit moz);
}
//编译后
.selector {
  -webkit-column-count: 3;
  -moz-column-count: 3;
  column-count: 3;
  -webkit-column-gap: 1.5em;
  -moz-column-gap: 1.5em;
  column-gap: 1.5em;
  -webkit-column-rule: 2px solid hotpink;
  -moz-column-rule: 2px solid hotpink;
  column-rule: 2px solid hotpink;
}
```



### 反向函数

```scss
/*定义*/
/// Returns the opposite direction of each direction in a list
/// @author Hugo Giraudel
/// @param {List} $directions - List of initial directions
/// @return {List} - List of opposite directions
@function opposite-direction($directions) {
  $opposite-directions: ();
  $direction-map: (
    'top':    'bottom',
    'right':  'left',
    'bottom': 'top',
    'left':   'right',
    'center': 'center',
    'ltr':    'rtl',
    'rtl':    'ltr'
  );
 
  @each $direction in $directions {
    $direction: to-lower-case($direction);
    
    @if map-has-key($direction-map, $direction) { 
      $opposite-directions: append($opposite-directions, unquote(map-get($direction-map, $direction)));
    } @else {
      @warn "No opposite direction can be found for `#{$direction}`. Direction omitted.";
    }
  }
 
  @return $opposite-directions;
}
/*使用*/
.selector {
  background-position: opposite-direction(top right);
}
//编译后
.selector {
  background-position: bottom left;
}
```

### 断点管理

```scss
// _config.scss
$breakpoints: (
  small: 767px,
  medium: 992px,
  large: 1200px
);
 
// _mixins.scss
@mixin respond-to($breakpoint) { 
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: #{map-get($breakpoints, $breakpoint)}) {
      @content;
    }
  }
 
  @else {
    @warn "Unfortunately, no value could be retrieved from `#{$breakpoint}`. "
        + "Please make sure it is defined in `$breakpoints` map.";
  }
}
 
// _component.scss
.element {
  color: hotpink;
 
  @include respond-to(small) {
    color: tomato;
  }
}
//编译后
.element {
  color: hotpink;
}

@media (min-width: 767px) {
  .element {
    color: tomato;
  }
}
```

