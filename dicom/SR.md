使用dcmjs解析

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
    <script type="text/javascript" src="https://unpkg.com/dcmjs"></script>
    <style>
      *{
        box-sizing: border-box;
        padding:0;
        margin:0
      }
      #list{
        width: 700px;
        height: 850px;
        overflow: auto;
        background-color: #e5e5e5;
        padding:15px
      }
    </style>
	</head>
	<body>
    <div style="width:100vw;height:100vh;display: flex;align-items: center;justify-content: center;">
      <div id="list"></div>
    </div>
		<script src="./nonModularCode.min.js"></script>
		<script type="module">
      function handleDatasetForCode(data){
        let ConceptCodeSequence = data.ConceptCodeSequence[0]
        return {
          label:ConceptCodeSequence.CodeMeaning,
          value:ConceptCodeSequence.CodeValue,
          CodeValue:ConceptCodeSequence.CodeValue,
          CodingSchemeDesignator:ConceptCodeSequence.CodingSchemeDesignator
        }
      }
      function handleDatasetForUidref(data){
        let ConceptNameCodeSequence = data.ConceptNameCodeSequence[0]
        return {
          label:ConceptNameCodeSequence.CodeMeaning,
          value:data.UID,
          CodeValue:ConceptNameCodeSequence.CodeValue,
          CodingSchemeDesignator:ConceptNameCodeSequence.CodingSchemeDesignator
        }
      }
      function handleDatasetForText(data){
        let ConceptNameCodeSequence = data.ConceptNameCodeSequence[0]
        return {
          label:ConceptNameCodeSequence.CodeMeaning,
          value:data.TextValue,
          CodeValue:ConceptNameCodeSequence.CodeValue,
          CodingSchemeDesignator:ConceptNameCodeSequence.CodingSchemeDesignator
        }
      }
      function formatDateTime(time){
        let date = time.split('.')[0];
        return `${date.slice(0,4)}\/${date.slice(4,6)}\/${date.slice(6,8)} ${date.slice(8,10)}:${date.slice(10,12)}:${date.slice(12,14)}`

      }
      function handleDatasetForDateTime(data){
        let ConceptNameCodeSequence = data.ConceptNameCodeSequence[0]
        return {
          label:ConceptNameCodeSequence.CodeMeaning,
          value:formatDateTime(data.DateTime),
          CodeValue:ConceptNameCodeSequence.CodeValue,
          CodingSchemeDesignator:ConceptNameCodeSequence.CodingSchemeDesignator
        }
      }
      function handleDatasetForContainer(data){
        let ConceptNameCodeSequence = data.ConceptNameCodeSequence[0]
        return {
          label:ConceptNameCodeSequence.CodeMeaning,
          value:data.ContinuityOfContent,
          CodeValue:ConceptNameCodeSequence.CodeValue,
          CodingSchemeDesignator:ConceptNameCodeSequence.CodingSchemeDesignator
        }
      }
      function handleDatasetForNum(data){
        let ConceptNameCodeSequence = data.ConceptNameCodeSequence[0]
        
        let MeasuredValueSequence = data.MeasuredValueSequence[0]
        return {
          label:ConceptNameCodeSequence.CodeMeaning,
          value:MeasuredValueSequence.NumericValue,
          unit:MeasuredValueSequence.MeasurementUnitsCodeSequence[0].CodeValue,
          CodeValue:ConceptNameCodeSequence.CodeValue,
          CodingSchemeDesignator:ConceptNameCodeSequence.CodingSchemeDesignator
        }
      }
      const eventsForValueType ={
        'CODE':handleDatasetForCode,
        'UIDREF':handleDatasetForUidref,
        'TEXT':handleDatasetForText,
        'DATE':handleDatasetForDateTime,
        'TIME':handleDatasetForDateTime,
        'DATETIME':handleDatasetForDateTime,
        'CONTAINER':handleDatasetForContainer,
        'NUM':handleDatasetForNum
      }
      function handleDataset(data){
        return data.reduce((pre,item) => {
          let newItem = eventsForValueType[item.ValueType] ? eventsForValueType[item.ValueType](item) : {}
          newItem.ValueType = item.ValueType
          pre = [...pre,newItem]
          if(item.ContentSequence){
            pre = [...pre,...handleDataset(item.ContentSequence)]
          }
          return pre
        },[])
      }
			function loadStructuredReport() {
				fetch(
					`./1.3.12.2.1107.5.1.4.92351.30000021012815332563800027600/1.3.12.2.1107.5.1.4.92351.30000021012815332563800027601.dcm`
				)
					.then((res) => {
						return res.arrayBuffer();
					})
					.then((part10SRArrayBuffer) => {
						console.log(part10SRArrayBuffer);
						const dicomData =
							dcmjs.data.DicomMessage.readFile(
								part10SRArrayBuffer
							);
						const dataset =
							dcmjs.data.DicomMetaDictionary.naturalizeDataset(
								dicomData.dict
							);
            console.log('dicomData',dataset)
            const arr = handleDataset(dataset.ContentSequence)
						console.log(arr)
            let fragment = arr.filter(val => ['TEXT','DATETIME'].includes(val.ValueType)).reduce((pre,item) => {
              let itemDom = document.createElement('div')
              itemDom.innerHTML = `
                <h4>${item.label}</h4>
                <div style="margin:10px 0;font-size:13px">${item.value}</div>
              `
              pre.appendChild(itemDom)
              return pre
            },document.createDocumentFragment())
            document.getElementById('list').appendChild(fragment)
					});
			}
			loadStructuredReport();
		</script>
	</body>
</html>

```

如果是测量信息的SR，可以用dcmjs.adapters.Cornerstone.MeasurementReport.generateToolState处理解析后的数据用于图片上绘制测量图形

```js
function loadStructuredReport() {
	fetch(
		`./1.3.12.2.1107.5.1.4.92351.30000021012815332563800027600/1.3.12.2.1107.5.1.4.92351.30000021012815332563800027601.dcm`
	)
		.then((res) => {
			return res.arrayBuffer();
		})
		.then((part10SRArrayBuffer) => {
			console.log(part10SRArrayBuffer);
			const dicomData =
				dcmjs.data.DicomMessage.readFile(part10SRArrayBuffer);
			const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(
				dicomData.dict
			);
			const storedMeasurementByToolType =
				MeasurementReport.generateToolState(dataset);
			const imageId1 =
				"dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm";

			const generalSeriesModule1 = cornerstone.metaData.get(
				"sopCommonModule",
				imageId1
			);

			const imageId2 =
				"dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm";

			const generalSeriesModule2 = cornerstone.metaData.get(
				"sopCommonModule",
				imageId2
			);

			const SOPInstanceUIDtoImageId = {};

			SOPInstanceUIDtoImageId[generalSeriesModule1.sopInstanceUID] =
				imageId1;

			SOPInstanceUIDtoImageId[generalSeriesModule2.sopInstanceUID] =
				imageId2;

			const toolState =
				cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();

			Object.keys(storedMeasurementByToolType).forEach((toolType) => {
				const toolData = storedMeasurementByToolType[toolType];

				toolData.forEach((data) => {
					const imageId =
						SOPInstanceUIDtoImageId[data.sopInstanceUid];

					if (!toolState[imageId]) {
						toolState[imageId] = {};
					}

					if (!toolState[imageId][toolType]) {
						toolState[imageId][toolType] = { data: [] };
					}
					toolState[imageId][toolType].data.push(data);
				});
			});
		});
}

```

