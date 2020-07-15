# 1.checkbox取消文字点击选中

文字加标签加一个点击事件，@click要加prevent

```vue
<el-checkbox-group 
    v-model="checkedData" 
    @change="handleCheckedPointChange" 
    class="checkBoxGroup">
     <el-checkbox  :label="point.index" class="flexBox checkBox">
         <div 
              v-for="item in point.arr" 
              :key="item.name" 
              class="checkBoxHeadDiv flexBox" 
              @click.prevent="()=>{}">
             
          </div>
      </el-checkbox>
</el-checkbox-group>
```

