import { $computed, $effect } from "rippling";
import * as echarts from "echarts";

const favaSession = $computed(() => {
    return {
        get: async (path: string) => {
            const url = "/Portfolio/" + path
            const res = await fetch(url)
            return res.json()
        }
    }
});

export const navIndex = $computed((get) => {
    const api = get(favaSession);
    return api.get("nav_index" + window.location.search);
});

export const cashFlows = $computed((get) => {
    const api = get(favaSession);
    return api.get("cash_flows" + window.location.search);
});

export const investments = $computed((get) => {
    const api = get(favaSession);
    return api.get("investments" + window.location.search);
});

export const pnl = $computed((get) => {
    const api = get(favaSession);
    return api.get("pnl" + window.location.search);
});

const calendarReturns = $computed((get) => {
    const api = get(favaSession);
    return api.get("calendar_returns" + window.location.search);
});

export const cumulativeReturns = $computed((get) => {
    const api = get(favaSession);
    return api.get("cumulative_returns" + window.location.search);
});

export const irrSummary = $computed((get) => {
    const api = get(favaSession);
    return api.get("irr_summary" + window.location.search);
});

export const navIndexChartOptions = $computed(async (get) => {
    const data = await get(navIndex);

    const lastDate = data[data.length - 1][0];
    const [year, compareMonth, compareDay] = lastDate
        .split("-")
        .map((x) => parseInt(x, 10));
    const compareYear = year - 3;

    let index = 0;
    for (const [date] of data) {
        const [year, month, day] = date.split("-").map((x: string) => parseInt(x, 10));
        if (year > compareYear) {
            break;
        }

        if (year === compareYear && month > compareMonth) {
            break;
        }

        if (year === compareYear && month === compareMonth && day >= compareDay) {
            break;
        }

        index++;
    }
    const startRatio = index / data.length;

    return {
        xAxis: {
            type: "time",
        },
        yAxis: {
            type: "value",
            axisLabel: {
                formatter: function (params: number) {
                    return params.toFixed(2);
                },
            },
            min: "dataMin",
            max: "dataMax",
        },
        tooltip: {
            trigger: "axis",
            formatter: function (params: { data: number[] }[]) {
                return params[0].data[0] + "<br>" + params[0].data[1].toFixed(2);
            },
        },
        series: [
            {
                type: "line",
                showSymbol: false,
                data: data,
            },
        ],
        grid: {
            x: 60,
            y: 20,
            x2: 20,
            y2: 60,
        },
        dataZoom: [
            {
                type: "inside",
                start: startRatio * 100,
                end: 100,
            },
            {
                start: startRatio * 100,
                end: 100,
            },
        ],
    }
})

export const calendarReturnsChartOptions = $computed(async (get) => {
    const data = await get(calendarReturns);
    return {
        xAxis: {
            type: "category",
            axisLabel: {
                formatter: (value: string) => {
                    return new Date(Date.parse(value) - 86400000).getFullYear();
                },
            },
        },
        yAxis: {
            type: "value",
            axisLabel: {
                formatter: function (params: number) {
                    return (params * 100).toFixed(1) + "%";
                },
            },
        },
        tooltip: {
            trigger: "axis",
            formatter: function (params: { data: number[] }[]) {
                return (
                    params[0].data[0] +
                    "<br>" +
                    (params[0].data[1] * 100).toFixed(1) +
                    "%"
                );
            },
        },
        series: [
            {
                type: "bar",
                data: data[0],
                itemStyle: {
                    color: (params: { value: number[] }) => {
                        return params.value[1] > 0 ? "#3daf46" : "#af3d3d";
                    },
                },
                label: {
                    show: true,
                    position: "top",
                    formatter: (params: { data: number[] }) => {
                        return (params.data[1] * 100).toFixed(1) + "%";
                    },
                },
            },
        ],
        grid: {
            x: 60,
            y: 20,
            x2: 20,
            y2: 60,
        },
    }
})

export const renderNavIndex = $effect(async (get, _set, elem: HTMLDivElement) => {
    const options = await get(navIndexChartOptions);
    echarts.init(elem).setOption(options);
});

export const renderCalendarReturns = $effect(async (get, _set, elem: HTMLDivElement) => {
    const options = await get(calendarReturnsChartOptions);
    echarts.init(elem).setOption(options);
});