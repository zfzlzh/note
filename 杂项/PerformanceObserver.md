```js
//使用PerformanceObserver监听资源请求时间
class ResourceLoadMonitor {
    constructor() {
        this.resources = [];
        this.init();
    }

    init() {
        // 捕获已存在的资源
        this.captureExistingResources();
        
        // 设置实时监控
        if ('PerformanceObserver' in window) {
            this.setupPerformanceObserver();
        } else {
            window.addEventListener('load', () => {
                this.analyzeResourcesAfterLoad();
            });
        }
    }

    // 捕获已存在的资源
    captureExistingResources() {
        setTimeout(() => {
            const existingResources = performance.getEntriesByType('resource');
            existingResources.forEach(entry => {
                const alreadyRecorded = this.resources.some(r => r.url === entry.name);
                if (!alreadyRecorded) {
                    const endTime = entry.startTime + entry.duration;
                    this.resources.push({
                        url: entry.name,
                        duration: entry.duration,
                        startTime: entry.startTime,
                        endTime: endTime,
                        size: entry.transferSize || 0,
                        type: this.getResourceType(entry.name)
                    });
                }
            });
        }, 0);
    }

    setupPerformanceObserver() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'resource') {
                    const alreadyRecorded = this.resources.some(r => r.url === entry.name);
                    if (!alreadyRecorded) {
                        const endTime = entry.startTime + entry.duration;
                        this.resources.push({
                            url: entry.name,
                            duration: entry.duration,
                            startTime: entry.startTime,
                            endTime: endTime,
                            size: entry.transferSize || 0,
                            type: this.getResourceType(entry.name)
                        });
                    }
                }
            });
        });

        observer.observe({ entryTypes: ['resource'] });
    }

    analyzeResourcesAfterLoad() {
        const resources = performance.getEntriesByType('resource');
        resources.forEach(entry => {
            const alreadyRecorded = this.resources.some(r => r.url === entry.name);
            if (!alreadyRecorded) {
                const endTime = entry.startTime + entry.duration;
                this.resources.push({
                    url: entry.name,
                    duration: entry.duration,
                    startTime: entry.startTime,
                    endTime: endTime,
                    size: entry.transferSize || 0,
                    type: this.getResourceType(entry.name)
                });
            }
        });
    }

    getResourceType(url) {
        if (url.toLowerCase().endsWith('.css')) return 'stylesheet';
        if (url.toLowerCase().endsWith('.js')) return 'script';
        if (/(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) return 'image';
        if (/(woff|woff2|ttf|otf)$/i.test(url)) return 'font';
        if (/(mp4|webm|ogg)$/i.test(url)) return 'video';
        if (/(mp3|wav|ogg)$/i.test(url)) return 'audio';
        return 'other';
    }

    // 格式化时间为可读格式（精确到毫秒）
    formatTime(timestamp) {
        if (timestamp === 0) return 'N/A';
        
        // 将时间戳转换为日期对象（注意performance.timing的时间是相对于页面导航开始的，我们需要加上导航开始时间）
        const navigationStart = performance.timing.navigationStart;
        const actualTime = navigationStart + timestamp;
        const date = new Date(actualTime);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        
        return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
    }

    // 获取从第一个资源开始到指定资源结束的时间间隔
    getTimeIntervalToTarget(targetResourceName) {
        const targetResource = this.resources.find(r => 
            r.url.toLowerCase().includes(targetResourceName.toLowerCase())
        );
        
        if (!targetResource) {
            console.warn('找不到资源: ' + targetResourceName);
            return null;
        }
        
        const firstResourceStartTime = this.resources.length > 0 
            ? Math.min(...this.resources.map(r => r.startTime)) 
            : 0;
        
        // 计算从第一个资源开始到目标资源结束的时间间隔
        const timeInterval = targetResource.endTime - firstResourceStartTime;
        
        return {
            timeInterval: timeInterval,
            firstResourceStartTime: firstResourceStartTime,
            targetResourceEndTime: targetResource.endTime,
            targetResource: targetResourceName,
            firstResourceStartTimeFormat: this.formatTime(firstResourceStartTime),
            targetResourceEndTimeFormat: this.formatTime(targetResource.endTime)
        };
    }

    // 获取所有资源的详细信息
    getAllResourcesDetails() {
        return this.resources.map(resource => ({
            url: resource.url,
            type: resource.type,
            startTime: resource.startTime,
            startTimeFormat: this.formatTime(resource.startTime),//开始的具体时间，精确到ms
            endTime: resource.endTime,
            endTimeFormat: this.formatTime(resource.endTime),//结束的具体时间，精确到ms
            duration: resource.duration,
            size: resource.size
        }));
    }
    clearResources(){
        this.resources = []
    }
}

// 启动监控
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.resourceMonitor = new ResourceLoadMonitor();
    });
} else {
    window.resourceMonitor = new ResourceLoadMonitor();
}

```

