var fs = require('fs');

var loadFrom = process.argv[2];
var saveTo = process.argv[3];

if (!loadFrom) {
	showUsage();
} else {
	saveTo = saveTo || 'xpl.' + loadFrom;
	preprocessor(loadFrom, saveTo);
}

function showUsage() {
	console.log('node.exe xplconv.js input [output]');
}

function preprocessor(loadFrom, saveTo) {
	// [变量]
	var before = null,
		after = null;

	// [流程]
	//@enter
	if (!loadFrom || !saveTo) {
		//> 参数无效
		return false;
	}
	return load() && preprocess() && save();
	//@leave

	// [函数]
	function load() {
		//@enter
		if (!fs.existsSync(loadFrom)) {
			//> 文件不存在
			return false;
		}
		try {
			//> 准备以 utf8 编码读取文件...
			before = fs.readFileSync(loadFrom, 'utf8');
			//> 读取文件成功
			return true;
		} catch(err) {
			//> 读取文件时发生错误
			return false;
		}
		//@leave
	}

	function preprocess() {
		// [变量]
		var varName = 'e7b4_xpl',
			enterPattern = new RegExp('^(\\s*)//@enter', 'gm'),
			leavePattern = new RegExp('^(\\s*)//@leave', 'gm'),
			printLnPattern = new RegExp('^(\\s*)//>(.*)', 'gm');

		// [流程]
		//@enter
		if (before === undefined || before === null) {
			//> 程序员错误：before 变量为 undefined 或 null
			return false;
		}
		after = before;
		replaceEnter();
		replaceLeave();
		replacePrintLn();
		prependHead();
		appendFoot();
		return true;
		//@leave

		// [函数]
		function replaceEnter() {
			//@enter
			//> 替换所有的 //@enter 为 xpl.enter(); try {
			after = after.replace(enterPattern, replaceCallback);
			//@leave

			function replaceCallback(g0, g1) {
				return g1 + varName + '.enter(); try {';
			}
		}

		function replaceLeave() {
			//@enter
			//> 替换所有的 //@leave 为 } finally { leave(); }
			after = after.replace(leavePattern, replaceCallback);
			//@leave

			function replaceCallback(g0, g1) {
				return g1 + '} finally { ' + varName + '.leave(); }';
			}
		}

		function replacePrintLn() {
			//@enter
			//> 替换所有的 //> ... 为 printLn(...)
			after = after.replace(printLnPattern, replaceCallback);
			//@leave

			function replaceCallback(g0, g1, g2) {
				return g1 + varName + '.printLn(\'' + g2 + '\');';
			}
		}

		function prependHead() {
			//@enter
			//> 添加 Head
			after = head() + '\r\n' + after;
			//@leave

			function head() {
				return 'var ' + varName + ' = function(){ var Explain = require(\'explain\').Explain; var e = new Explain(); return e; }();'
			}
		}

		function appendFoot() {
			//@enter
			//> 添加 Foot
			after = after + '\r\n' + varName + '.showLog()';
			//@leave
		}
	}

	function save() {
		//@enter
		if (after === undefined || after === null) {
			//> 程序员错误：after 变量根本为 undefined 或 null
			return false;
		}
		if (fs.existsSync(saveTo)) {
			//> 警告：同名文件存在，该文件中的内容将被新内容替代
		}
		try {
			//> 准备以 utf8 编码写入到文件...
			fs.writeFileSync(saveTo, after, 'utf8');
			//> 写入文件成功
			return true;
		} catch(err) {
			//> 写入文件时发生错误
			return false;
		}
		//@leave
	}
}