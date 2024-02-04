## 1.初始化

```js
import {
  volumeLoader,
  Enums as csEnums,
  setVolumesForViewports,
} from "@cornerstonejs/core";

const renderingEngineId = 'myRenderingEngine'
const AxialDom = document.getElementById('xxx')
const SagittalDom = document.getElementById('xxx')
const CoronalDom = document.getElementById('xxx')
const viewportId1 = 'CT_Axial';
const viewportId2 = 'CT_Sagittal';
const viewportId3 = 'CT_Coronal';
const imageIds = ['dicom图地址',...,]
const volumeId = 'MPR_Volumn'
// 准备一个渲染引擎 => renderingEngine
const renderingEngine = new RenderingEngine(renderingEngineId);

// 去创建并缓存一个Volume
const volume = await volumeLoader.createAndCacheVolume(volumeId, {
  imageIds,
});

// 在渲染引擎中创建并加载视图，使视图与HTML元素绑定，如果需要切换volumn与stack，此步在回到volumn时需要执行，不然报错，工具也需要重新挂载到viewport
const viewportInputArray = [
  {
    viewportId: viewportId1,
    type: csEnums.ViewportType.ORTHOGRAPHIC,
    element: AxialDom,
    defaultOptions: {
      orientation: csEnums.OrientationAxis.AXIAL,
    },
  },
  {
    viewportId: viewportId2,
    type: csEnums.ViewportType.ORTHOGRAPHIC,
    element: SagittalDom,
    defaultOptions: {
      orientation: csEnums.OrientationAxis.SAGITTAL,
    },
  },
  {
    viewportId: viewportId3,
    type: csEnums.ViewportType.ORTHOGRAPHIC,
    element: CoronalDom,
    defaultOptions: {
      orientation: csEnums.OrientationAxis.CORONAL,
    },
  },
];
renderingEngine.setViewports(viewportInputArray);

// 加载Volume => 注意：创建是创建，加载是加载，加载时才会去请求Dicom文件
volume.load();

// 在视图上设置Volume
await setVolumesForViewports(
  renderingEngine,
  [
    {
      volumeId: volumeId,
    },
  ],
  [viewportId1, viewportId2, viewportId3]
);

// 渲染图像
renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);

```

## 2.添加工具

与stack一致，修改传入的viewport，有几个视图就传入几个

```js
import * as cornerstoneTools from '@cornerstonejs/tools'
const { 
  PanTool,
  ZoomTool,
  WindowLevelTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  LengthTool,
  ProbeTool,
  EllipticalROITool,
  CircleROITool,
  BidirectionalTool,
  AngleTool,
  CobbAngleTool,
  ArrowAnnotateTool,
  KeyImageTool,
  Enums: csToolsEnums,
  annotation,
  CrosshairsTool,
  TrackballRotateTool,
  utilities:toolsUtilities
} = cornerstoneTools

let mprToolGroup = '';
let toolGroupId = 'mprToolGroup'
//dom加载后去除初始右键事件
AxialDom.oncontextmenu = (e) => e.preventDefault();
SagittalDom.oncontextmenu = (e) => e.preventDefault();
CoronalDom.oncontextmenu = (e) => e.preventDefault();
//添加工具到cornerstoneTools中注册
cornerstoneTools.addTool(StackScrollMouseWheelTool)
...
//初始化工具集合管理器
mprToolGroup = ToolGroupManager.createToolGroup(toolGroupId)
//注册工具操作同Stack
...
//传入viewport
mprToolGroup.value.addViewport(viewportId1, renderingEngineId)
mprToolGroup.value.addViewport(viewportId2, renderingEngineId)
mprToolGroup.value.addViewport(viewportId3, renderingEngineId)
```

## 3.添加十字轴线

```js
//注册与其他工具一致
const viewportColors = {
    [viewportId1]: 'rgb(200, 0, 0)',
    [viewportId2]: 'rgb(200, 200, 0)',
    [viewportId3]: 'rgb(0, 200, 0)',
  };
  
  const viewportReferenceLineControllable = [
    viewportId1,
    viewportId2,
    viewportId3,
  ];
  
  const viewportReferenceLineDraggableRotatable = [
    viewportId1,
    viewportId2,
    viewportId3,
  ];
  
  const viewportReferenceLineSlabThicknessControlsOn = [
    viewportId1,
    viewportId2,
    viewportId3,
  ];
  
  function getReferenceLineColor(viewportId) {
    return viewportColors[viewportId];
  }
  
  function getReferenceLineControllable(viewportId) {
    const index = viewportReferenceLineControllable.indexOf(viewportId);
    return index !== -1;
  }
  
  function getReferenceLineDraggableRotatable(viewportId) {
    const index = viewportReferenceLineDraggableRotatable.indexOf(viewportId);
    return index !== -1;
  }
  
  function getReferenceLineSlabThicknessControlsOn(viewportId) {
    const index =
      viewportReferenceLineSlabThicknessControlsOn.indexOf(viewportId);
    return index !== -1;
  }

  function initCrosshairsTools(id){
    let hasCrosshair = mprToolGroup.getToolOptions(CrosshairsTool.toolName)
    if(hasCrosshair){
      return
    }
    mprToolGroup.addTool(CrosshairsTool.toolName,{
      getReferenceLineColor,
      getReferenceLineControllable,
      getReferenceLineDraggableRotatable,
      getReferenceLineSlabThicknessControlsOn,
    })
    mprToolGroup.setToolPassive(CrosshairsTool.toolName)
  }

/**
   * 移动坐标轴到指定位置
   * @param {* Array} currentPoints 坐标,[x,y,index]
   */
  function jump(currentPoints){
    let instance = mprToolGroup.getToolInstance(CrosshairsTool.toolName)
    let enabledElement = getEnabledElement(AxialDom)
    const { viewport } = enabledElement;
    //转化坐标
    let imgId = viewport.getCurrentImageId()
    let world = csUtils.imageToWorldCoords(imgId,currentPoints)
    instance._jump(enabledElement,world)
    //跳转对应的页码
    toolsUtilities.jumpToSlice(AxialDom,{imageIndex:currentPoints[2]})
  }
```

## 4.体重建

```js
const volumeName = 'CT_VOLUME_ID'; 
const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; 
const volumeId = `${volumeLoaderScheme}:${volumeName}`; 
let volume = null
let volToolGroup = null
const toolGroupId = 'VOLToolGroup'
const viewportIdVol = 'CT_VOLUME'
const volViewerDom = document.getElementById('xxxx')
volume.value = await volumeLoader.createAndCacheVolume(volumeId, {
     imageIds
});
//需要和mpr同时存在，需要将两个合并，只执行一次此步操作，不然会被覆盖
const viewportInputArray = [
  {
         viewportId: viewportIdVol,
         type: csEnums.ViewportType.VOLUME_3D,
         element: volViewerDom,
         defaultOptions: {
             orientation: csEnums.OrientationAxis.CORONAL,
             background: [0, 0, 0],
         },
   },
];
renderingEngine.setViewports(viewportInputArray);
   
// Set the volume to load
volume.load();
const viewport = renderingEngine.getViewport(viewportIdVol);
await setVolumesForViewports(renderingEngine, [{ volumeId }], [viewportIdVol]).then(
        () => {
            const volumeActor = renderingEngine
                .getViewport(viewportIdVol)
                .getDefaultActor().actor;

            utilities.applyPreset(
                volumeActor,
                CONSTANTS.VIEWPORT_PRESETS.find((preset) => preset.name === 'CT-Bone')
            );

            viewport.render();
        }
    );
    renderingEngine.render();
```

