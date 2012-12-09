﻿<p>在程序中通常需要输出一些文本来描述程序的执行流程。文本输出语句和正常的程序逻辑混杂在一起，导致程序难以阅读。除此之外，文本输出语句通常都没有考虑当前执行的上下文，他们不能正确的表达程序执行过程中的语境。</p>
<p>作为解决这一问题的一点点小小的尝试，我扩展了 javascript 的语法，引入了三种特殊的注释语句。并设计了一个简单的转换器，它能够理解这些扩展语法，并转换为普通的 javascript 源代码。结果是，我们可以用注释来描述程序的执行流程。而最终，这些注释描述也会在程序语句执行的同时显示出来。</p>
<p>程序还很粗糙，还有不少工作要做。<p/>

//@enter<br/>
//> ...<br/>
//@leave<br/>

