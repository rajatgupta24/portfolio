console.log(window)

(function(window){
    function Dotline(option){
        this.opt = this.extend({
            dom:'dot_line',
            cw:1000,
            ch:500,
            ds:100,
            r:0.5,
            cl:'#000',
            dis:100
        },option);
        this.c = document.getElementById(this.opt.dom);
        this.ctx = this.c.getContext('2d');
        this.c.width = this.opt.cw;
        this.c.height = this.opt.ch;
        this.dotSum = this.opt.ds;
        this.radius = this.opt.r;
        this.disMax = this.opt.dis*this.opt.dis;
        this.color = this.color2rgb(this.opt.cl);
        this.dots = [];
        
        var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        var _self = this;
        
        var mousedot = {x:null,y:null,label:'mouse'};
        this.c.onmousemove = function(e){
            var e = e || window.event;
            mousedot.x = e.clientX - _self.c.offsetLeft;
            mousedot.y = e.clientY - _self.c.offsetTop;
        };
        this.c.onmouseout = function(e){
            mousedot.x = null;
            mousedot.y = null;
        }
        
        this.animate = function(){
            _self.ctx.clearRect(0, 0, _self.c.width, _self.c.height);
            _self.drawLine([mousedot].concat(_self.dots));
            RAF(_self.animate);
        };
    }
    
    Dotline.prototype.extend = function(o,e){
        for(var key in e){
            if(e[key]){
                o[key]=e[key]
            }
        }
        return o;
    };
    
    Dotline.prototype.color2rgb = function(colorStr){
        var red = null,
            green = null,
            blue = null;
        var cstr = colorStr.toLowerCase();
        var cReg = /^#[0-9a-fA-F]{3,6}$/;
        if(cstr&&cReg.test(cstr)){
            if(cstr.length==4){
                var cstrnew = '#';
                for(var i=1;i<4;i++){
                    cstrnew += cstr.slice(i,i+1).concat(cstr.slice(i,i+1));
                }
                cstr = cstrnew;
            }
            red = parseInt('0x'+cstr.slice(1,3));
            green = parseInt('0x'+cstr.slice(3,5));
            blue = parseInt('0x'+cstr.slice(5,7));
        }
        return red+','+green+','+blue;
    }
    
    Dotline.prototype.addDots = function(){
        var dot;
        for(var i=0; i<this.dotSum; i++){
            dot = {
                x : Math.floor(Math.random()*this.c.width)-this.radius,
                y : Math.floor(Math.random()*this.c.height)-this.radius,
                ax : (Math.random() * 2 - 1) / 1.5,
                ay : (Math.random() * 2 - 1) / 1.5
            }
            this.dots.push(dot);
        }
    };
    
    Dotline.prototype.move = function(dot){
        dot.x += dot.ax;
        dot.y += dot.ay;
        
        dot.ax *= (dot.x>(this.c.width-this.radius)||dot.x<this.radius)?-1:1;
        dot.ay *= (dot.y>(this.c.height-this.radius)||dot.y<this.radius)?-1:1;
        
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, this.radius, 0, Math.PI*2, true);
        this.ctx.stroke();
    };
    
    Dotline.prototype.drawLine = function(dots){
        var nowDot;
        var _that = this;
        
        this.dots.forEach(function(dot){
            
            _that.move(dot);
            for(var j=0; j<dots.length; j++){
                nowDot = dots[j];
                if(nowDot===dot||nowDot.x===null||nowDot.y===null) continue;
                var dx = dot.x - nowDot.x,
                    dy = dot.y - nowDot.y;
                var dc = dx*dx + dy*dy;
                if(Math.sqrt(dc)>Math.sqrt(_that.disMax)) continue;
                
                if (nowDot.label && Math.sqrt(dc) >Math.sqrt(_that.disMax)/2) {
                    dot.x -= dx * 0.02;
                    dot.y -= dy * 0.02;
                }
                var ratio;
                ratio = (_that.disMax - dc) / _that.disMax;
                _that.ctx.beginPath();
                _that.ctx.lineWidth = ratio / 2;
                  _that.ctx.strokeStyle = 'rgba('+_that.color+',' + parseFloat(ratio + 0.2).toFixed(1) + ')';
                _that.ctx.moveTo(dot.x, dot.y);
                _that.ctx.lineTo(nowDot.x, nowDot.y);
                _that.ctx.stroke();

                
            }
        });
    };
    
    Dotline.prototype.start = function(){
        var _that = this;
        this.addDots();
        setTimeout(function() {
             _that.animate();
        }, 100);
    }
    window.Dotline = Dotline;
}(window));
