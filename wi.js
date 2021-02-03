
windows = [];

function include_module(url, wNum) {
  let script = document.createElement('script');
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
  script.addEventListener('load', function() {
    windows[wNum]['object']['preInit']();
  });
}

window.addEventListener('DOMContentLoaded', function() {
  
  for(let i = 0; i < modules.length; i++) {
    if(modules[i]['type'] == 'windowed') {
      windows.push({});
      
      windows[i]['name'] = modules[i]['name'];
      windows[i]['win'] = {
        'win': document.createElement('div'),
        'header': document.createElement('div'),
        'resizeButton': document.createElement('div')
      };
      // win setup
      windows[i]['win']['win'].appendChild(windows[i]['win']['header']);
      windows[i]['win']['win'].className = 'window';
      if(localStorage.getItem(windows[i]['name']) == null) {
        windows[i]['win']['win'].style.top = '0px';
        windows[i]['win']['win'].style.left = '0px';
        windows[i]['win']['win'].style.width = '300px';
        windows[i]['win']['win'].style.height = '300px';
      }
      else {
        let wInfo = JSON.parse(localStorage.getItem(windows[i]['name']));
        windows[i]['win']['win'].style.top = wInfo['top'];
        windows[i]['win']['win'].style.left = wInfo['left'];
        windows[i]['win']['win'].style.width = wInfo['width'];
        windows[i]['win']['win'].style.height = wInfo['height'];
      }
      windows[i]['win']['win'].style.zIndex = 10000 + i;
      if(modules[i]['sourceType'] == 'href') {
        windows[i]['win']['winFrame'] = document.createElement('iframe');
        windows[i]['win']['winFrame'].src = modules[i]['source'];
        windows[i]['win']['winFrame'].style.width = '100%';
        windows[i]['win']['winFrame'].style.height = '100%';
        windows[i]['win']['winFrame'].style.border = 'none';
        windows[i]['win']['win'].appendChild(windows[i]['win']['winFrame']);
      }
      else if(modules[i]['sourceType'] == 'local') {
        windows[i]['win']['win']['body'] = document.createElement('div');
        windows[i]['win']['win'].appendChild(windows[i]['win']['win']['body']);
        include_module(modules[i]['source'], i);
        windows[i]['object'] = {};
        windows[i]['object']['preInit'] = function() {
          windows[i]['object']['structure'] = window[modules[i]['name']];
          windows[i]['object']['structure']['init']();
          if(windows[i]['object']['structure']['update']) 
            window.setInterval(function() { windows[i]['object']['structure']['update']() }, windows[i]['object']['structure']['updateTime']);
          if(windows[i]['object']['structure']['html']) 
            windows[i]['win']['win']['body'].innerHTML += windows[i]['object']['structure']['html'];
          if(windows[i]['object']['structure']['css']) {
            let newStyles = document.createElement('style');
            newStyles.innerText = windows[i]['object']['structure']['css'];
            document.head.appendChild(newStyles);
          }
        }
      }
      // header setup
      windows[i]['win']['header'].innerHTML = modules[i]['title'];
      windows[i]['win']['header'].className = 'windowHeader';
      windows[i]['win']['header'].appendChild(windows[i]['win']['resizeButton']);
      // buttons setup
      windows[i]['win']['resizeButton'].className = "windowHeaderResize";
      // functional configs
      windows[i]['win']['moving'] = false;
      windows[i]['win']['resizing'] = false;
      windows[i]['win']['win'].addEventListener('mousedown', function() {
        let maxIndex = 0;
        for(let j = 0; j < windows.length; j++) if(maxIndex < parseInt(windows[j]['win']['win'].style.zIndex)) maxIndex = parseInt(windows[j]['win']['win'].style.zIndex);
        windows[i]['win']['win'].style.zIndex = parseInt(maxIndex) + 1;
      });
      windows[i]['win']['header'].addEventListener('mousedown', function() {
        windows[i]['win']['moving'] = true;
        windows[i]['win']['mouseCatch']['x'] = mouseX - parseInt(windows[i]['win']['win'].style.left);
        windows[i]['win']['mouseCatch']['y'] = mouseY - parseInt(windows[i]['win']['win'].style.top);
      });
      windows[i]['win']['header'].addEventListener('mouseup', function() {
        windows[i]['win']['moving'] = false;
      });
      windows[i]['win']['resizeButton'].addEventListener('mousedown', function() {
        windows[i]['win']['resizing'] = true;
        windows[i]['win']['mouseCatch']['screenX'] = mouseX;
        windows[i]['win']['mouseCatch']['screenY'] = mouseY;
      });
      windows[i]['win']['resizeButton'].addEventListener('mouseup', function() {
        windows[i]['win']['resizing'] = false;
      });
      windows[i]['win']['mouseCatch'] = {};
      windows[i]['win']['mouseCatch']['x'] = 0;
      windows[i]['win']['mouseCatch']['y'] = 0;
      windows[i]['win']['mouseCatch']['screenX'] = 0;
      windows[i]['win']['mouseCatch']['screenY'] = 0;
      windows[i]['win']['anim'] = function(mouse) {
        if(windows[i]['win']['moving']) {
          windows[i]['win']['win'].style.top = mouseY-windows[i]['win']['mouseCatch']['y'] + 'px';
          windows[i]['win']['win'].style.left = mouseX-windows[i]['win']['mouseCatch']['x'] + 'px';
        }
        
        if(windows[i]['win']['resizing']) {
          windows[i]['win']['win'].style.width = parseInt(windows[i]['win']['win'].style.width) + windows[i]['win']['mouseCatch']['screenX'] - mouseX + 'px';
          windows[i]['win']['win'].style.height = parseInt(windows[i]['win']['win'].style.height) + windows[i]['win']['mouseCatch']['screenY'] - mouseY + 'px';
          windows[i]['win']['mouseCatch']['screenX'] = mouseX;
          windows[i]['win']['mouseCatch']['screenY'] = mouseY;
        }
        if(modules[i]['sourceType'] == 'href') {
          windows[i]['win']['winFrame'].style.width = windows[i]['win']['win'].style.width;
          windows[i]['win']['winFrame'].style.height = parseInt(windows[i]['win']['win'].style.height) - 15 + 'px';
        }
        let wInfo = JSON.stringify({
          'top': windows[i]['win']['win'].style.top,
          'left': windows[i]['win']['win'].style.left,
          'width': windows[i]['win']['win'].style.width,
          'height': windows[i]['win']['win'].style.height
        });
        localStorage.setItem(windows[i]['name'], wInfo);
        window.setTimeout(windows[i]['win']['anim'], 10);
      }
      windows[i]['win']['anim']();
      document.body.appendChild(windows[i]['win']['win']);
    }
  }
  
});


mouseX = 0;
mouseY = 0;

window.addEventListener('mousemove', function(mouse) {
  mouseX = mouse.clientX;
  mouseY = mouse.clientY;
});
