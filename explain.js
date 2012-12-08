// [导出]
exports.Explain = Explain;

// [函数]
function Explain() {
	
	this.stack = [];
	this.stackBroken = false;

	this.enter = enter;
	this.leave = leave;
	this.printLn = printLn;
	this.showLog = showLog;

	this.stack.push({
		name: '$explain$',
		flow: []
	});
}

function enter() {
	//console.log('enter %s', name);
	var stack = this.stack;
	var current = {
		name: enter.caller.name,
		flow: []
	};
	stack.push(current);

	var parent = stack[stack.length-2];
	if (parent) {
		parent.flow.push(current);
	}
}

function leave() {
	if (this.stackBroken) return;
	var stack = this.stack;
	var current = stack.pop();
	if (current) {
		if (current.name !== leave.caller.name) {
			stackBroken = true;
			var str = 'broken enter/leave balance in ' + leave.caller.name;
			throw str;
		}
	}
	//console.log('leave %s', current.name);
	return current;
}

function printLn(line) {
	var stack = this.stack;
	if (!stack) return;
	var current = stack[stack.length-1];
	if (!current) return;
	current.flow.push(line);
}

function showLog() {
	var stack = this.stack;
	var root = stack[0];
	if (!root) return;
	show(0, root);

	function show(level, target) {
		if (!target) return;
		var s = space(level);
		console.log('%s[%s]', s, target.name);
		for (var i = 0, c = 1; i < target.flow.length; ++i) {
			var item = target.flow[i];
			if (typeof item === 'string') {
				console.log('%s%d. %s', s, c++, item);
			} else {
				show(level+1, item);
			}
		}
	}

	function space(level) {
		var s = '';
		while (level-- > 0) {
			s += '    ';
		}
		return s;
	}
}