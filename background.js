var cpu_history = {'overall': []};
var icon_draw_context;
var done_init = false;

function init() {
  if (done_init) { return; }
  done_init = true;
  chrome.experimental.processes.onUpdatedWithMemory.addListener(receiveProcessInfo);
  icon_draw_context = document.getElementById('canvas').getContext('2d');
  icon_draw_context.fillStyle = '#f6f6f6';
  icon_draw_context.fillRect(0, 0, 19, 19);
  chrome.browserAction.setIcon({imageData: icon_draw_context.getImageData(0, 0, 19, 19)});
}

function receiveProcessInfo(processes) {
  var totalCPU = 0;
  for (pid in processes) {
    totalCPU += processes[pid].cpu;
    if (!cpu_history[pid]) {
      cpu_history[pid] = [];
    }
    cpu_history[pid].unshift(processes[pid].cpu);
    if (cpu_history[pid].length > 350) {
      cpu_history[pid].pop();
    }
  }
  for (pid in cpu_history) {
    if ((pid != 'overall') && !processes[pid]) {
      delete cpu_history[pid];
    }
  }
  cpu_history['overall'].unshift(totalCPU);
  if (cpu_history['overall'].length > 350) {
    cpu_history['overall'].pop();
  }
  draw_cpu_graph(cpu_history['overall'], icon_draw_context, 19, 19, 8, 1, 0);
  chrome.browserAction.setIcon({ imageData: icon_draw_context.getImageData(0, 0, 19, 19) });
  padding = totalCPU < 10 ? ' ' : '';
  chrome.browserAction.setBadgeText({text: padding + Math.floor(totalCPU).toString() + '%' + padding});
  chrome.browserAction.setBadgeBackgroundColor({color:get_color_for_cpu(totalCPU)});
}

function draw_cpu_graph(data, context, width, height, height_offset, col_width, gap_width) {
  context.fillStyle = '#f6f6f6';
  context.fillRect(0, 0, width, height);
  for (var i = 0; i < data.length; i++) {
    var x = width - (i * (col_width + gap_width));
    if (x < 0) break;
    context.strokeStyle = get_color_for_cpu(data[i]);
    context.beginPath();
    context.moveTo(x, height);
    context.lineTo(x, height - height_offset - (Math.min(data[i], 100)*(height - height_offset)/100));
    context.stroke();
  }
}

function get_color_for_cpu(cpu) {
  return cpu > 30 ? '#F00' : '#228B22';
}

document.addEventListener('DOMContentLoaded', init);
