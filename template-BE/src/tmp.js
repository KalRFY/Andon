import "./styles.css";
import Chart from "chart.js";
import * as lib from "./lib/lib";
import { default as $ } from "./lib/jq";
import * as data from "./json/data.json";
var ctx = $("#myChart");
var myChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ['FY18/19', 'FY 19/20', 'FY 21/22', 'FY 22/23', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: "FY",
                data: [
                    3, 3, 6, 2.8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: 'black',
                backgroundColor: 'black'
            },
            {
                label: "Actual",
                data: [
                    0, 0, 0, 0, 4, 3, 3, 2, 1, 4, 0, 0, 0, 0, 0, 0],
                borderColor: 'pink',
                backgroundColor: 'pink'
            },
            {
                label: "Target",
                data: [, , , , 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
                type: 'line',
                fill: false,
                borderDash: [2, 2],
                borderColor: 'red',
                backgroundColor: 'red',
            }
        ]
    },
    options: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: "Jumlah Mayor Problem"
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 10,
                        stepSize: 2
                    }
                }
            ]
        }
    }
});