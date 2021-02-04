
windows = [];
panels = [];

function include_module(url, type, mNum) {
  let script = document.createElement('script');
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
  script.addEventListener('load', function() {
    if(type == 'window') windows[mNum]['object']['preInit']();
    if(type == 'panel') panels[mNum]['object']['preInit']();
  });
}

window.addEventListener('DOMContentLoaded', function() {
  
  for(let i = 0; i < modules.length; i++) {
    if(modules[i]['type'] == 'windowed') {
      windows.push({});
      let ii = windows.length - 1;
      windows[ii]['name'] = modules[i]['name'];
      windows[ii]['win'] = {
        'win': document.createElement('div'),
        'header': document.createElement('div'),
        'resizeButton': document.createElement('div')
      };
      // win setup
      windows[ii]['win']['win'].appendChild(windows[ii]['win']['header']);
      windows[ii]['win']['win'].className = 'window';
      if(localStorage.getItem(windows[ii]['name']) == null) {
        windows[ii]['win']['win'].style.top = '0px';
        windows[ii]['win']['win'].style.left = '0px';
        windows[ii]['win']['win'].style.width = '300px';
        windows[ii]['win']['win'].style.height = '300px';
      }
      else {
        let wInfo = JSON.parse(localStorage.getItem(windows[ii]['name']));
        windows[ii]['win']['win'].style.top = wInfo['top'];
        windows[ii]['win']['win'].style.left = wInfo['left'];
        windows[ii]['win']['win'].style.width = wInfo['width'];
        windows[ii]['win']['win'].style.height = wInfo['height'];
      }
      windows[ii]['win']['win'].style.zIndex = 10000 + i;
      if(modules[i]['sourceType'] == 'href') {
        windows[ii]['win']['winFrame'] = document.createElement('iframe');
        windows[ii]['win']['winFrame'].src = modules[i]['source'];
        windows[ii]['win']['winFrame'].style.width = '100%';
        windows[ii]['win']['winFrame'].style.height = '100%';
        windows[ii]['win']['winFrame'].style.border = 'none';
        windows[ii]['win']['win'].appendChild(windows[ii]['win']['winFrame']);
      }
      else if(modules[i]['sourceType'] == 'local') {
        windows[ii]['win']['win']['body'] = document.createElement('div');
        windows[ii]['win']['win'].appendChild(windows[ii]['win']['win']['body']);
        include_module(modules[i]['source'], 'window', ii);
        windows[ii]['object'] = {};
        windows[ii]['object']['preInit'] = function() {
          windows[ii]['object']['structure'] = window[modules[i]['name']];
          windows[ii]['object']['structure']['init']();
          if(windows[ii]['object']['structure']['update']) 
            window.setInterval(function() { windows[ii]['object']['structure']['update']() }, windows[ii]['object']['structure']['updateTime']);
          if(windows[ii]['object']['structure']['html']) 
            windows[ii]['win']['win']['body'].innerHTML += windows[ii]['object']['structure']['html'];
          if(windows[ii]['object']['structure']['css']) {
            let newStyles = document.createElement('style');
            newStyles.innerText = windows[ii]['object']['structure']['css'];
            document.head.appendChild(newStyles);
          }
        }
      }
      // header setup
      windows[ii]['win']['header'].innerHTML = modules[i]['title'];
      windows[ii]['win']['header'].className = 'windowHeader';
      windows[ii]['win']['header'].appendChild(windows[ii]['win']['resizeButton']);
      // buttons setup
      windows[ii]['win']['resizeButton'].className = "windowHeaderResize";
      // functional configs
      windows[ii]['win']['moving'] = false;
      windows[ii]['win']['resizing'] = false;
      windows[ii]['win']['win'].addEventListener('mousedown', function() {
        let maxIndex = 0;
        for(let j = 0; j < windows.length; j++) if(maxIndex < parseInt(windows[j]['win']['win'].style.zIndex)) maxIndex = parseInt(windows[j]['win']['win'].style.zIndex);
        windows[ii]['win']['win'].style.zIndex = parseInt(maxIndex) + 1;
      });
      windows[ii]['win']['header'].addEventListener('mousedown', function() {
        windows[ii]['win']['moving'] = true;
        windows[ii]['win']['mouseCatch']['x'] = mouseX - parseInt(windows[ii]['win']['win'].style.left);
        windows[ii]['win']['mouseCatch']['y'] = mouseY - parseInt(windows[ii]['win']['win'].style.top);
        if(modules[i]['sourceType'] == 'href') windows[ii]['win']['winFrame'].style.display = 'none';
      });
      windows[ii]['win']['header'].addEventListener('mouseup', function() {
        windows[ii]['win']['moving'] = false;
        if(modules[i]['sourceType'] == 'href') windows[ii]['win']['winFrame'].style.display = '';
      });
      windows[ii]['win']['resizeButton'].addEventListener('mousedown', function() {
        windows[ii]['win']['resizing'] = true;
        windows[ii]['win']['mouseCatch']['screenX'] = mouseX;
        windows[ii]['win']['mouseCatch']['screenY'] = mouseY;
      });
      windows[ii]['win']['resizeButton'].addEventListener('mouseup', function() {
        windows[ii]['win']['resizing'] = false;
      });
      windows[ii]['win']['mouseCatch'] = {};
      windows[ii]['win']['mouseCatch']['x'] = 0;
      windows[ii]['win']['mouseCatch']['y'] = 0;
      windows[ii]['win']['mouseCatch']['screenX'] = 0;
      windows[ii]['win']['mouseCatch']['screenY'] = 0;
      windows[ii]['win']['anim'] = function(mouse) {
        if(windows[ii]['win']['moving']) {
          windows[ii]['win']['win'].style.top = mouseY-windows[ii]['win']['mouseCatch']['y'] + 'px';
          windows[ii]['win']['win'].style.left = mouseX-windows[ii]['win']['mouseCatch']['x'] + 'px';
        }
        
        if(windows[ii]['win']['resizing']) {
          windows[ii]['win']['win'].style.width = parseInt(windows[ii]['win']['win'].style.width) + windows[ii]['win']['mouseCatch']['screenX'] - mouseX + 'px';
          windows[ii]['win']['win'].style.height = parseInt(windows[ii]['win']['win'].style.height) + windows[ii]['win']['mouseCatch']['screenY'] - mouseY + 'px';
          windows[ii]['win']['mouseCatch']['screenX'] = mouseX;
          windows[ii]['win']['mouseCatch']['screenY'] = mouseY;
        }
        if(modules[i]['sourceType'] == 'href') {
          windows[ii]['win']['winFrame'].style.width = windows[ii]['win']['win'].style.width;
          windows[ii]['win']['winFrame'].style.height = parseInt(windows[ii]['win']['win'].style.height) - 15 + 'px';
        }
        let wInfo = JSON.stringify({
          'top': windows[ii]['win']['win'].style.top,
          'left': windows[ii]['win']['win'].style.left,
          'width': windows[ii]['win']['win'].style.width,
          'height': windows[ii]['win']['win'].style.height
        });
        localStorage.setItem(windows[ii]['name'], wInfo);
        window.setTimeout(windows[ii]['win']['anim'], 10);
      }
      windows[ii]['win']['anim']();
      document.body.appendChild(windows[ii]['win']['win']);
    }
    if(modules[i]['type'] == 'panel') {
      panels.push({});
      let ii = panels.length - 1;
      panels[ii]['name'] = modules[i]['name'];
      panels[ii]['panel'] = {
        'panel': document.createElement('div')
      };
      panels[ii]['panel']['panel'].className = 'panel';
      panels[ii]['panel']['panel'].style.width = modules[i]['panel']['width'];
      panels[ii]['panel']['panel'].style.height = modules[i]['panel']['height'];
      if(modules[i]['panel']['left']) panels[ii]['panel']['panel'].style.left = modules[i]['panel']['left'];
      if(modules[i]['panel']['right']) panels[ii]['panel']['panel'].style.right = modules[i]['panel']['right'];
      if(modules[i]['panel']['top']) panels[ii]['panel']['panel'].style.top = modules[i]['panel']['top'];
      if(modules[i]['panel']['bottom']) panels[ii]['panel']['panel'].style.bottom = modules[i]['panel']['bottom'];
      // local
      panels[ii]['panel']['panel']['body'] = document.createElement('div');
      panels[ii]['panel']['panel'].appendChild(panels[ii]['panel']['panel']['body']);
      include_module(modules[i]['source'], 'panel', ii);
      panels[ii]['object'] = {};
      panels[ii]['object']['preInit'] = function() {
        panels[ii]['object']['structure'] = window[modules[i]['name']];
        panels[ii]['object']['structure']['init']();
        if(panels[ii]['object']['structure']['update']) 
          window.setInterval(function() { panels[ii]['object']['structure']['update']() }, panels[ii]['object']['structure']['updateTime']);
        if(panels[ii]['object']['structure']['html']) 
          panels[ii]['panel']['panel']['body'].innerHTML += panels[ii]['object']['structure']['html'];
        if(panels[ii]['object']['structure']['css']) {
          let newStyles = document.createElement('style');
          newStyles.innerText = panels[ii]['object']['structure']['css'];
          document.head.appendChild(newStyles);
        }
      }
      document.body.appendChild(panels[ii]['panel']['panel']);
      
    }
  }
  
});


mouseX = 0;
mouseY = 0;

window.addEventListener('mousemove', function(mouse) {
  mouseX = mouse.clientX;
  mouseY = mouse.clientY;
});
