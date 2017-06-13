var cpu_graph_draw_context;
var background_page_window;
var freeze_table = false;
var current_graph = 'overall';
var sort = 'cpu';

function init() {
  var bg = background_page_window = chrome.extension.getBackgroundPage();
  chrome.processes.onUpdatedWithMemory.addListener(console.log);
  chrome.processes.onUpdatedWithMemory.addListener(receiveProcessInfo);
  cpu_graph_draw_context = document.getElementById('cpu_graph').getContext('2d');
  var tbody = document.getElementById("process_list_body");
  var msg = document.getElementById('paused_msg');
  tbody.addEventListener('mouseover', function() {
    freeze_table = true;
    msg.style.display = 'block';
  });
  tbody.addEventListener('mouseout', function() {
    freeze_table = false;
    msg.style.display = 'none';
  });
  document.getElementById('sort').addEventListener('change', function() {
    sort = this.value;
  });
}

function receiveProcessInfo(processes) {
  var tbody = document.getElementById("process_list_body");
  if (tbody && !freeze_table) {
    var totalCPU = 0;
    var table_rows = '';
    var processes_array = [];
    for (pid in processes) {
      processes_array[pid] = processes[pid];
    }
    processes_array.sort(function(a, b) {
      if (sort == 'cpu') return (Math.floor(b.cpu) - 1/b.osProcessId) - (Math.floor(a.cpu) - 1/a.osProcessId);
      else return Math.floor(b.privateMemory) - Math.floor(a.privateMemory);
    });
    for (pid in processes_array) {
      table_rows += displayProcessInfo(processes_array[pid]);
      totalCPU += processes_array[pid].cpu
    }
    tbody.innerHTML = table_rows;
    attach_event_handlers();
  }
  update_graph();
}

function update_graph() {
  if (cpu_graph_draw_context) {
    background_page_window.draw_cpu_graph(background_page_window.cpu_history[current_graph], cpu_graph_draw_context, 700, 100, 0, 2, 1)
  }
}

function getTabInfo(tab) {
  if (t = document.getElementById("tabTitle" + tab.id)) {
    t.innerHTML = ": " + tab.title;
  }
  if (i = document.getElementById("tabIcon" + tab.id)) {
    i.src = tab.favIconUrl;
    i.style.visibility = 'visible';
  }
}

function displayProcessInfo(process) {
  var row_html = '';
  var memory = (process.privateMemory / 1024 / 1024).toFixed(0) + " Mb";
  var tab = process.tasks[0];
  var tabId = tab.tabId;
  if (tabId) {
    chrome.tabs.get(tabId, getTabInfo);
    process.type = 'Tab';
  } else {
    if (process.type == 'renderer') {
      process.type = 'Background page';
    }
    if (process.type != 'browser') {
      process.type += ' [#' + process.id + ']';
    }
  }
  var row_class = process.cpu > 10 ? 'warn' : '';
  if (process.id == current_graph) {
    row_class += ' selected';
  }
  row_html += '<tr class="' + row_class + '" data-tabid="' + (tab.tabId || '') + '" data-pid="' + process.id + '">' +
    '<td class="cpu">' + Math.floor(process.cpu) + '%</td>' +
    '<td class="memory">' + memory + '</td>' +
    '<td class="process"><img width="16" height="16" id="tabIcon' + tab.tabId + '" style="visibility: hidden;">' + ucfirst(process.type) + '<span id="tabTitle' + tab.tabId + '"></span></td>' +
    '<td class="actions">';
  if (process.type == 'Tab') {
    row_html += '<button class="reload">Reload</button><button class="close">Close</button>';
  }
  row_html += '<button class="terminate"' + (process.type == 'browser' ? ' style="visibility:hidden;"' : '') + '>Terminate</button>';
  row_html += '</td>' +
    '</tr>\n';
  return row_html;
}

function attach_event_handlers() {
  attach_handler('#process_list_body tr', 'click', select_process);
  attach_handler('button.reload', 'click', reload_tab);
  attach_handler('button.close', 'click', close_tab);
  attach_handler('button.terminate', 'click', terminate);
}

function attach_handler(selector, event, handler) {
  es = document.querySelectorAll(selector);
  for (var i = 0; i < es.length; i++) {
    es[i].addEventListener('click', handler);
  }
}

function select_process(e) {
  var pid = (+this.dataset.pid);
  if (current_graph == pid) {
    current_graph = 'overall';
    this.classList.remove('selected');
  } else {
    rs = this.parentNode.children;
    for (var i = 0; i < rs.length; i++) {
      rs[i].classList.remove('selected');
    }
    current_graph = pid;
    this.classList.add('selected');
  }
  update_graph();
}

function terminate(e) {
  chrome.processes.terminate(+this.parentNode.parentNode.dataset.pid, function(result) {
    if (!result) {
      alert('Sorry, this process could not be terminated.');
    }
  });
  e.stopPropagation();
}

function reload_tab(e) {
  chrome.tabs.reload(+this.parentNode.parentNode.dataset.tabid);
  e.stopPropagation();
}

function close_tab(e) {
  chrome.tabs.remove(+this.parentNode.parentNode.dataset.tabid);
  e.stopPropagation();
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', init);
