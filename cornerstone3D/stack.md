## 1.初始化

```js
import {
  RenderingEngine,
  Enums as csEnums,
} from "@cornerstonejs/core";
import * as cornerstoneTools from '@cornerstonejs/tools'

const renderingEngineId = 'myRenderingEngine'
const originAxialDom = document.getElementById('xxx')
const viewportId = 'CT_origin_Axial';
const imageIds = ['dicom图地址']
// 准备一个渲染引擎 => renderingEngine
const renderingEngine = new RenderingEngine(renderingEngineId);

// 在渲染引擎中创建并加载视图，使视图与HTML元素绑定，如果需要切换volumn与stack，此步在回到stack时需要执行，不然报错，工具也需要重新挂载到viewport
const viewportId = "CT_AXIAL_STACK";
const viewportInput = {
  viewportId: viewportId,
  element: originAxialDom,
  type: csEnums.ViewportType.STACK,
};
renderingEngine.enableElement(viewportInput);

const viewport = renderingEngine.getViewport(viewportId);
viewport.setStack(imageIds);//第二个参数可传入数字，默认显示那一张，不传默认0
//监听图片更新事件,可监听事件名称都在Enums.Events中
function onImageUpdated(e){
    ...
}
originAxialDom.addEventListener(csEnums.Events.STACK_NEW_IMAGE, onImageUpdated);
//初始所有图都下载，需要添加这句，不然初始只加载一张
cornerstoneTools.utilities.stackPrefetch.enable(viewport.element)
viewport.render();



```

## 2.添加工具

```js
//从cornerstoneTools中取出需要的工具
const { 
  ToolGroupManager,//工具集合管理器，多个视图可以拥有自己的工具集合，互不干扰
  //鼠标操作工具，平移、放大、窗宽窗位、滚动切换图片，旋转
  PanTool,
  ZoomTool,
  WindowLevelTool,
  StackScrollMouseWheelTool,
  TrackballRotateTool,
  
  Enums: csToolsEnums,
  annotation,
  //标注工具
  LengthTool,
  ProbeTool,
  RectangleROITool,
  PlanarFreehandROITool,
  EllipticalROITool,
  CircleROITool,
  BidirectionalTool,
  AngleTool,
  CobbAngleTool,
  ArrowAnnotateTool,
  KeyImageTool,
} = cornerstoneTools
const { MouseBindings,Events } = csToolsEnums

const toolGroupId = 'origin_tool_group';
let ctToolGroup = '';
//dom加载后去除初始右键事件
originAxialDom.oncontextmenu = (e) => e.preventDefault();
//添加工具到cornerstoneTools中注册
cornerstoneTools.addTool(StackScrollMouseWheelTool)
...
//初始化工具集合管理器
ctToolGroup = ToolGroupManager.createToolGroup(toolGroupId)
//添加工具到集合管理器
ctToolGroup.addTool(StackScrollMouseWheelTool.toolName)
...
//不需要开启的使用passive
ctToolGroup.setToolPassive(rectangleROITool.toolName)
...
//需要直接开启的使用active
ctToolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
//绑定鼠标按键
ctToolGroup.setToolActive(WindowLevelTool.toolName, {
   bindings: [
        {
          mouseButton: MouseBindings.Primary, // Left Click
        },
      ],
    });
    ctToolGroup.setToolActive(PanTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Auxiliary, // Middle Click
        },
      ],
    });
    ctToolGroup.setToolActive(ZoomTool.toolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Secondary, // Right Click
        },
      ],
});
//如果需要使用自由框选标注，还需要添加
ctToolGroup.setToolConfiguration(PlanarFreehandROIToolExtend.toolName, {
      calculateStats: true,
});
//绑定视图
ctToolGroup.addViewport(viewportId, renderingEngineId)
```

