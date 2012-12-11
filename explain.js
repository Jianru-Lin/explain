// [导出]
exports.Explain = Explain;

// [函数]
function Explain() {
	
	this.stack = [];
	this.stackBroken = false;
	this.current = null;

	this.enter = enter;
	this.leave = leave;
	this.printLn = printLn;
	this.showLog = showLog;
	this.proxy = proxy;

	this.stack.push({
		name: '$explain$',
		flow: []
	});
}

function enter() {
	var stack = this.stack;
	var current = {
		name: enter.caller.name,
		flow: []
	};

	stack.push(current);

	var parent = this.current || stack[stack.length-2];
	if (parent) {
		parent.flow.push(current);
	}

	this.current = current;
	return current;
}

function leave() {
	var stack, current;

	if (this.stackBroken) return;
	this.current = null;
	stack = this.stack;
	current = stack.pop();
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

function proxy(callback) {
	debugger;
	// [变量]
	var self, reserved;

	// [流程]
	self = this;
	reserved = {
		name: '$reserved$',
		flow: []
	};
	this.current.flow.push(reserved); 
	return callbackProxy;

	// [函数]
	function callbackProxy() {
		debugger;
		// [变量]
		var oldCurrent, result;

		// [流程]
		oldCurrent = self.current;
		self.current = reserved;
		try {
			result = callback(); // 这里没有考虑参数传递和函数的绑定问题，需要改进
			return result;
		} finally {
			self.current = oldCurrent;
		}
	}
}

function showLog() {
	var stack = this.stack;
	var root = stack[0];
	if (!root) return;

	for (var i = 0, c = 1; i < root.flow.length; ++i) {
		var item = root.flow[i];
		if (typeof item === 'string') {
			console.log('%d. %s', c++, item);
		} else {
			show(0, item);
		}
	}

	function show(level, target) {
		if (!target) return;
		var s = space(level);
		console.log('%s[%s]', s, target.name || '#anonymous');
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