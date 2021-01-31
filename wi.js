

windows = [];

window.addEventListener('DOMContentLoaded', function() {
  
  for(let i = 0; i < modules.length; i++) {
    if(modules[i]['type'] == 'windowed') {
      windows.push({});
      windows[i]['name'] = modules[i]['name'];
      windows[i]['id'] = 'w' + ( parseInt(Math.random() * 100000000000));
      windows[i]['win'] = {
        'win': document.createElement('div'),
        'header': document.createElement('div'),
        'resizeButton': document.createElement('div')
      };
      // win setup
      windows[i]['win']['win'].appendChild(windows[i]['win']['header']);
      windows[i]['win']['win'].id = windows[i]['id'];
      windows[i]['win']['win'].className = 'window';
      windows[i]['win']['win'].style.top = '0px';
      windows[i]['win']['win'].style.left = '0px';
      windows[i]['win']['win'].style.width = '300px';
      windows[i]['win']['win'].style.height = '300px';
      //windows[i]['win']['win'].style.overflow = 'hidden';
      windows[i]['win']['win'].style.zIndex = 10000 + i;
      if(modules[i]['sourceType'] == 'href') {
        windows[i]['win']['winFrame'] = document.createElement('iframe');
        windows[i]['win']['winFrame'].src = modules[i]['source'];
        windows[i]['win']['winFrame'].style.width = '100%';
        windows[i]['win']['winFrame'].style.height = '100%';
        windows[i]['win']['winFrame'].style.border = 'none';
        windows[i]['win']['win'].appendChild(windows[i]['win']['winFrame']);
      }
      // header setup
      windows[i]['win']['header'].id = windows[i]['win']['win'].id+'h';
      windows[i]['win']['header'].innerHTML = modules[i]['name'];
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
        window.setTimeout(windows[i]['win']['anim'], 10);
      }
      windows[i]['win']['anim']();
      
      document.body.appendChild(windows[i]['win']['win']);
    }
  }
  
});


mouseX = 0;
mouseY = 0;

document.addEventListener('mousemove', function(mouse) {
  mouseX = mouse.clientX;
  mouseY = mouse.clientY;
});
