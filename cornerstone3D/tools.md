## 1.切换绑定鼠标工具事件

```js
//传入的时工具的toolName，比如rectangleROI.toolName
let selectedToolName = ''
function setActiveAnnotationTool(toolName){
    const newSelectedToolName = String(toolName);

    // Set the new tool active
    ctToolGroup.setToolActive(newSelectedToolName, {
      bindings: [
        {
          mouseButton: MouseBindings.Primary, // Left Click
        },
      ],
    });

    // Set the old tool passive
    ctToolGroup.setToolPassive(selectedToolName);

    selectedToolName = toolName
  }
```

## 2.使用已有坐标在图上绘制标注且切换至对应页码

```js
//切换页码,传入页码
//stack
let enabledElement = getEnabledElement(stackDom)
const { viewport } = enabledElement;
viewport.setImageIdIndex(index)
//volume
import * as cornerstoneTools from '@cornerstonejs/tools'
const { 
  utilities:toolsUtilities
} = cornerstoneTools
toolsUtilities.jumpToSlice(volumeDom,{imageIndex:index})
```

对应的标注方法中没找到能直接生成标注的方法，需要自己写一个继承的class，替代原来的引入,此处添加的为rectangleROI工具中的方法，不同的工具需要单独写对应的方法，仿照对应文件里的addNewAnnotation方法

```js
import * as cornerstoneTools from '@cornerstonejs/tools'
import { 
  getEnabledElement,
  utilities as csUtils,
 } from '@cornerstonejs/core'
const {
  RectangleROITool,
  utilities,
  annotation,
} = cornerstoneTools
const {state} = annotation

class RectangleROIToolExtend extends RectangleROITool{
  constructor(){
    super()
  }
  /**
   * 已有坐标生成mark
   * @param {* Object} data 
   *    @param {* Array} currentPoints -- 坐标，[[x1,y1],[x2,y2]]
   *    @param {* HTMLElement} element -- dom，需要生成mark的dom
   *    @param {* Function} callback --   回调
   * @returns 
   */
  addNewAnnotationWithPoints({
      currentPoints, 
      element,
      callback
  }){
    
    const enabledElement = getEnabledElement(element);
    const { viewport, renderingEngine } = enabledElement;
    let vpType = viewport.type
    //转化坐标
    let imgId = vpType == 'stack' ? viewport.csImage.imageId : viewport.getCurrentImageId()
    const worldPosArr = currentPoints.map(val => {
      //pixelToCanvas替代，直接从pixel转化为world
      return csUtils.imageToWorldCoords(imgId,val)
    })
    const worldPos = worldPosArr[0]
    //矩形四个点的坐标
    const handleData = [
      worldPosArr[0],
      [worldPosArr[1][0],worldPosArr[0][1],worldPosArr[0][2]],
      [worldPosArr[0][0],worldPosArr[1][1],worldPosArr[0][2]],
      worldPosArr[1],
    ]
    const camera = viewport.getCamera();
    const { viewPlaneNormal, viewUp } = camera;

    const referencedImageId = super.getReferencedImageId(
      viewport,
      worldPos,
      viewPlaneNormal,
      viewUp
    );

    const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();

    const annotation = {
      invalidated: true,
      highlighted: true,
      metadata: {
        toolName: super.getToolName(),
        viewPlaneNormal: [...viewPlaneNormal],
        viewUp: [...viewUp],
        FrameOfReferenceUID,
        referencedImageId,
      },
      data: {
        label: '',
        handles: {
          points: handleData,
          textBox: {
            hasMoved: false,
            worldPosition: [0, 0, 0],
            worldBoundingBox: {
              topLeft: [0, 0, 0],
              topRight: [0, 0, 0],
              bottomLeft: [0, 0, 0],
              bottomRight: [0, 0, 0],
            },
          },
          activeHandleIndex: null,
        },
        cachedStats: {},
      },
    };

    state.addAnnotation(annotation, element);

    const viewportIdsToRender =  utilities.viewportFilters.getViewportIdsWithToolToRender(
      element,
      super.getToolName()
    );

    super.editData = {
      annotation,
      viewportIdsToRender,
      handleIndex: 3,
      movingTextBox: false,
      newAnnotation: true,
      hasMoved: false,
    };

    utilities.triggerAnnotationRenderForViewportIds(renderingEngine, viewportIdsToRender);
    callback && callback()
    return annotation;
  };
  
}
export default RectangleROIToolExtend
```

使用

```js
const instance = ctToolGroup.getToolInstance('rectangleROI')
instance.addNewAnnotationWithPoints({
      currentPoints:points,
      element,
      callback:() => {
        //do something
      }
})
```

## 3.绘制标注结束时的监听事件

```js
import { eventTarget } from '@cornerstonejs/core' 
import * as cornerstoneTools from '@cornerstonejs/tools'
const { 
  Enums: csToolsEnums,
} = cornerstoneTools
const { Events } = csToolsEnums
/**
   * 设置画图结束后的监听事件，方法名带Once是只执行一次，需要多次使用的去掉Once
   * @param {*Function}  callback -- 要执行的事件,需要往annotation中添加属性可在此处操作
   */
  function setListenerForCompletedOnce(callback){
    eventTarget.addEventListenerOnce(Events.ANNOTATION_COMPLETED,callback)
  }
```

## 4.获取标注

```js
import * as cornerstoneTools from '@cornerstonejs/tools'
const { 
  annotation,
} = cornerstoneTools 
 /**
   * 获取某个视图所属的annotationGroup中所有的标注
   * @param {* HTMLElement} element -- 视图
   * @returns 
   */
  function getAnnotations(element){
    const { state } = annotation
    return state.getAnnotations(null,element)
  }

  /**
   * 获取某个视图所属的annotationGroup中某个工具绘制的标注
   * @param {* String} tool -- 为toolbarjson中的key
   * @param {* HTMLElement} element -- 视图
   */
  function getAnnotationsByToolName(tool,element){
    const { state } = annotation
    return state.getAnnotations(toolsName[tool],element)
  }

  //获取当前选中的标注
  function getSelectedAnnotations(){
    const { selection, state } = annotation;
    const annotationUIDs = selection.getAnnotationsSelected();
    let nowAnnotation = ''
    if (annotationUIDs && annotationUIDs.length) {
      const annotationUID = annotationUIDs[0];
      nowAnnotation = state.getAnnotation(annotationUID)
    }
    return nowAnnotation
  }
```

## 5.删除标注

```js
import * as cornerstoneTools from '@cornerstonejs/tools'
const {
  annotation,
} = cornerstoneTools
/**
 * 删除某个视图所属annotationGroup的某一类标注工具创建的所有标注
 * @param {* HTMLElement} element -- 视图dom
 * @param {* String} toolName -- 工具名称
*/
function removeAnnotations(element,toolName){
     let manager = annotation.state.getAnnotationManager()
     const groupKey = manager.getGroupKey(element);
     manager.removeAnnotations(groupKey,toolName)
}
/**
 * 删除某个视图所属annotationGroup的某一类标注工具创建的某个标注
 * @param {* String} anntationUID -- 标注的anntationUID
*/
function removeAnnotation(annotationUID){
     annotation.state.removeAnnotation(annotationUID)
}
//删除某个视图所属annotationGroup的所有标注
function removeAllAnnotation(){
    annotation.state.removeAllAnnotation()
}
```

