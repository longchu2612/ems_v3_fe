import { Component, OnInit, Input, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { BaseChartDirective, Color } from 'ng2-charts';

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
    @ViewChild('myCanvas') canvas: ElementRef;

    @Input() title: string;
    @Input() value: string;
    @Input() icon: string;
    @Input() color: string = '#1B4965';
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    public lineChartColors: Color[] = [
        {
            borderColor: 'black',
            backgroundColor: 'rgba(255,0,0,0.3)',
        },
    ];
    lineAreaChart = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
        datasets: [
            {
                // label: 'Monthly Earnings',
                // backgroundColor: 'rgba(225,10,24,0.2)',
                // borderColor: 'rgba(225,10,24,0.2)',
                // pointBackgroundColor: 'rgba(225,10,24,0.2)',
                // pointBorderColor: '#fff',
                // pointHoverBackgroundColor: '#fff',
                // pointHoverBorderColor: 'rgba(225,10,24,0.2)',

                // fillColor: 'red',
                // fill: 'origin',
                // lineTension: 0.5,
                // // backgroundColor: '',
                // // borderColor: this.color,
                // borderCapStyle: 'butt',
                // borderDash: [],
                // borderDashOffset: 0.0,
                // borderJoinStyle: 'miter',
                // // pointBorderColor: this.color,
                // // pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                // // pointHoverBackgroundColor: this.color,
                // // pointHoverBorderColor: '#eef0f2',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [80, 23, 56, 65, 23, 35, 85, 25, 92, 36]
            }
        ],
        options: {
            // defaultFontColor: '#8791af',
            // responsive: true,
            // maintainAspectRatio: false,
            legend: {
                display: false
            },
            plugins: {
                legend: {
                    display: false
                },
                customCanvasBackgroundColor: {
                    color: 'lightGreen',
                },
                // backgroundColor: 'transparent'

            },
            scales: {
                xAxes: [
                    {
                        display: false,

                    },
                ],
                yAxes: [
                    {
                        display: false,
                        // ticks: {
                        //     max: 100,
                        //     min: 20,
                        //     stepSize: 10,
                        // },
                        // gridLines: {
                        //     color: 'rgba(166, 176, 207, 0.1)',
                        // },
                    },
                ],
            },

        }
    };
    constructor() { }
    ngOnInit(): void {
        // if(this.canvas){
        console.log(this.canvas)

        // }
        this.bgColor = this.hex2rgba(this['color'], 0.2);
    }

    ngAfterViewInit() {
        console.log(this.canvas)
        const gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 80);
        gradient.addColorStop(0, this.bgColor);
        gradient.addColorStop(1, 'transparent');
        this.lineChartColors = [
            {
                borderColor: this.color,
                backgroundColor: gradient
            }
        ];
    }

    bgColor
    ngOnChanges(changes: SimpleChange) {
        if (changes['color']) {
            this.bgColor = this.hex2rgba(changes['color'].currentValue, 0.2);
            // this.chart.chart.update()
        }
    }

    hex2rgba = (hex, alpha = 1) => {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    };



}
