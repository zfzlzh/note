/* eslint-disable */
import { saveAs } from 'file-saver';
//blob与xlsx在index.html中引入
// <script src="/js/xlsx.full.min.js"></script>
// <script src="/js/Blob.js"></script>
function generateArray(table) {
  var out = [];
  var rows = table.querySelectorAll('tr');
  var ranges = [];
  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];
    var row = rows[R];
    var columns = row.querySelectorAll('td');
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C];
      var colspan = cell.getAttribute('colspan');
      var rowspan = cell.getAttribute('rowspan');
      var cellValue = cell.innerText;
      if (cellValue !== '' && cellValue == +cellValue) cellValue = +cellValue;

      //Skip ranges
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({ s: { r: R, c: outRow.length }, e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 } });
      }
      //Handle Value
      outRow.push(cellValue !== '' ? cellValue : null);

      //Handle Colspan
      if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
}

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };

  for (var R = 0; R != data.length; ++R) {
    if (data[R]) {
      for (var C = 0; C != data[R].length; ++C) {
        if (range.s.r > R) range.s.r = R;
        if (range.s.c > C) range.s.c = C;
        if (range.e.r < R) range.e.r = R;
        if (range.e.c < C) range.e.c = C;
        var cell = { v: data[R][C] };
        if (cell.v == null) continue;
        var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
        if (typeof cell.v === 'number') cell.t = 'n';
        else if (typeof cell.v === 'boolean') cell.t = 'b';
        else if (cell.v instanceof Date) {
          cell.t = 'n';
          cell.z = XLSX.SSF._table[14];
          cell.v = datenum(cell.v);
        } else cell.t = 's';
        ws[cell_ref] = cell;
      }
    }
  }

  let numArr = [];
  for (let i in ws) {
    // 告警规则配置导出错误文件的换行
    if (ws[i].v && typeof ws[i].v == 'string' && ws[i].v.indexOf('_wrap') > -1) {
      ws[i].s = { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, font: { bold: true } };
    }
    // 符合条件的单元格添加背景色，导入失败返回含有错误信息的execl用
    if (i.indexOf('A') > -1 && ws[i].v && typeof ws[i].v == 'string' && ws[i].v.indexOf('&#') > -1 && String(ws[i].v).match(/&#[0-9A-Za-z]{6}/g) !== null) {
      let arr = ws[i].v.split('&#');

      ws[i].v = arr[0];
      let color;
      if (arr.length > 2) {
        color = arr[2];
      } else {
        color = arr[1];
      }
      numArr.push({ num: i.substring(1, i.length), color: color, val: arr[0] });
      ws[i].s = { fill: { fgColor: { rgb: arr[1] } } }; //背景色设置用fgColor
    }

    // 将符合条件的单元格所在行添加背景色，如果某格本身含有颜色标识即用本身颜色标识
    if (i.indexOf('A') == -1) {
      if (numArr.length != 0) {
        for (let a = 0, leng; (leng = numArr[a++]); ) {
          if (leng.num == i.substring(1, i.length) && leng.val != '') {
            ws[i].s = { fill: { fgColor: { rgb: leng.color } } }; //背景色设置用fgColor
          }
        }
      }
      if (String(ws[i].v).indexOf('&#') > -1 && String(ws[i].v).match(/&#[0-9A-Za-z]{6}/g) !== null) {
        let arr = ws[i].v.split('&#');
        ws[i].v = arr[0];
        ws[i].s = { fill: { fgColor: { rgb: arr[1] } } };
      }
    }
  }

  // 更改样式与合并单元格
  // let border = {
  //     bottom: { style: "thin", color: { rgb: "000000" } }, top: { style: "thin", color: { rgb: "000000" } },
  //     left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }
  // };

  // // let reg =/^A?\d+$/
  // for(let i in ws){
  //     ws[i].s = { border: border}
  //     // if(reg.test(i)){
  //     //     console.log(i)
  //     // }
  // }

  // let style1 = {alignment: { horizontal: 'center',vertical: "center" }};
  // // 添加样式
  // ws['A4'].s=style1
  // // 合并单元格
  // ws['!merges'] = [{
  //     s: {//开始
  //         c: 0,//列头
  //         r: 3//行头
  //     },
  //     e: {//e结束
  //         c: 0,
  //         r: 4
  //     }
  // }];

  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);

  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export function export_table_to_excel(id) {
  var theTable = document.getElementById(id);
  var oo = generateArray(theTable);
  var ranges = oo[1];

  /* original data */
  var data = oo[0];
  var ws_name = 'SheetJS';

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });

  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'test.xlsx');
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map((v) => filterVal.map((j) => v[j]));
}
export function export_json_to_excel(th, jsonData, defaultTitle) {
    // 如果顺利导出返回true，文件数据有问题导致代码无法执行导出返回false
  try {
      /* original data */
      var data = jsonData;
      // data.unshift(th);
      console.log(1);
      var ws_name,
        wb = new Workbook(),
        ws,
        colWidth;
      // 可以生成多张表格
      for (let i in data) {
        let dataInfo;
        if (typeof data[i][0] != 'string' && typeof data[i][0] != 'number') {
          dataInfo = data[i];
        } else {
          dataInfo = data;
        }
        ws_name = 'SheetJS' + (Number(i) + 1);
        dataInfo.unshift(th);
        ws = sheet_from_array_of_arrays(dataInfo);

        /* add worksheet to workbook */
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
        // 设置自适应宽
        colWidth = dataInfo.map((row) =>
          row.map((val) => {
            if (val) {
              let index;
              if (typeof val == 'string' && val.indexOf('&#') > -1) {
                index = val.indexOf('&#');
                if (index > -1) {
                  val = val.substring(0, index);
                }
              }
            }
            /*先判断是否为null/undefined*/
            if (val == null) {
              return {
                wch: 10,
              };
            }
            // 告警规则配置用
            else if (typeof val == 'string' && val.indexOf('_wrap') > -1) {
              let len = val.toString().length * 2;
              if (len >= 60) {
                len = len - 20;
              }
              if (len >= 40 && len < 60) {
                len = len - 10;
              }
              return {
                wch: len,
              };
            } else if (val.toString().charCodeAt(0) > 255) {
            /*再判断是否为中文*/
              // console.log(val)
              return {
                wch: val.toString().length * 2,
              };
            } else {
              return {
                wch: val.toString().length,
              };
            }
          })
        );

        let result = colWidth[0];

        for (let i = 1; i < colWidth.length; i++) {
          for (let j = 0; j < colWidth[i].length; j++) {
            if (colWidth[i][j] && result[j] && result[j]['wch'] < colWidth[i][j]['wch']) {
              result[j]['wch'] = colWidth[i][j]['wch'];
            } else if (!result[j]) {
              result.push({});
              result[j]['wch'] = colWidth[i][j]['wch'];
            }
          }
        }

        ws['!cols'] = result;
        // 告警规则配置用，去除_wrap
        for (let i in ws) {
          if (ws[i].v && typeof ws[i].v == 'string' && ws[i].v.indexOf('_wrap') > -1) {
            let num = ws[i].v.indexOf('_wrap');
            ws[i].v = ws[i].v.substring(0, num);
          }
        }
        if (typeof data[i][0] == 'string') {
          break;
        }
      }

      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
      var title = defaultTitle || '列表';
      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), title + '.xlsx');
      return true
  } catch {
    return false
  }
}
