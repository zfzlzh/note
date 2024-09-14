```tsx
//创建
function useResizeObserver(): [
  ref: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
  sizes: { height?: number; width?: number }
] {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [sizes, setSizes] = useState<{ height?: number; width?: number }>({});
  useEffect(() => {
    if (!ref) return;
    const observer = new ResizeObserver(() => {
      setSizes({ height: ref.offsetHeight, width: ref.offsetWidth });
    });
    observer.observe(ref);
    return () => {
      observer.disconnect();
      setSizes({});
    };
  }, [ref]);
  return [setRef, sizes];
}
//使用
function Example() {
  const [ref, sizes] = useResizeObserver();
  console.log(sizes.height, sizes.width);
  return <div ref={ref}></div>;
}
```

//传入多个dom与回调函数

```ts
import { useState,useEffect } from 'react'

interface refTypes{
  el:HTMLElement,
  handle:Function
}
const throttle = (fun:Function,delay:number) => {
	let timer:number|undefined = undefined;
	return function() {
		const args = arguments
		if(timer) {
			clearTimeout(timer)
      timer = undefined
		}
    timer = setTimeout(() => {
        fun(args)
        clearTimeout(timer)
        timer = undefined
    }, delay)
	}
}
const map = new WeakMap()
function useResizeObserver(): [
  ref: React.Dispatch<React.SetStateAction<Array<refTypes>>>,
] {
  const [refs, setRefs] = useState<Array<refTypes>>([]);
  useEffect(() => {
    if (refs.length == 0) return;
    const observer = new ResizeObserver(
      throttle((params:Array<ResizeObserverEntry[]>) => {
        let entries:ResizeObserverEntry[] = params[0]
        console.log(entries)
        console.log(map)
        for (const entry of entries) {
          console.log(entry)
          // 获取dom元素的回调
          const handler = map.get(entry.target)
          console.log(handler)
          //存在回调函数
          if (handler) {
              // 将监听的值给回调函数
              handler({
                  width: entry.borderBoxSize[0].inlineSize,
                  height: entry.borderBoxSize[0].blockSize
              })
          }
        }
      },100)
    );
    for(const ref of refs){
      observer.observe(ref.el);
      map.set(ref.el,ref.handle)
    }
    
    return () => {
      observer.disconnect();
    };
  }, [refs]);
  return [setRefs];
}
export default useResizeObserver


//使用
const viewer = useRef(null)
 const [setRefs] = useResizeObserver()
  useLayoutEffect(() => {
    initCornerstone()
    setRefs([{el:viewer.current,handle:onResize}])
  },[])
```

