<HTML>
<HEAD>
<title>Test</title>
</HEAD>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@ taglib uri="http://www.zkoss.org/jsf/zul" prefix="z"%>
<body>
<f:view>
	<h:form id="helloForm">
		<z:page>
			<z:div>
			A Inlucde Test,<br/>
			1==A Simple JSP<br/>
			<z:include src="/test/empty.jsp"/>
			2==A ZUL<br/>
			<z:include src="/test/includedHello.zul"/>
			3==A SubJSF, it will miss the position. a bug? wait for me find out it.<br/>
			<!--  -->
			</z:div>
		</z:page>
	</h:form>
	
</f:view>
</body>
</HTML>