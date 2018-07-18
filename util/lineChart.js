function dataCombine(series) {
    return series.reduce(function (a, b) {
        return (a.data ? a.data : a).concat(b.data);
    }, []);
}

function getLimit(maxData, minData) {
    var limit = 0,
        range = maxData - minData;
    if (range >= 10000) {
        limit = 1000;
    } else if (range >= 1000) {
        limit = 100;
    } else if (range >= 100) {
        limit = 10;
    } else if (range >= 10) {
        limit = 5;
    } else if (range >= 1) {
        limit = 1;
    } else if (range >= 0.1) {
        limit = 0.1;
    } else {
        limit = 0.01;
    }
}

function findRange(num, type, limit) {
    limit = limit || 10;
    type = type ? type : 'upper';
    var multiple = 1;
    while (limit < 1) {
        limit *= 10;
        multiple *= 10;
    }
    if (type === 'upper') {
        num = Math.ceil(num * multiple);
    } else {
        num = Math.floor(num * multiple);
    }
    while (num % limit !== 0) {
        if (type === 'upper') {
            num++;
        } else {
            num--;
        }
    }
    return num / multiple;
}

function drawTable(opts) {
    var context = wx.createContext(),
        context2 = wx.createContext(),
        eachSpacing = Math.floor(opts.width / opts.categories.length) - 2, points = [],
        startX = eachSpacing / 2,
        startY = opts.height - 30,
        endX = opts.width,
        endY = 20;
    // x轴
    opts.categories.forEach(function (item, index) {
        points.push(startX + index * eachSpacing);
    });

    context.beginPath();
    context.setStrokeStyle("#cccccc");
    context.setLineWidth(1);

    context.moveTo(0, startY);
    context.lineTo(endX, startY);
    points.forEach(function (item, index) {
        context.moveTo(item, startY);
        context.lineTo(item, endY);
    });
    context.closePath();
    context.stroke();

    context.beginPath();
    context.setFontSize(11);
    context.setFillStyle('#303030');
    opts.categories.forEach(function (item, index) {
        context.fillText(item, points[index] - 14, startY + 18);
    });
    context.closePath();
    context.stroke();

    // y轴
    var dataList = opts.series,
        unit = opts.unit ? opts.unit : '元/㎡',
        minData = Math.min.apply(this, dataList),
        maxData = Math.max.apply(this, dataList), limit = getLimit(maxData, minData),
        minRange = findRange(minData, 'lower', limit),
        maxRange = findRange(maxData, 'upper', limit),
        upspace = (endY - startY) / 5 + 2,
        upspace2 = Math.ceil((maxRange - minRange) / 5);
    // 标尺
    context2.setFontSize(12);
    if (minRange != maxRange) {
        for (var i = 0; i < 6; i++) {
            context2.fillText(minRange + i * upspace2, 0, startY + i * upspace);
        }
    }
    else {
        context2.fillText(minRange, 0, startY + (endY - startY) / 2);
    }
    context2.setFontSize(10);
    context2.fillText(unit, 0, endY - 5);
    // 画线
    context.setStrokeStyle("#ff5500");
    context.setLineWidth(1);
    for (var i = 0; i < points.length; i++) {
        if (i == 0) {
            if (minRange != maxRange) {
                context.moveTo(points[0], (1 - (opts.series[0] - minRange) / (maxRange - minRange)) * (startY - endY) + endY);
            }
            else {
                context.moveTo(points[0], (startY - endY) / 2);
            }
        }
        else {
            if (minRange != maxRange) {
                context.lineTo(points[i], (1 - (opts.series[i] - minRange) / (maxRange - minRange)) * (startY - endY) + endY);
            }
            else {
                context.lineTo(points[i], (startY - endY) / 2);
            }
        }
    }
    context.stroke();
    // 画圆
    context.beginPath();
    context.setStrokeStyle("#ffffff");
    context.setFillStyle("#ff5500");
    for (var i = 0; i < points.length; i++) {
        if (minRange != maxRange) {
            context.moveTo(points[i] + 7, (1 - (opts.series[i] - minRange) / (maxRange - minRange)) * (startY - endY) + endY);
            context.arc(points[i], (1 - (opts.series[i] - minRange) / (maxRange - minRange)) * (startY - endY) + endY, 6, 0, 2 * Math.PI, false);
        }
        else {
            context.moveTo(points[i] + 7, (startY - endY) / 2);
            context.arc(points[i], (startY - endY) / 2, 6, 0, 2 * Math.PI, false);
        }
    }
    context.closePath();
    context.fill();
    context.stroke();

    wx.drawCanvas({
        canvasId: 'firstCanvas',
        actions: context.getActions()
    });

    wx.drawCanvas({
        canvasId: 'secondCanvas',
        actions: context2.getActions()
    });
}

module.exports = {
    dataCombine: dataCombine,
    getLimit: getLimit,
    findRange: findRange,
    drawTable: drawTable
}