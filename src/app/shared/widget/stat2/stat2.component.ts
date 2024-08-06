import { Component, Input, OnInit, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-stat2',
  templateUrl: './stat2.component.html',
  styleUrls: ['./stat2.component.scss']
})
export class Stat2Component implements OnInit {

  @Input() title: string;
  @Input() value: string = '0'
  @Input() icon: string;
  @Input() color: string;

  constructor() { }

  ngOnInit(): void {
  }

  bgColor
  ngOnChanges(changes: SimpleChange){
      if(changes['color']){
          this.bgColor = this.hex2rgba(changes['color'].currentValue, 0.2);
      }
  }

  hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  }  ;

}
